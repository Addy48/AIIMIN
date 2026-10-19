import React from 'react';
import { motion } from 'framer-motion';
import { Download, X, FileText, Target, Activity, TrendingUp, ChevronRight } from 'lucide-react';
import { REPORT_MODES, PAGE_TITLES } from './ReportPdfUtils';

/**
 * @deprecated Compatibility-only preview. The mounted Reports route uses
 * ReportWorkspace and the current standard export uses PDFReportGenerator.
 */
const SECTION_ICONS = {
    coverPage: '📋',
    executiveSummary: '📊',
    lifeHealthRadar: '🎯',
    systemDiagnostics: '⚙️',
    habitsAnalysis: '✅',
    goalsProgress: '🏆',
    trendAnalysis: '📈',
    behaviorDrivers: '🧠',
    bestVsWorstDay: '⚡',
    behaviorClusters: '🔍',
    financialPosture: '💰',
    stabilityAndDrift: '📉',
    predictions: '🔮',
    momentumMultiplier: '🚀',
    actionPlan: '📌',
};

const ReportPreviewModal = ({ ctx, onClose, onDownload, reportMode = 'standard', startDate, endDate }) => {
    const mode = REPORT_MODES[reportMode] || REPORT_MODES.standard;
    const sections = mode.sections || [];
    const lhs = ctx?.lhs || null;
    const dimensions = lhs?.dimensions || {};
    const domainValue = (domain) => {
        const value = dimensions[domain]?.score ?? lhs?.systemScores?.[domain];
        return value == null || !Number.isFinite(Number(value)) ? '—' : Math.round(Number(value));
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.88)',
            zIndex: 99999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(12px)',
            padding: '20px',
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    background: 'var(--bg-card, #1a1a24)',
                    border: '1px solid var(--border, #2a2a3a)',
                    borderRadius: '24px',
                    padding: '0',
                    width: '100%',
                    maxWidth: '640px',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '28px 32px 20px',
                    borderBottom: '1px solid var(--border, #2a2a3a)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={{
                                width: '44px', height: '44px',
                                background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(224,92,42,0.1))',
                                borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '22px',
                            }}>
                                {mode.emoji || '📊'}
                            </div>
                            <div>
                                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-1, #fff)', letterSpacing: '-0.01em' }}>
                                    {mode.label} Ready
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-3, #888)', marginTop: '2px' }}>
                                    {startDate} → {endDate} · {sections.length} sections · Professional PDF
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'var(--bg-elevated, #252535)',
                        border: '1px solid var(--border, #2a2a3a)',
                        color: 'var(--text-2, #aaa)',
                        width: '32px', height: '32px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', fontWeight: 600,
                    }}>
                        <X size={16} />
                    </button>
                </div>

                {/* Score preview */}
                {ctx?.lhs && (
                    <div style={{ padding: '16px 32px', borderBottom: '1px solid var(--border, #2a2a3a)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '10px' }}>
                            {[
                                { label: 'Life Score', value: lhs.globalScore == null || !Number.isFinite(Number(lhs.globalScore)) ? '—' : Math.round(Number(lhs.globalScore)), color: '#749dc4', suffix: '/100' },
                                { label: 'Body', value: domainValue('physical'), color: '#749dc4', suffix: '' },
                                { label: 'Mind', value: domainValue('cognitive'), color: '#416180', suffix: '' },
                                { label: 'Discipline', value: domainValue('discipline'), color: '#749dc4', suffix: '' },
                                { label: 'Money · Mood', value: `${domainValue('financial')} · ${domainValue('emotional')}`, color: '#416180', suffix: '' },
                            ].map((m) => (
                                <div key={m.label} style={{
                                    background: 'var(--bg-elevated, #252535)',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    textAlign: 'center',
                                    border: '1px solid var(--border, #2a2a3a)',
                                }}>
                                    <div style={{ fontSize: '20px', fontWeight: 900, color: m.color }}>
                                        {m.value}{m.suffix}
                                    </div>
                                    <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-3, #888)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '3px' }}>
                                        {m.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sections list */}
                <div style={{ padding: '16px 32px', overflowY: 'auto', flex: 1 }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-3, #888)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                        Report Contents · {sections.length} Sections
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {sections.filter(s => s !== 'coverPage').map((sectionKey, i) => (
                            <div key={sectionKey} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '10px 12px',
                                background: 'var(--bg-elevated, #252535)',
                                borderRadius: '10px',
                                border: '1px solid var(--border, #2a2a3a)',
                            }}>
                                <span style={{ fontSize: '16px', width: '20px', flexShrink: 0 }}>
                                    {SECTION_ICONS[sectionKey] || '📄'}
                                </span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-1, #fff)' }}>
                                        {PAGE_TITLES[sectionKey] || sectionKey}
                                    </div>
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--text-3, #888)', fontWeight: 600 }}>
                                    Pg {i + 2}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div style={{ padding: '20px 32px', borderTop: '1px solid var(--border, #2a2a3a)', display: 'flex', gap: '12px' }}>
                    <button onClick={onClose} style={{
                        flex: 1, padding: '14px', background: 'transparent',
                        color: 'var(--text-2, #aaa)',
                        border: '1px solid var(--border, #2a2a3a)',
                        borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'inherit',
                    }}>
                        Cancel
                    </button>
                    <button
                        onClick={() => { onDownload(); onClose(); }}
                        style={{
                            flex: 2, padding: '14px',
                            background: 'linear-gradient(135deg, #D4AF37 0%, #e05c2a 100%)',
                            color: '#fff', border: 'none',
                            borderRadius: '12px', fontSize: '14px', fontWeight: 800, cursor: 'pointer',
                            fontFamily: 'inherit',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            boxShadow: '0 4px 24px rgba(212,175,55,0.35)',
                        }}
                    >
                        <Download size={16} />
                        Download {mode.label} PDF
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ReportPreviewModal;
