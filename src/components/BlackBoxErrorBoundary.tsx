import React, { Component, ErrorInfo, ReactNode } from 'react';
import { blackbox } from '../services/blackboxInterceptor';
import { AlertOctagon, RotateCcw, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  crashId: string | null;
}

export class BlackBoxErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    crashId: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      crashId: `CRASH-${Date.now().toString(36).toUpperCase()}`,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Transmit crash report with last user action breadcrumbs to Black Box Audit
    blackbox.captureException(error, {
      componentStack: errorInfo.componentStack?.slice(0, 1000),
      source: 'ReactErrorBoundary',
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/50 space-y-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                Black Box Flight Recorder Active
              </span>
              <h2 className="text-xl font-extrabold text-white">
                Application Exception Captured
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected interface exception occurred. The Black Box audit trail has recorded the last state actions, stack trace, and session metadata for forensic review.
              </p>
            </div>

            {this.state.crashId && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between">
                <span className="text-slate-500">Crash Reference ID:</span>
                <span className="text-teal-400 font-bold">{this.state.crashId}</span>
              </div>
            )}

            {this.state.error && (
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/50 text-left text-xs font-mono text-rose-300 overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-950"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Resume & Reload Session</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
