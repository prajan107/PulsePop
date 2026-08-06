import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  routeName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class RouteErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Route Error Boundary caught crash on [${this.props.routeName || 'Route'}]:`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh] rounded-2xl border border-[#EF4444]/30 bg-[#111827]/80 backdrop-blur-xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EF4444]/10 text-[#EF4444] mb-3">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">
            Unable to render {this.props.routeName || 'this view'}
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-md mb-4">
            An isolated component error occurred on this page. Other application features remain operational.
          </p>
          <Button size="sm" onClick={this.handleReset} className="bg-[#6366F1] hover:bg-[#4F46E5] text-xs">
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry View
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
