import React from 'react';
import { ReportsSection } from '../components/system/DashboardSections';
import { useAuth } from '../hooks/useAuth';

const Reports = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-text-3)',
          fontFamily: 'var(--font-sans)',
          marginBottom: '8px',
        }}>Reports · Quarterly</div>
        <h1 style={{
          font: 'var(--text-hero)',
          color: 'var(--color-text-1)',
          margin: 0,
          letterSpacing: '-0.02em',
        }}>
          The honest record.
        </h1>
      </div>
      <ReportsSection user={user} />
    </div>
  );
};

export default Reports;
