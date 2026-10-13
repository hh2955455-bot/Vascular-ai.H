import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  BlackBoxAuditEvent,
  AuditActionType,
  AuditSeverity,
  AuditRetentionPolicyInfo
} from '../types/blackboxAudit';
import {
  generateAuditPdfReport,
  generateAuditJsonExport
} from '../services/auditPdfExport';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Filter,
  Search,
  Download,
  RotateCw,
  X,
  ChevronDown,
  ChevronRight,
  Database,
  Lock,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle2,
  Terminal,
  Activity,
  Copy,
  Check,
  FileText,
  FileCode,
  FileSpreadsheet,
  Printer
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const BlackBoxAuditViewerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { languageMode, showNotification, firebaseUser, userProfile } = useApp();
  const isAr = languageMode === 'ar';

  const [events, setEvents] = useState<BlackBoxAuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [retentionPolicy, setRetentionPolicy] = useState<AuditRetentionPolicyInfo | null>(null);

  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Filters
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeRangePreset, setTimeRangePreset] = useState<'24h' | '7d' | '30d' | '1y' | 'all'>('7d');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAuditLogs();
      fetchRetentionPolicy();
    }
  }, [isOpen, timeRangePreset, actionFilter, severityFilter]);

  // Close export dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportDropdownOpen(false);
      }
    };
    if (isExportDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isExportDropdownOpen]);

  const fetchRetentionPolicy = async () => {
    try {
      const res = await fetch('/api/audit-logs/retention-policy');
      if (res.ok) {
        const data = await res.json();
        setRetentionPolicy(data);
      }
    } catch {
      // Ignore
    }
  };

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (actionFilter !== 'ALL') params.set('actionType', actionFilter);
      if (severityFilter !== 'ALL') params.set('severity', severityFilter);
      if (searchQuery.trim()) params.set('searchQuery', searchQuery.trim());

      const now = Date.now();
      if (timeRangePreset === '24h') {
        params.set('startDate', new Date(now - 24 * 3600 * 1000).toISOString());
      } else if (timeRangePreset === '7d') {
        params.set('startDate', new Date(now - 7 * 86400 * 1000).toISOString());
      } else if (timeRangePreset === '30d') {
        params.set('startDate', new Date(now - 30 * 86400 * 1000).toISOString());
      } else if (timeRangePreset === '1y') {
        params.set('startDate', new Date(now - 365 * 86400 * 1000).toISOString());
      }

      params.set('limit', '250');

      const res = await fetch(`/api/audit-logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.warn('Failed to load audit logs:', err);
      showNotification('Failed to retrieve audit trail.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPdf = () => {
    if (events.length === 0) {
      showNotification(isAr ? 'لا توجد سجلات تدقيق للتصدير.' : 'No audit records to export.');
      return;
    }
    setIsGeneratingPdf(true);
    try {
      const currentOperator =
        firebaseUser?.email ||
        (userProfile?.name ? `${userProfile.name} (${userProfile.specialty || userProfile.studyLevel || 'Vascular Surgery'})` : 'Vascular Surgeon / Clinical Lead');

      generateAuditPdfReport({
        events,
        retentionPolicy,
        timeRangePreset,
        actionFilter,
        severityFilter,
        searchQuery,
        currentUserId: currentOperator
      });

      showNotification(
        isAr
          ? 'تم تصدير تقرير التدقيق الطبي المعتمد (PDF) بنجاح.'
          : 'Official Medical Audit Report (PDF) exported successfully (HIPAA & GDPR Compliant).'
      );
      setIsExportDropdownOpen(false);
    } catch (err) {
      console.error('Failed to generate audit PDF:', err);
      showNotification(isAr ? 'حدث خطأ أثناء تصدير ملف PDF.' : 'Failed to generate PDF audit report.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleExportJson = () => {
    if (events.length === 0) {
      showNotification(isAr ? 'لا توجد سجلات تدقيق للتصدير.' : 'No audit records to export.');
      return;
    }
    try {
      const currentOperator =
        firebaseUser?.email ||
        (userProfile?.name ? `${userProfile.name} (${userProfile.specialty || userProfile.studyLevel || 'Vascular Surgery'})` : 'Vascular Surgeon / Clinical Lead');

      generateAuditJsonExport({
        events,
        retentionPolicy,
        timeRangePreset,
        actionFilter,
        severityFilter,
        searchQuery,
        currentUserId: currentOperator
      });

      showNotification(
        isAr
          ? 'تم تصدير سجلات التدقيق الجنائي بتنسيق JSON بنجاح.'
          : 'Forensic Audit Dataset (JSON) exported successfully with SHA-256 chain.'
      );
      setIsExportDropdownOpen(false);
    } catch (err) {
      console.error('Failed to export audit JSON:', err);
      showNotification(isAr ? 'حدث خطأ أثناء تصدير ملف JSON.' : 'Failed to export JSON audit logs.');
    }
  };

  const handleCopyPayload = (id: string, payload: unknown) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  const actionTypesList: (AuditActionType | 'ALL')[] = [
    'ALL',
    'CALCULATE',
    'CREATE',
    'UPDATE',
    'VIEW',
    'DELETE',
    'SEARCH',
    'EXAM_SUBMIT',
    'CRASH_REPORT',
    'AUTH_LOGIN',
    'FILE_UPLOAD',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-850 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-teal-500/20 text-teal-400 border border-teal-500/30 shrink-0">
              <Shield className="w-6 h-6 text-teal-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  Black Box Audit Trail
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 hidden sm:inline">
                  Append-Only & Immutable
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-white truncate mt-0.5">
                {isAr ? 'سجل الصندوق الأسود والنشاط الجراحي الموثق' : 'Forensic Activity Log & Medical Audit Trail'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchAuditLogs}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
              title="Refresh Audit Trail"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
            </button>

            {/* Export PDF Button */}
            <button
              onClick={handleExportPdf}
              disabled={events.length === 0 || isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 hover:text-white transition cursor-pointer border border-teal-500/40 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export Official Medical Audit Report as PDF (HIPAA § 164.312(b) & GDPR Compliant)"
            >
              <FileText className={`w-3.5 h-3.5 text-teal-400 ${isGeneratingPdf ? 'animate-pulse' : ''}`} />
              <span className="hidden sm:inline">{isGeneratingPdf ? 'Exporting...' : 'PDF Report'}</span>
              <span className="sm:hidden">PDF</span>
            </button>

            {/* Export JSON Button */}
            <button
              onClick={handleExportJson}
              disabled={events.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white transition cursor-pointer border border-slate-700 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export Full Forensic JSON Dataset with SHA-256 Checksums"
            >
              <FileCode className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">JSON</span>
              <span className="sm:hidden">JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 1-Year Retention Policy & Security Status Bar */}
        <div className="p-3 sm:px-5 bg-slate-900 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-850 border border-slate-750">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block truncate">Storage Type</span>
              <strong className="text-white text-[11px] block truncate">Append-Only Immutability</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-850 border border-slate-750">
            <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block truncate">Data Retention</span>
              <strong className="text-white text-[11px] block truncate">Minimum 1 Year (365d)</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-850 border border-slate-750">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block truncate">Integrity Verification</span>
              <strong className="text-white text-[11px] block truncate">SHA-256 Checksum Chain</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-850 border border-slate-750">
            <Database className="w-4 h-4 text-sky-400 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 block truncate">Total Indexed Records</span>
              <strong className="text-white text-[11px] block truncate">
                {retentionPolicy?.totalRecordsCount || events.length} Events
              </strong>
            </div>
          </div>
        </div>

        {/* Query Controls: Time Range, Action Filter, Search */}
        <div className="p-3 sm:p-4 bg-slate-850/60 border-b border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Time range preset tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 px-2 text-[11px] flex items-center gap-1">
                <Clock className="w-3 h-3 text-teal-400" />
                <span className="hidden sm:inline">Range:</span>
              </span>
              {[
                { id: '24h', label: '24h' },
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: '1y', label: '1 Year (Archive)' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTimeRangePreset(t.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                    timeRangePreset === t.id
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 text-[11px] mr-1">Severity:</span>
              {['ALL', 'INFO', 'WARN', 'ERROR', 'CRITICAL'].map(sev => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-mono transition cursor-pointer ${
                    severityFilter === sev
                      ? sev === 'CRITICAL'
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-750 text-teal-300 border border-teal-500/50'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            {/* Action Type Pills */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
              {actionTypesList.map(act => (
                <button
                  key={act}
                  onClick={() => setActionFilter(act)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    actionFilter === act
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-750'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-64 sm:ml-auto">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isAr ? 'بحث في السجلات والمعاملات...' : 'Search actions, route, payload...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchAuditLogs()}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-teal-400"
              />
            </div>
          </div>
        </div>

        {/* Audit Timeline List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <RotateCw className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">
                {isAr ? 'جاري استرجاع سجلات الصندوق الأسود...' : 'Querying append-only audit trail archives...'}
              </p>
            </div>
          ) : events.length === 0 ? (
            <div className="py-16 text-center space-y-3 rounded-2xl bg-slate-850/50 border border-slate-800">
              <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">No Audit Records Found</h4>
                <p className="text-xs text-slate-400">
                  No activity matched the selected filters. Change the time range or clear filters to see more events.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {events.map((evt, idx) => {
                const isExpanded = expandedEventId === evt.eventId;
                const isCritical = evt.severity === 'CRITICAL' || evt.actionType === 'CRASH_REPORT';
                const isError = evt.severity === 'ERROR';
                const isWarn = evt.severity === 'WARN';

                let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
                if (isCritical) badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
                else if (isError) badgeColor = 'bg-red-500/15 text-red-300 border-red-500/30';
                else if (isWarn) badgeColor = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
                else if (evt.actionType === 'CALCULATE') badgeColor = 'bg-teal-500/15 text-teal-300 border-teal-500/30';
                else if (evt.actionType === 'CREATE') badgeColor = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
                else if (evt.actionType === 'AUTH_LOGIN') badgeColor = 'bg-sky-500/15 text-sky-300 border-sky-500/30';

                return (
                  <div
                    key={evt.eventId || idx}
                    className={`rounded-2xl border transition ${
                      isCritical
                        ? 'bg-rose-950/20 border-rose-500/50'
                        : 'bg-slate-850 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Event Summary Row */}
                    <div
                      onClick={() => setExpandedEventId(isExpanded ? null : evt.eventId)}
                      className="p-3 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button className="text-slate-500 hover:text-white transition">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>

                        <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-md border font-bold ${badgeColor}`}>
                          {evt.actionType}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-white truncate">
                              {evt.routeOrScreen}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
                              [{evt.sessionId.slice(-6)}]
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono block">
                            {evt.timestampUtc}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-teal-400 hidden sm:inline" title="SHA-256 Verified">
                          ✓ Hash: {evt.checksum.slice(0, 8)}...
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono ${
                          evt.severity === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {evt.severity}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Event Inspector Drawer */}
                    {isExpanded && (
                      <div className="p-4 bg-slate-900/90 border-t border-slate-800 text-xs space-y-3 animate-in fade-in duration-150">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-400 font-mono text-[11px]">
                          <div>
                            <span className="text-slate-500 block">User Identifier:</span>
                            <strong className="text-white truncate block">{evt.userId}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Session ID:</span>
                            <strong className="text-white truncate block">{evt.sessionId}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Retention Expiration:</span>
                            <strong className="text-teal-400 truncate block">
                              {evt.retentionExpiresAtUtc?.slice(0, 10)} (&ge; 365d Guaranteed)
                            </strong>
                          </div>
                        </div>

                        {/* Payload View */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                              <Terminal className="w-3.5 h-3.5 text-teal-400" />
                              <span>Sanitized Audit Payload (HIPAA/GDPR Safe):</span>
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyPayload(evt.eventId, evt.payload);
                              }}
                              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              {copiedId === evt.eventId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === evt.eventId ? 'Copied' : 'Copy JSON'}</span>
                            </button>
                          </div>

                          <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-48 leading-relaxed">
                            {JSON.stringify(evt.payload, null, 2)}
                          </pre>
                        </div>

                        {/* Tamper Evident Verification Badge */}
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 text-teal-400">
                            <ShieldCheck className="w-4 h-4 shrink-0" />
                            <span>Tamper-Evident SHA-256 Digest:</span>
                            <span className="text-white select-all">{evt.checksum}</span>
                          </div>
                          {evt.prevChecksum && (
                            <span className="text-slate-500">
                              Prev: {evt.prevChecksum.slice(0, 10)}...
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span>
              {isAr
                ? 'السجلات محمية في تخزين Append-Only لمدة 365 يوماً على الأقل (متوافق مع معايير HIPAA و GDPR).'
                : 'Append-Only storage guaranteed for ≥ 365 days (HIPAA § 164.312(b) & GDPR Art. 32 Compliant).'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportPdf}
              disabled={events.length === 0 || isGeneratingPdf}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 hover:text-white transition cursor-pointer border border-teal-500/40 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export Official Medical Audit Report as PDF"
            >
              <FileText className={`w-3.5 h-3.5 text-teal-400 ${isGeneratingPdf ? 'animate-pulse' : ''}`} />
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Export PDF'}</span>
            </button>

            <button
              onClick={handleExportJson}
              disabled={events.length === 0}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white transition cursor-pointer border border-slate-700 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export Full Forensic JSON Dataset"
            >
              <FileCode className="w-3.5 h-3.5 text-purple-400" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-750 hover:bg-slate-700 text-white font-bold transition cursor-pointer border border-slate-650"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
