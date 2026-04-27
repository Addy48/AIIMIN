import React from 'react';

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

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-lg)',
                    padding: '32px 24px',
                    textAlign: 'center',
                    margin: '8px 0',
                }}>
                    <div style={{ fontSize: '28px', marginBottom: '12px' }}>⚠️</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-1)', marginBottom: '8px' }}>
                        {this.props.label || 'Application'} encountered an issue
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '16px', lineHeight: 1.5 }}>
                        This area crashed and was isolated. Check the console log for the component stack trace.
                    </div>
                    <button
                        onClick={this.handleRetry}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            background: 'var(--bg-elevated)',
                            color: 'var(--text-1)',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
