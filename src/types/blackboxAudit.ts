export type AuditActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'VIEW'
  | 'DELETE'
  | 'CALCULATE'
  | 'SEARCH'
  | 'EXAM_SUBMIT'
  | 'SESSION_START'
  | 'SESSION_END'
  | 'AUTH_LOGIN'
  | 'AUTH_LOGOUT'
  | 'FILE_UPLOAD'
  | 'FILE_DELETE'
  | 'NOTE_CREATE'
  | 'NOTE_UPDATE'
  | 'CARD_REVIEW'
  | 'CRASH_REPORT'
  | 'SECURITY_EVENT';

export type AuditSeverity = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';

export interface AuditClientMetadata {
  userAgent: string;
  platform: string;
  screenWidth: number;
  screenHeight: number;
  online: boolean;
  language: string;
}

export interface BlackBoxAuditEvent {
  /** Unique Cryptographic Event Identifier */
  eventId: string;
  /** Authenticated User ID or anonymous device ID */
  userId: string;
  /** Unique Session Identifier */
  sessionId: string;
  /** Exact UTC Timestamp with Milliseconds (ISO 8601: YYYY-MM-DDTHH:mm:ss.sssZ) */
  timestampUtc: string;
  /** Epoch Timestamp in Milliseconds for high-speed chronological sorting */
  timestampEpochMs: number;
  /** Standardized Action Category */
  actionType: AuditActionType;
  /** Application Screen, Tab, or Route where action occurred */
  routeOrScreen: string;
  /** Event Severity Level */
  severity: AuditSeverity;
  /** Sanitized Payload (Sensitive Medical Identifiers Redacted/Masked) */
  payload: Record<string, unknown>;
  /** Client Environment & Device Metadata */
  clientMetadata: AuditClientMetadata;
  /** Tamper-evident cryptographic checksum/hash of the event record */
  checksum: string;
  /** Previous event hash in the session chain for blockchain-like tamper evidence */
  prevChecksum?: string;
  /** Expiration Date enforcing minimum 1-Year (365 days) retention requirement */
  retentionExpiresAtUtc: string;
  /** Retention duration in days (minimum 365) */
  retentionDays: number;
}

export interface CrashReportContext {
  crashId: string;
  errorName: string;
  errorMessage: string;
  stackTrace?: string;
  componentStack?: string;
  url: string;
  userId: string;
  sessionId: string;
  timestampUtc: string;
  /** Last N user actions immediately preceding the crash (Ring Buffer Flight Recorder) */
  breadcrumbs: BlackBoxAuditEvent[];
}

export interface AuditLogQueryFilter {
  userId?: string;
  sessionId?: string;
  actionType?: AuditActionType | 'ALL';
  severity?: AuditSeverity | 'ALL';
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface AuditRetentionPolicyInfo {
  policyName: string;
  minRetentionDays: number;
  retentionGuaranteedUntil: string;
  isAppendOnlyEnforced: boolean;
  totalRecordsCount: number;
  activePartitionsCount: number;
  oldestRecordTimestamp?: string;
  newestRecordTimestamp?: string;
}
