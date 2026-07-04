import React from 'react';
import { shouldShip } from '../../utils/designVoteShip';
import SafeRender from './SafeRender';
import GradientButton from '../kokonutui/gradient-button';
import Loader from '../kokonutui/loader';
import AiTextLoading from '../kokonutui/ai-text-loading';
import BeamsBackground from '../kokonutui/beams-background';
import BackgroundPaths from '../kokonutui/background-paths';
import FlowField from '../kokonutui/flow-field';
import ScrollText from '../kokonutui/scroll-text';
import ShimmerText from '../kokonutui/shimmer-text';
import GlitchText from '../kokonutui/glitch-text';
import MouseEffectCard from '../kokonutui/mouse-effect-card';
import FileUpload from '../kokonutui/file-upload';

function wrap(name, node, fallback = null) {
  return (
    <SafeRender name={name} fallback={fallback}>
      {node}
    </SafeRender>
  );
}

export function ShippedLoader({ title, subtitle, size = 'md', shipId = 'k-loader' }) {
  if (!shouldShip(shipId)) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-2)', fontSize: 14 }}>
        {title || 'Loading…'}
      </div>
    );
  }
  return wrap('loader', <Loader title={title} subtitle={subtitle} size={size} />, (
    <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-2)', fontSize: 14 }}>{title}</div>
  ));
}

export function ShippedAiLoading({ texts, shipId = 'k-ai-text-load' }) {
  if (!shouldShip(shipId)) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--color-text-2)' }}>
        <span className="aiimin-spin" aria-hidden>⟳</span>
        {texts?.[0] || 'Thinking…'}
      </div>
    );
  }
  return wrap('ai-loading', <AiTextLoading texts={texts} />);
}

export function ShippedPrimaryButton({
  children,
  onClick,
  disabled,
  loading,
  className,
  style,
  type = 'button',
}) {
  const label = loading
    ? (children === 'Join the Waitlist' ? 'Joining…' : 'Saving…')
    : children;

  if (shouldShip('k-gradient-btn')) {
    return wrap('gradient-btn', (
      <GradientButton
        label={label}
        variant="orange"
        onClick={onClick}
        disabled={disabled || loading}
        className={className}
        style={style}
        type={type}
      />
    ), (
      <button type={type} onClick={onClick} disabled={disabled || loading} className={className} style={style}>
        {label}
      </button>
    ));
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={style}
    >
      {label}
    </button>
  );
}

export function ShippedBeamsBackground({ shipId = 'k-beams' }) {
  if (!shouldShip(shipId)) return null;
  return wrap('beams', (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.45 }}>
      <BeamsBackground />
    </div>
  ));
}

export function ShippedBackgroundPaths({ shipId = 'k-paths' }) {
  if (!shouldShip(shipId)) return null;
  return wrap('paths', (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.35 }}>
      <BackgroundPaths />
    </div>
  ));
}

export function ShippedFlowBackdrop({ shipId = 'k-flow' }) {
  if (!shouldShip(shipId)) return null;
  return wrap('flow-field', (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.25, zIndex: 0 }}>
      <FlowField />
    </div>
  ));
}

export function ShippedScrollHeadline({ text, shipId = 'k-scroll-text' }) {
  if (!shouldShip(shipId) || !text) return null;
  return wrap('scroll-text', <ScrollText texts={[text]} />);
}

export function ShippedShimmerLabel({ text, className, shipId = 'k-shimmer-text' }) {
  if (!shouldShip(shipId)) return <span className={className}>{text}</span>;
  return wrap('shimmer-text', (
    <span className={className} style={{ display: 'inline-block' }}>
      <ShimmerText text={text} className="!text-base !p-0" />
    </span>
  ), <span className={className}>{text}</span>);
}

export function ShippedGlitchLabel({ text, shipId = 'k-glitch-text' }) {
  if (!shouldShip(shipId)) return text;
  return wrap('glitch-text', (
    <span style={{ display: 'inline-block', lineHeight: 1.2 }}>
      <GlitchText text={text} size={28} isStatic={false} glitchIntensity="light" />
    </span>
  ), text);
}

export function ShippedMouseCard({ title, description, children, shipId = 'k-mouse-card' }) {
  if (!shouldShip(shipId)) return <div>{children}</div>;
  return wrap('mouse-card', (
    <MouseEffectCard title={title} description={description}>
      {children}
    </MouseEffectCard>
  ), <div>{children}</div>);
}

export function ShippedFileUpload({ shipId = 'k-upload' }) {
  if (!shouldShip(shipId)) return null;
  return wrap('file-upload', <FileUpload />);
}
