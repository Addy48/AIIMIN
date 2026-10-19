import { Link } from 'react-router-dom';

const LINKS = [
  { to: '/privacy', label: 'Privacy Policy', updated: 'June 2026' },
  { to: '/terms', label: 'Terms of Service', updated: 'June 2026' },
  { to: '/security', label: 'Security Policy', updated: 'June 2026' },
  { to: '/data-deletion', label: 'Data Deletion', updated: 'June 2026' },
];

export default function LegalSection() {
  return (
    <div>
      <h1 className="text-h1" style={{ marginBottom: 24 }}>Legal</h1>
      <section className="card" style={{ padding: 24, marginBottom: 20 }}>
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom: '1px solid var(--color-border)',
              color: 'var(--color-text-1)',
              textDecoration: 'none',
            }}
          >
            <span className="text-body">{l.label}</span>
            <span className="text-caption">Updated {l.updated}</span>
          </Link>
        ))}
      </section>
      <section className="card" style={{ padding: 24 }}>
        <p className="text-sm" style={{ color: 'var(--color-text-2)', marginBottom: 12 }}>
          Compliance: IT Act 2000 · DPDPA 2023 · GDPR · COPPA
        </p>
        <p className="text-caption">
          legal@aiimin.in · privacy@aiimin.in · support@aiimin.in · security@aiimin.in
        </p>
      </section>
    </div>
  );
}
