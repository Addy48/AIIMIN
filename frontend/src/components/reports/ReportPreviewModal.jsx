import React from 'react';

const ReportPreviewModal = ({ ctx, onClose, onDownload }) => {
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <div className="fade-up" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '600px', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '28px' }}>📑</span>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>Report Generated</div>
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-3)', paddingLeft: '40px' }}>Your comprehensive 12-page life analysis is ready.</div>
                    </div>
                    <button onClick={onClose} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-2)', width: '32px', height: '32px', borderRadius: '50%', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>

                <div style={{ background: 'var(--bg-elevated)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '32px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>Report Contents</div>
                    <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', color: 'var(--text-1)', fontSize: '14px', fontWeight: 500 }}>
                        <li>Executive Summary & Life Health Score (LHS) Analysis</li>
                        <li>System Diagnostics & Capacity Bottlenecks</li>
                        <li>30-Day Trend Analysis & Moving Averages</li>
                        <li>Behavioral Drivers & Correlation Matrices</li>
                        <li>Predictive Trajectory & Action Plan</li>
                    </ul>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '16px', background: 'transparent', color: 'var(--text-1)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                    <button onClick={() => { onDownload(); onClose(); }} style={{ flex: 2, padding: '16px', background: 'linear-gradient(135deg, var(--accent) 0%, #e05c2a 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 20px rgba(212,175,55,0.4)' }}>Download Full PDF</button>
                </div>
            </div>
        </div>
    );
};

export default ReportPreviewModal;
