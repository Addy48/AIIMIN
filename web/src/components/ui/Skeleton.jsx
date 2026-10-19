export function SkeletonCard({ height = 120 }) {
  return (
    <div
      className="skeleton"
      style={{ height, borderRadius: 'var(--r-md)', marginBottom: 16 }}
    />
  );
}

export function SkeletonRow() {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
      <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 8, borderRadius: 4 }} />
        <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 4 }} />
      </div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, padding: '16px 0' }}>
      {[40, 65, 50, 80, 55].map((h, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0' }}
        />
      ))}
    </div>
  );
}
