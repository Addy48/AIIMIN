import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import toast from '../utils/toast';
import { apiGet } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { useMockData } from '../providers/MockDataProvider';
import { REPORT_MODES, PAGE_TITLES, drawHeader, addFooter, getDateRange } from './reports/ReportPdfUtils';
import { SECTION_RENDERERS } from './reports/ReportSections';
import ReportPreviewModal from './reports/ReportPreviewModal';
import { useLHSData } from '../hooks/useLHSData';

/**
 * Reports Component — Orchestrates report generation across Quick, Standard, and Deep tiers.
 * PDF rendering is delegated to modular section renderers in reports/ReportSections.js.
 */
const Reports = ({ user }) => {
    const { session } = useAuth();
    const { isUsingMock, mockData } = useMockData() || {};
    const today = new Date().toLocaleDateString('en-CA');
    const [rangeMode, setRangeMode] = useState('week');
    const [reportMode, setReportMode] = useState('standard');
    const [startDate, setStartDate] = useState(() => getDateRange('week').start);
    const [endDate, setEndDate] = useState(today);
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewCtx, setPreviewCtx] = useState(null);

    const { lhsData, reportData } = useLHSData(session);

    const handleRangeSelect = (mode) => {
        setRangeMode(mode);
        if (mode !== 'custom') {
            const { start, end } = getDateRange(mode);
            setStartDate(start);
            setEndDate(end);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            if (!lhsData || !reportData) {
                throw new Error("No data available from the global context to generate reports.");
            }

            const ctx = {
                report: {
                    ...reportData,
                    behaviorClusters: reportData.archetypes,
                    financialPosture: { spend: 0, income: 0, spendDrift: { drift: 0 } }
                },
                lhs: {
                    ...lhsData,
                    globalScore: Math.round((lhsData.systemScores?.physical + lhsData.systemScores?.cognitive + lhsData.systemScores?.discipline + lhsData.systemScores?.financial + lhsData.systemScores?.emotional) / 5) || 0
                },
                forecast: reportData.trendAnalysis?.forecast,
                drivers: reportData.behaviorDrivers,
                momentum: { behaviors: [], topBehavior: 'Consistent Routine' }
            };

            setPreviewCtx(ctx);
        } catch (error) {
            console.error('Report generation failed:', error);
            toast.error(`Report generation failed: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadPdf = () => {
        if (!previewCtx) return;
        const doc = new jsPDF();
        const sections = REPORT_MODES[reportMode].sections;

        sections.forEach((sectionKey, index) => {
            if (index > 0) doc.addPage();
            drawHeader(doc, PAGE_TITLES[sectionKey], `${REPORT_MODES[reportMode].label} • ${startDate} → ${endDate}`);
            const renderer = SECTION_RENDERERS[sectionKey];
            if (renderer) renderer(doc, previewCtx);
        });

        const totalPages = doc.internal.getNumberOfPages();
        for (let page = 1; page <= totalPages; page++) addFooter(doc, page, totalPages);

        doc.save(`AIIMIN_${REPORT_MODES[reportMode].label.replace(/\s+/g, '_')}_${startDate}.pdf`);
        toast.success(`${REPORT_MODES[reportMode].label} generated`);
    };

    const rangeBtnStyle = (mode) => ({
        flex: 1, padding: '10px 8px', borderRadius: '8px', border: '1px solid var(--border)',
        fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
        background: rangeMode === mode ? 'var(--accent-dim)' : 'var(--bg-card)',
        color: rangeMode === mode ? 'var(--accent)' : 'var(--text-2)',
    });

    const modeBtnStyle = (mode) => ({
        flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border)',
        background: reportMode === mode ? 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(224,92,42,0.12))' : 'var(--bg-card)',
        color: reportMode === mode ? 'var(--text-1)' : 'var(--text-2)',
        cursor: 'pointer', textAlign: 'left',
    });

    return (
        <div className="fade-up flex flex-col gap-6">
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', padding: '32px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
                    <div style={{ maxWidth: '420px' }}>
                        <div style={{ fontSize: '42px', marginBottom: '12px' }}>📊</div>
                        <h3 style={{ fontSize: '24px', fontWeight: 900, margin: '0 0 10px', color: 'var(--text-1)' }}>Advanced Reporting</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-3)', margin: 0, lineHeight: 1.6 }}>
                            Generate Quick, Standard, or Deep Analysis reports from the Life-System analytics engines, including radar diagnostics, trend projections, and behavior impact tables.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px', flex: 1, minWidth: '280px' }}>
                        {Object.entries(REPORT_MODES).map(([key, mode]) => (
                            <button key={key} onClick={() => setReportMode(key)} style={modeBtnStyle(key)}>
                                <div style={{ fontSize: '13px', fontWeight: 800 }}>{mode.label}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '4px' }}>{mode.subtitle}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '24px', background: 'var(--bg-elevated)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleRangeSelect('week')} style={rangeBtnStyle('week')}>This Week</button>
                        <button onClick={() => handleRangeSelect('month')} style={rangeBtnStyle('month')}>This Month</button>
                        <button onClick={() => handleRangeSelect('custom')} style={rangeBtnStyle('custom')}>Custom</button>
                    </div>

                    {rangeMode === 'custom' && (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)' }} />
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)' }} />
                        </div>
                    )}

                    <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 600 }}>
                        {REPORT_MODES[reportMode].label} • {startDate} to {endDate}
                    </div>

                    <button onClick={handleGenerate} disabled={isGenerating} style={{
                        width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
                        background: 'linear-gradient(135deg, var(--accent) 0%, #e05c2a 100%)',
                        color: '#fff', fontWeight: 800, fontSize: '15px',
                        cursor: isGenerating ? 'not-allowed' : 'pointer',
                        opacity: isGenerating ? 0.7 : 1,
                    }}>
                        {isGenerating ? 'Generating Report...' : `Generate ${REPORT_MODES[reportMode].label}`}
                    </button>
                    {previewCtx && <ReportPreviewModal ctx={previewCtx} onClose={() => setPreviewCtx(null)} onDownload={downloadPdf} />}
                </div>
            </div>
        </div>
    );
};

export default Reports;
