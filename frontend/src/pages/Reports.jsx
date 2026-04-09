import React from 'react';
import { ReportsSection } from '../components/system/DashboardSections';
import { useAuth } from '../hooks/useAuth';

/**
 * Reports Page — Report generation with 3 tiers.
 * Will be upgraded in Phase 8 with proper PDF split.
 */
const Reports = () => {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <div>
            <h1 className="text-section" style={{ marginBottom: 'var(--space-6)' }}>Reports</h1>
            <ReportsSection user={user} />
        </div>
    );
};

export default Reports;
