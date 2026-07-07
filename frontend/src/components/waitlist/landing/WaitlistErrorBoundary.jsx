import React from 'react';

export default class WaitlistErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err) {
    // eslint-disable-next-line no-console
    console.error('[WaitlistLanding] render error:', err);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="waitlist-fallback">
        <h1>Waitlist page is loading again</h1>
        <p>Something broke while rendering. Please refresh once.</p>
        <a href="/">Reload waitlist</a>
      </div>
    );
  }
}
