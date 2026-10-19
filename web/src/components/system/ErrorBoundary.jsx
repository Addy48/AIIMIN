import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('[ErrorBoundary]', error, errorInfo);

        window.__AIIMIN_ERROR_LOG = window.__AIIMIN_ERROR_LOG || [];
        window.__AIIMIN_ERROR_LOG.push({
            timestamp: new Date().toISOString(),
            message: error?.message || 'Unknown React error',
            stack: errorInfo?.componentStack || error?.stack || null,
        });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    handleHome = () => {
        window.location.href = '/overview';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div
                    role="alert"
                    aria-live="assertive"
                    style={{
                        background: 'var(--color-surface, #2d2d2d)',
                        border: '1px solid var(--color-border, #3a3a3a)',
                        borderRadius: '16px',
                        padding: '36px 24px',
                        textAlign: 'center',
                        margin: '16px auto',
                        maxWidth: '540px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                        <div style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            background: 'rgba(255, 107, 53, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <AlertTriangle size={26} color="var(--color-accent, #ff6b35)" />
                        </div>
                    </div>
                    <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-1, #f5f5f5)', margin: '0 0 8px' }}>
                        {this.props.label || 'Application'} encountered an issue
                    </h2>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-2, #b5b5b5)', margin: '0 0 20px', lineHeight: 1.55 }}>
                        This area was safely isolated to protect your data. You can attempt to reload it or return to the overview.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={this.handleRetry}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 20px',
                                minHeight: '44px',
                                borderRadius: '10px',
                                border: '1px solid var(--color-accent, #ff6b35)',
                                background: 'var(--color-accent, #ff6b35)',
                                color: '#ffffff',
                                fontSize: '13px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <RotateCcw size={14} />
                            Try Again
                        </button>
                        <button
                            type="button"
                            onClick={this.handleHome}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 18px',
                                minHeight: '44px',
                                borderRadius: '10px',
                                border: '1px solid var(--color-border, #4b5563)',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'var(--color-text-1, #f5f5f5)',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <Home size={14} />
                            Overview
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
