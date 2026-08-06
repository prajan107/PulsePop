import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col min-h-screen w-screen items-center justify-center bg-[#0F172A] p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EF4444]/10 text-[#EF4444] mb-4">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-2">Something went wrong</h1>
          <p className="text-xs text-[#94A3B8] max-w-md mb-6">
            An unexpected error occurred in the user interface. Our team has been notified.
          </p>
          <div className="p-3 rounded-lg bg-[#111827] border border-[#1F2937] text-[11px] font-mono text-[#EF4444] max-w-lg mb-6 truncate">
            {this.state.error?.message || 'Unknown runtime exception'}
          </div>
          <Button onClick={this.handleReset} className="bg-[#6366F1] hover:bg-[#4F46E5]">
            <RefreshCw className="mr-2 h-4 w-4" /> Reload Application
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
