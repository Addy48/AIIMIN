import React, { useState } from 'react';

const Reports = ({ user }) => {
    // Current local date values for defaults
    const d = new Date();
    const today = d.toLocaleDateString('en-CA');
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).toLocaleDateString('en-CA');

    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate] = useState(today);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        // In a real implementation this would fetch `daily_logs` 
        // between startDate and endDate, process them into CSV or trigger a browser print
        setTimeout(() => {
            setIsGenerating(false);
            alert(`Generated report from ${startDate} to ${endDate}. (PDF generation coming soon)`);
        }, 1500);
    };

    return (
        <div className="fade-up flex flex-col gap-6">

            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '32px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📉</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-1)' }}>Performance Reports</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', margin: '0 0 32px 0', maxWidth: '300px', marginInline: 'auto', lineHeight: 1.5 }}>
                    Generate a detailed breakdown of your habits, focus cycles, and financial ledger for accountability.
                </p>

                <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'stretch' }}>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: '14px', fontFamily: 'inherit' }}
                            />
                        </div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: '14px', fontFamily: 'inherit' }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="hover:scale-[1.02]"
                        style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, var(--accent) 0%, #e05c2a 100%)', color: 'white', fontWeight: 700, fontSize: '15px', cursor: isGenerating ? 'not-allowed' : 'pointer', opacity: isGenerating ? 0.7 : 1, transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(194,120,20,0.2)' }}
                    >
                        {isGenerating ? (
                            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        )}
                        {isGenerating ? 'Compiling Data...' : 'Download PDF Report'}
                    </button>

                </div>
            </div>

        </div>
    );
};

export default Reports;
