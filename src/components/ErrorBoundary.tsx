import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[CoLead ErrorBoundary caught an error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 text-[#342F2A]">
          <div className="max-w-md w-full rounded-2xl border border-[#B8A48D]/50 bg-[#FBF9F5] p-8 text-center shadow-lg space-y-5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E8DED2] text-[#5B5045] mx-auto border border-[#B8A48D]/60">
              <AlertTriangle className="h-6 w-6 text-[#5B5045]" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-bold text-[#342F2A]">
                Something went wrong
              </h2>
              <p className="text-sm text-[#5B5045] leading-relaxed">
                CoLead encountered an issue while rendering this view. Your organizational data is safe.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#B8A48D] bg-[#E8DED2] hover:bg-[#D4C3B3] text-xs font-semibold text-[#342F2A] transition-all cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#342F2A] hover:bg-[#5B5045] text-xs font-semibold text-[#F3F0E9] transition-all cursor-pointer"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Return to Overview</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
