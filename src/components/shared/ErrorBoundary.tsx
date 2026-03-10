// src/components/shared/ErrorBoundary.tsx
import React from 'react';
import { Link } from '@tanstack/react-router';
import { RefreshCw, Home } from 'lucide-react';

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-cgs-cream px-4">
          {/* Broken plant SVG */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="mb-6 opacity-60"
            fill="none"
          >
            <circle cx="60" cy="60" r="58" fill="#B7E4C7" />
            <path
              d="M60 90V50M60 50C60 40 50 30 40 35M60 50C60 38 70 28 80 32"
              stroke="#2D6A4F"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M50 75L60 70M70 75L60 70"
              stroke="#2D6A4F"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line x1="40" y1="60" x2="45" y2="55" stroke="#8B5E3C" strokeWidth="2" strokeLinecap="round" />
          </svg>

          <h1 className="mb-3 font-display text-3xl font-bold italic text-cgs-forest">
            Something went wrong
          </h1>
          <p className="mb-8 max-w-md text-center text-cgs-charcoal/70">
            {this.state.error?.message || 'An unexpected error occurred. Our team has been notified.'}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => this.setState({ hasError: false })}
              className="flex items-center gap-2 rounded-lg bg-cgs-sage px-5 py-2.5 font-medium text-white transition hover:bg-cgs-moss"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-lg border border-cgs-mist bg-white px-5 py-2.5 font-medium text-cgs-forest transition hover:bg-cgs-mist/30"
            >
              <Home size={16} />
              Go to Dashboard
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
