import React from 'react';

export default class PrototypeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="ui-lab-fallback">
          <p className="ui-lab-fallback__title">Preview unavailable</p>
          <p className="ui-lab-fallback__msg">{this.props.name || 'Component'} failed to render in this theme.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
