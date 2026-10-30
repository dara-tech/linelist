import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans text-slate-900">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-200">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Something went wrong</h2>
              <p className="text-xs text-slate-500 mt-1">
                An unexpected error occurred while rendering the application.
              </p>
              {this.state.error?.message && (
                <pre className="mt-3 p-2.5 rounded bg-slate-100 text-[11px] font-mono text-rose-700 text-left overflow-x-auto border border-slate-200">
                  {this.state.error.message}
                </pre>
              )}
            </div>
            <Button
              variant="default"
              onClick={this.handleReset}
              className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
