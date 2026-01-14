import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

interface GlobalErrorBoundaryProps {
  children?: ReactNode;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
  state: GlobalErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Global Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 p-8 text-center font-sans">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Startup Error</h1>
            <p className="text-slate-500 mb-6">The application failed to start properly.</p>
            
            <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm font-mono text-left mb-6 overflow-auto max-h-40 border border-red-100">
              {this.state.error?.message || "Unknown error"}
            </div>

            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
            >
              Clear Data & Restart
            </button>
          </div>
        </div>
      );
    }
    // Cast this to any to avoid "Property 'props' does not exist" error in some TS configurations
    return (this as any).props.children;
  }
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <GlobalErrorBoundary>
        <App />
      </GlobalErrorBoundary>
    </React.StrictMode>
  );
} catch (e) {
  console.error("Fatal mounting error:", e);
  rootElement.innerHTML = '<div style="padding: 20px; color: red;">Fatal Error: Failed to mount application. Check console.</div>';
}