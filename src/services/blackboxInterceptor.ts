import {
  BlackBoxAuditEvent,
  AuditActionType,
  AuditSeverity,
  CrashReportContext,
} from '../types/blackboxAudit';
import { sanitizeAuditPayload, computeTamperEvidentChecksum } from './auditSanitizer';

const MAX_RING_BUFFER_SIZE = 30; // Last N actions for crash forensics
const BATCH_FLUSH_INTERVAL_MS = 4000; // Background flush every 4 seconds
const BATCH_SIZE_THRESHOLD = 10;
const STORAGE_QUEUE_KEY = 'vascular_blackbox_pending_events';
const STORAGE_CRASH_KEY = 'vascular_blackbox_pending_crash';
const RETENTION_DAYS_GUARANTEE = 365; // Minimum 1-Year Retention

class BlackBoxInterceptor {
  private sessionId: string;
  private userId: string;
  private ringBuffer: BlackBoxAuditEvent[] = [];
  private pendingQueue: BlackBoxAuditEvent[] = [];
  private flushTimer: any = null;
  private lastChecksum: string = 'GENESIS_BLOCK';
  private isInitialized = false;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.userId = this.getStoredUserId();
  }

  public init(userId?: string) {
    if (this.isInitialized) return;
    this.isInitialized = true;

    if (userId) {
      this.userId = userId;
    }

    // Load unflushed events from local storage if any existed from previous page close
    this.loadPendingFromStorage();

    // Start background asynchronous flush timer
    this.startFlushTimer();

    // Register global error listeners for Crash Context Forensics
    this.registerGlobalErrorListeners();

    // Install automatic User UI interaction interceptor
    this.installUserInteractionInterceptor();

    // Check if there was an unsent crash report from a previous crash
    this.checkAndFlushPendingCrash();

    // Log session start
    this.log('SESSION_START', 'AppBootstrap', {
      url: typeof window !== 'undefined' ? window.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      timestamp: new Date().toISOString(),
    });

    // Flush on page unload without slowing down UI
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.log('SESSION_END', 'WindowBeforeUnload', { reason: 'PageUnload' });
        this.flush(true);
      });
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flush(false);
        }
      });
    }
  }

  /**
   * Safe Fetch Interceptor Wrapper (Non-Mutating).
   * Does NOT modify or overwrite global window.fetch (preventing "getter only" errors).
   * Transparently proxies any HTTP call while asynchronously capturing Black Box audit metadata.
   */
  public async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const startTime = performance.now();
    const url = typeof input === 'string'
      ? input
      : input instanceof URL
      ? input.toString()
      : input instanceof Request
      ? input.url
      : 'unknown';

    const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    const isAuditEndpoint = url.includes('/api/audit-logs');

    // Use native fetch without mutating window
    const nativeFetch = typeof window !== 'undefined' && window.fetch
      ? window.fetch.bind(window)
      : globalThis.fetch;

    try {
      const response = await nativeFetch(input, init);
      const durationMs = Math.round(performance.now() - startTime);

      if (!isAuditEndpoint) {
        // Dispatched asynchronously in background
        this.log(
          method === 'GET' ? 'VIEW' : method === 'POST' ? 'CREATE' : method === 'DELETE' ? 'DELETE' : 'UPDATE',
          `API:${url.replace(/^https?:\/\/[^/]+/, '')}`,
          {
            method,
            url: url.replace(/^https?:\/\/[^/]+/, ''),
            status: response.status,
            durationMs,
            ok: response.ok,
          },
          response.status >= 500 ? 'ERROR' : response.status >= 400 ? 'WARN' : 'INFO'
        ).catch(() => {});
      }

      return response;
    } catch (err: any) {
      const durationMs = Math.round(performance.now() - startTime);
      if (!isAuditEndpoint) {
        this.log(
          'CRASH_REPORT',
          `API_FAIL:${url.replace(/^https?:\/\/[^/]+/, '')}`,
          {
            method,
            url: url.replace(/^https?:\/\/[^/]+/, ''),
            durationMs,
            errorMessage: err?.message || 'Network request failed',
          },
          'ERROR'
        ).catch(() => {});
      }
      throw err;
    }
  }

  /**
   * Intercepts DOM clicks on buttons and key elements without blocking UI events.
   */
  private installUserInteractionInterceptor() {
    if (typeof window === 'undefined') return;

    let lastClickTime = 0;
    window.addEventListener(
      'click',
      (e: MouseEvent) => {
        const now = Date.now();
        // Debounce rapid continuous clicks to avoid flooding
        if (now - lastClickTime < 300) return;
        lastClickTime = now;

        const target = e.target as HTMLElement | null;
        if (!target) return;

        const interactiveEl = target.closest('button, a, [role="button"], input[type="submit"]');
        if (!interactiveEl) return;

        const label = (interactiveEl.getAttribute('aria-label') ||
          interactiveEl.getAttribute('title') ||
          interactiveEl.textContent ||
          '').trim().slice(0, 50);

        const role = interactiveEl.tagName.toLowerCase();

        this.log('VIEW', `UI:${role}`, {
          targetLabel: label,
          element: role,
          clientX: e.clientX,
          clientY: e.clientY,
        }).catch(() => {});
      },
      { passive: true, capture: true }
    );
  }

  /**
   * Helper to manually track business logic state changes (e.g. calculation, exam, note)
   */
  public trackStateChange(
    actionType: AuditActionType,
    screen: string,
    details: Record<string, unknown> = {},
    severity: AuditSeverity = 'INFO'
  ): void {
    this.log(actionType, screen, details, severity).catch(() => {});
  }

  public setUserId(userId: string) {
    if (userId && this.userId !== userId) {
      this.userId = userId;
      this.log('AUTH_LOGIN', 'AuthContext', { newUserId: userId });
    }
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getBreadcrumbs(): BlackBoxAuditEvent[] {
    return [...this.ringBuffer];
  }

  /**
   * Log a user action asynchronously.
   * Runs in microseconds without impacting UI thread rendering.
   */
  public async log(
    actionType: AuditActionType,
    routeOrScreen: string,
    payload: Record<string, unknown> = {},
    severity: AuditSeverity = 'INFO'
  ): Promise<void> {
    const timestamp = new Date();
    const timestampUtc = timestamp.toISOString();
    const timestampEpochMs = timestamp.getTime();

    // Calculate 1-Year retention date (Timestamp + 365 days)
    const retentionDate = new Date(timestampEpochMs + RETENTION_DAYS_GUARANTEE * 86400000);
    const retentionExpiresAtUtc = retentionDate.toISOString();

    const sanitizedPayload = sanitizeAuditPayload(payload);
    const eventId = `bb-${timestampEpochMs}-${Math.random().toString(36).substring(2, 8)}`;

    const checksum = await computeTamperEvidentChecksum({
      eventId,
      userId: this.userId,
      sessionId: this.sessionId,
      timestampEpochMs,
      actionType,
      routeOrScreen,
      payload: sanitizedPayload,
      prevChecksum: this.lastChecksum,
    });
    this.lastChecksum = checksum;

    const event: BlackBoxAuditEvent = {
      eventId,
      userId: this.userId,
      sessionId: this.sessionId,
      timestampUtc,
      timestampEpochMs,
      actionType,
      routeOrScreen,
      severity,
      payload: sanitizedPayload,
      clientMetadata: this.getClientMetadata(),
      checksum,
      prevChecksum: this.lastChecksum,
      retentionExpiresAtUtc,
      retentionDays: RETENTION_DAYS_GUARANTEE,
    };

    // 1. Maintain Circular Ring Buffer for Crash Diagnostics
    this.ringBuffer.push(event);
    if (this.ringBuffer.length > MAX_RING_BUFFER_SIZE) {
      this.ringBuffer.shift();
    }

    // 2. Add to Pending Asynchronous Dispatch Queue
    this.pendingQueue.push(event);
    this.savePendingToStorage();

    // 3. Flush if queue reached threshold or critical severity
    if (this.pendingQueue.length >= BATCH_SIZE_THRESHOLD || severity === 'CRITICAL' || severity === 'ERROR') {
      this.flush(false);
    }
  }

  /**
   * Flushes queued audit logs to the backend append-only endpoint.
   * Uses navigator.sendBeacon during unloads or background fetch with keepalive.
   */
  public async flush(useBeacon = false): Promise<void> {
    if (this.pendingQueue.length === 0) return;

    const eventsToFlush = [...this.pendingQueue];
    this.pendingQueue = [];
    this.savePendingToStorage();

    const payloadString = JSON.stringify({
      events: eventsToFlush,
      sessionId: this.sessionId,
      userId: this.userId,
    });

    const endpoint = '/api/audit-logs/batch';

    if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
      try {
        const blob = new Blob([payloadString], { type: 'application/json' });
        const success = navigator.sendBeacon(endpoint, blob);
        if (success) return;
      } catch {
        // Fallback to fetch if sendBeacon fails
      }
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payloadString,
        keepalive: true,
      });

      if (!res.ok) {
        // Re-queue events if network failed
        this.pendingQueue = [...eventsToFlush, ...this.pendingQueue];
        this.savePendingToStorage();
      }
    } catch {
      // Re-queue in storage on offline or error
      this.pendingQueue = [...eventsToFlush, ...this.pendingQueue];
      this.savePendingToStorage();
    }
  }

  /**
   * Captures unhandled exception or crash context with flight recorder breadcrumbs.
   */
  public captureException(error: Error | unknown, context?: Record<string, unknown>): void {
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stackTrace = error instanceof Error ? error.stack : undefined;

    const crashContext: CrashReportContext = {
      crashId: `crash-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      errorName,
      errorMessage,
      stackTrace,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userId: this.userId,
      sessionId: this.sessionId,
      timestampUtc: new Date().toISOString(),
      breadcrumbs: [...this.ringBuffer],
    };

    // Save locally first in case process terminates immediately
    try {
      localStorage.setItem(STORAGE_CRASH_KEY, JSON.stringify(crashContext));
    } catch {
      // Ignore storage errors
    }

    // Log as critical black box audit event
    this.log('CRASH_REPORT', 'CrashDetector', {
      errorName,
      errorMessage,
      stackTrace: stackTrace?.slice(0, 1000),
      context: context || {},
      breadcrumbsCount: crashContext.breadcrumbs.length,
    }, 'CRITICAL');

    // Attempt emergency transmission via sendBeacon
    const crashPayload = JSON.stringify(crashContext);
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      try {
        const blob = new Blob([crashPayload], { type: 'application/json' });
        navigator.sendBeacon('/api/audit-logs/crash-report', blob);
      } catch {
        // Fail gracefully
      }
    }
  }

  private registerGlobalErrorListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event: ErrorEvent) => {
      this.captureException(event.error || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      this.captureException(event.reason, { type: 'UnhandledPromiseRejection' });
    });
  }

  private async checkAndFlushPendingCrash() {
    try {
      const stored = localStorage.getItem(STORAGE_CRASH_KEY);
      if (stored) {
        localStorage.removeItem(STORAGE_CRASH_KEY);
        await fetch('/api/audit-logs/crash-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: stored,
        });
      }
    } catch {
      // Ignore recovery errors
    }
  }

  private startFlushTimer() {
    if (this.flushTimer) clearInterval(this.flushTimer);
    this.flushTimer = setInterval(() => {
      this.flush(false);
    }, BATCH_FLUSH_INTERVAL_MS);
  }

  private getOrCreateSessionId(): string {
    const KEY = 'vascular_blackbox_session_id';
    try {
      let sid = sessionStorage.getItem(KEY);
      if (!sid) {
        sid = `ses-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem(KEY, sid);
      }
      return sid;
    } catch {
      return `ses-tmp-${Date.now()}`;
    }
  }

  private getStoredUserId(): string {
    try {
      const profile = localStorage.getItem('vascular_user_profile');
      if (profile) {
        const parsed = JSON.parse(profile);
        if (parsed.id) return parsed.id;
      }
    } catch {
      // Ignore
    }
    return 'anonymous_surgeon';
  }

  private getClientMetadata() {
    if (typeof window === 'undefined') {
      return {
        userAgent: 'server',
        platform: 'node',
        screenWidth: 0,
        screenHeight: 0,
        online: true,
        language: 'en',
      };
    }
    return {
      userAgent: navigator.userAgent.slice(0, 150),
      platform: navigator.platform || 'web',
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      online: navigator.onLine,
      language: navigator.language || 'en',
    };
  }

  private loadPendingFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_QUEUE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          this.pendingQueue = [...parsed, ...this.pendingQueue];
        }
      }
    } catch {
      // Ignore
    }
  }

  private savePendingToStorage() {
    try {
      if (this.pendingQueue.length === 0) {
        localStorage.removeItem(STORAGE_QUEUE_KEY);
      } else {
        localStorage.setItem(STORAGE_QUEUE_KEY, JSON.stringify(this.pendingQueue.slice(0, 50)));
      }
    } catch {
      // Storage quota exceeded or disabled
    }
  }
}

// Global Singleton Export
export const blackbox = new BlackBoxInterceptor();

/**
 * Drop-in safe fetch function with built-in Black Box audit interception.
 * Does NOT mutate window.fetch, avoiding "getter only" browser errors.
 *
 * Usage:
 *   import { secureAuditFetch } from './services/blackboxInterceptor';
 *   const response = await secureAuditFetch('/api/my-endpoint', { method: 'POST', body: ... });
 */
export const secureAuditFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  return blackbox.fetch(input, init);
};

export const auditFetch = secureAuditFetch;
