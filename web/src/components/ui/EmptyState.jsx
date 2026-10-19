export default function EmptyState({
  illustration,
  message,
  subtext,
  actionLabel,
  onAction,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
      }}
    >
      {illustration && (
        <div style={{ width: 80, height: 80, marginBottom: 24, opacity: 0.6 }}>
          {illustration}
        </div>
      )}
      <p
        className="text-h3"
        style={{ margin: '0 0 8px', color: 'var(--color-text-1)' }}
      >
        {message}
      </p>
      {subtext && (
        <p className="text-sm" style={{ margin: '0 0 24px', color: 'var(--color-text-2)', maxWidth: 360 }}>
          {subtext}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          className="btn-primary"
          onClick={onAction}
          style={{
            padding: '12px 24px',
            background: 'var(--color-accent)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
