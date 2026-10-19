import React from 'react';

/** Prevents Kokonut/Bklit prototype crashes from taking down a whole page. */
export default class SafeRender extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  static getDerivedStateFromError() {
    return { error: true };
  }

  componentDidCatch(error) {
    console.warn(`[SafeRender:${this.props.name || 'component'}]`, error);
  }

  render() {
    if (this.state.error) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
