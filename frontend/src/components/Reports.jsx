import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from '../utils/toast';
import { apiGet } from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const REPORT_MODES = {
    quick: {
        label: 'Quick Report',
        subtitle: '2 pages',
        sections: ['executiveSummary', 'actionPlan'],
    },
    standard: {
        label: 'Standard Report',
        subtitle: '8 pages',
        sections: ['executiveSummary', 'lifeHealthRadar', 'systemDiagnostics', 'behaviorDrivers', 'bestVsWorstDay', 'financialPosture', 'stabilityAndDrift', 'actionPlan'],
    },
    deep: {
        label: 'Deep Analysis',
        subtitle: '12+ pages',
        sections: ['executiveSummary', 'lifeHealthRadar', 'systemDiagnostics', 'trendAnalysis', 'behaviorDrivers', 'bestVsWorstDay', 'behaviorClusters', 'financialPosture', 'stabilityAndDrift', 'predictions', 'momentumMultiplier', 'actionPlan'],
    },
};

const getDateRange = (mode) => {
    const d = new Date();
    const today = d.toLocaleDateString('en-CA');
    if (mode === 'week') {
        const dayOfWeek = d.getDay();
        const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const monday = new Date(d);
        monday.setDate(d.getDate() - mondayOffset);
        return { start: monday.toLocaleDateString('en-CA'), end: today };
    }
    if (mode === 'month') {
        const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
        return { start: firstDay.toLocaleDateString('en-CA'), end: today };
    }
    return { start: today, end: today };
};

const PAGE_TITLES = {
    executiveSummary: 'Executive Summary',
    lifeHealthRadar: 'Life Health Radar',
    systemDiagnostics: 'System Diagnostics',
    trendAnalysis: 'Trend Analysis',
    behaviorDrivers: 'Behavior Drivers',
    bestVsWorstDay: 'Best vs Worst Day',
    behaviorClusters: 'Behavior Clusters',
    financialPosture: 'Financial Posture',
    stabilityAndDrift: 'Stability + Drift',
    predictions: 'Predictions',
    momentumMultiplier: 'Momentum Multiplier',
    actionPlan: 'Action Plan',
};

function drawHeader(doc, title, subtitle = '') {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(42, 42, 42);
    doc.text(title, 14, 22);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(subtitle, 14, 29);
    doc.setDrawColor(212, 175, 55);
    doc.line(14, 34, 196, 34);
}

function addFooter(doc, page, totalPages) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setTextColor(160);
    doc.text(`AIIMIN Life-System Report • Page ${page} / ${totalPages}`, 105, 286, { align: 'center' });
}

function drawRadarChart(doc, scores = {}) {
    const centerX = 105;
    const centerY = 90;
    const radius = 36;
    const axes = [
        { key: 'physical', label: 'Physical', angle: -90 },
        { key: 'cognitive', label: 'Cognitive', angle: -18 },
        { key: 'discipline', label: 'Behavior', angle: 54 },
        { key: 'financial', label: 'Financial', angle: 126 },
        { key: 'emotional', label: 'Emotional', angle: 198 },
    ];

    doc.setDrawColor(225, 225, 225);
    for (let level = 1; level <= 4; level++) {
        const r = (radius / 4) * level;
        const points = axes.map((axis) => {
            const rad = (axis.angle * Math.PI) / 180;
            return [centerX + (Math.cos(rad) * r), centerY + (Math.sin(rad) * r)];
        });
        doc.lines(points.map((point, index) => [
            point[0] - (index === 0 ? points[points.length - 1][0] : points[index - 1][0]),
            point[1] - (index === 0 ? points[points.length - 1][1] : points[index - 1][1]),
        ]), points[points.length - 1][0], points[points.length - 1][1]);
    }

    doc.setDrawColor(180, 180, 180);
    axes.forEach((axis) => {
        const rad = (axis.angle * Math.PI) / 180;
        const x = centerX + (Math.cos(rad) * radius);
        const y = centerY + (Math.sin(rad) * radius);
        doc.line(centerX, centerY, x, y);
        doc.setFontSize(9);
        doc.text(axis.label, centerX + (Math.cos(rad) * (radius + 10)), centerY + (Math.sin(rad) * (radius + 10)));
    });

    const polygon = axes.map((axis) => {
        const score = Math.max(0, Math.min(100, Number(scores[axis.key] || 0)));
        const scaledRadius = radius * (score / 100);
        const rad = (axis.angle * Math.PI) / 180;
        return [centerX + (Math.cos(rad) * scaledRadius), centerY + (Math.sin(rad) * scaledRadius)];
    });

    doc.setDrawColor(212, 175, 55);
    doc.setFillColor(245, 221, 137);
    doc.lines(polygon.map((point, index) => [
        point[0] - (index === 0 ? polygon[polygon.length - 1][0] : polygon[index - 1][0]),
        point[1] - (index === 0 ? polygon[polygon.length - 1][1] : polygon[index - 1][1]),
    ]), polygon[polygon.length - 1][0], polygon[polygon.length - 1][1], [1, 1], 'FD', true);
}

function drawTrendGraph(doc, forecast = {}) {
    const chartX = 18;
    const chartY = 55;
    const width = 170;
    const height = 60;
    const series = [
        { key: 'lhs', label: 'LHS', color: [212, 175, 55], value: forecast?.lhs?.projectedChange || 0 },
        { key: 'focus_cycles', label: 'Focus', color: [59, 130, 246], value: forecast?.focus_cycles?.projectedChange || 0 },
        { key: 'mood', label: 'Mood', color: [236, 72, 153], value: forecast?.mood?.projectedChange || 0 },
        { key: 'spending', label: 'Spending', color: [249, 115, 22], value: forecast?.spending?.projectedChange || 0 },
    ];
    const maxMagnitude = Math.max(1, ...series.map((item) => Math.abs(item.value)));

    doc.setDrawColor(220, 220, 220);
    doc.rect(chartX, chartY, width, height);
    doc.line(chartX, chartY + (height / 2), chartX + width, chartY + (height / 2));

    series.forEach((item, index) => {
        const startX = chartX + 10;
        const baseY = chartY + 12 + (index * 12);
        const deltaWidth = ((item.value / maxMagnitude) * 70);
        doc.setDrawColor(...item.color);
        doc.setLineWidth(2);
        doc.line(startX, baseY, startX + deltaWidth, baseY - (item.value * 2));
        doc.setTextColor(...item.color);
        doc.setFontSize(9);
        doc.text(`${item.label}: ${item.value >= 0 ? '+' : ''}${item.value.toFixed(2)}`, startX + 80, baseY);
    });
}

const Reports = ({ user }) => {
    const { session } = useAuth();
    const d = new Date();
    const today = d.toLocaleDateString('en-CA');
    const [rangeMode, setRangeMode] = useState('week');
    const [reportMode, setReportMode] = useState('standard');
    const [startDate, setStartDate] = useState(() => getDateRange('week').start);
    const [endDate, setEndDate] = useState(today);
    const [isGenerating, setIsGenerating] = useState(false);

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
            const [report, lhs, forecast, drivers, momentum] = await Promise.all([
                apiGet('/intelligence/report', { session }),
                apiGet('/intelligence/lhs', { session }),
                apiGet('/intelligence/forecast', { session }),
                apiGet('/intelligence/drivers', { session }),
                apiGet('/intelligence/momentum', { session }),
            ]);

            const doc = new jsPDF();
            const sections = REPORT_MODES[reportMode].sections;

            sections.forEach((sectionKey, index) => {
                if (index > 0) doc.addPage();
                drawHeader(doc, PAGE_TITLES[sectionKey], `${REPORT_MODES[reportMode].label} • ${startDate} → ${endDate}`);

                if (sectionKey === 'executiveSummary') {
                    doc.setFontSize(12);
                    doc.setTextColor(70);
                    doc.text(`Global Life Health Score: ${lhs.globalScore}`, 14, 48);
                    doc.text(`Top momentum behavior: ${momentum.topBehavior || 'Insufficient data'}`, 14, 56);
                    autoTable(doc, {
                        startY: 64,
                        head: [['System', 'Score']],
                        body: Object.entries(lhs.systemScores || {}).map(([key, value]) => [key, value]),
                        theme: 'grid',
                    });
                }

                if (sectionKey === 'lifeHealthRadar') {
                    drawRadarChart(doc, lhs.systemScores);
                    autoTable(doc, {
                        startY: 134,
                        head: [['Base Metric', 'Value']],
                        body: Object.entries(lhs.baseMetrics || {}).map(([key, value]) => [key, Number(value).toFixed(1)]),
                        theme: 'plain',
                    });
                }

                if (sectionKey === 'systemDiagnostics') {
                    autoTable(doc, {
                        startY: 44,
                        head: [['Metric', 'Current', 'Previous', 'Delta']],
                        body: (report.systemDiagnostics || []).map((item) => [
                            item.metric,
                            item.current,
                            item.previous,
                            item.delta,
                        ]),
                        theme: 'grid',
                    });
                }

                if (sectionKey === 'trendAnalysis') {
                    drawTrendGraph(doc, forecast.horizons?.sevenDays);
                    autoTable(doc, {
                        startY: 126,
                        head: [['Metric', '7d Change', '30d Change']],
                        body: Object.keys(forecast.horizons?.sevenDays || {}).map((key) => [
                            key,
                            forecast.horizons.sevenDays[key]?.projectedChange || 0,
                            forecast.horizons.thirtyDays[key]?.projectedChange || 0,
                        ]),
                        theme: 'grid',
                    });
                }

                if (sectionKey === 'behaviorDrivers') {
                    autoTable(doc, {
                        startY: 44,
                        head: [['Driver', 'Avg True', 'Avg False', 'Impact']],
                        body: (drivers.rankedDrivers || []).map((item) => [
                            item.label,
                            item.avgWhenTrue,
                            item.avgWhenFalse,
                            item.impact,
                        ]),
                        theme: 'grid',
                    });
                }

                if (sectionKey === 'bestVsWorstDay') {
                    const best = report.bestVsWorstDay?.bestDay;
                    const worst = report.bestVsWorstDay?.worstDay;
                    doc.setFontSize(12);
                    doc.setTextColor(70);
                    doc.text(`Best Day: ${best?.date || 'N/A'} • Score ${best?.globalScore || 0}`, 14, 50);
                    doc.text(`Worst Day: ${worst?.date || 'N/A'} • Score ${worst?.globalScore || 0}`, 14, 62);
                    autoTable(doc, {
                        startY: 74,
                        head: [['Day', 'Sleep', 'Focus', 'Mood', 'Spend']],
                        body: [best, worst].filter(Boolean).map((day) => [
                            day.date,
                            day.sleep_hours,
                            day.focus_cycles,
                            day.mood,
                            day.daily_spend,
                        ]),
                        theme: 'grid',
                    });
                }

                if (sectionKey === 'behaviorClusters') {
                    autoTable(doc, {
                        startY: 44,
                        head: [['Cluster', 'Mood Delta', 'Focus Delta', 'LHS Delta']],
                        body: (report.behaviorClusters || []).map((cluster) => [
                            cluster.label,
                            cluster.deltas.mood,
                            cluster.deltas.focus,
                            cluster.deltas.lhs,
                        ]),
                        theme: 'grid',
                    });
                }

                if (sectionKey === 'financialPosture') {
                    const spendDrift = report.financialPosture?.spendDrift;
                    doc.setFontSize(12);
                    doc.text(`Financial score: ${report.financialPosture?.financialScore || 0}`, 14, 48);
                    doc.text(`Spending drift: ${spendDrift ? spendDrift.drift : 0}`, 14, 58);
                }

                if (sectionKey === 'stabilityAndDrift') {
                    autoTable(doc, {
                        startY: 44,
                        head: [['Metric', 'Baseline', 'Recent', 'Drift', 'Severity']],
                        body: (report.stabilityAndDrift || []).map((item) => [
                            item.label,
                            item.baseline,
                            item.recent,
                            item.drift,
                            item.severity,
                        ]),
                        theme: 'grid',
                    });
                }

                if (sectionKey === 'predictions') {
                    autoTable(doc, {
                        startY: 44,
                        head: [['Metric', '7d Projected', '30d Projected', 'Slope']],
                        body: Object.keys(forecast.horizons?.sevenDays || {}).map((key) => [
                            key,
                            forecast.horizons.sevenDays[key]?.projectedValue || 0,
                            forecast.horizons.thirtyDays[key]?.projectedValue || 0,
                            forecast.horizons.sevenDays[key]?.slope || 0,
                        ]),
                        theme: 'grid',
                    });
                }

                if (sectionKey === 'momentumMultiplier') {
                    doc.setFontSize(14);
                    doc.text(momentum.explanation || 'Insufficient data.', 14, 48);
                    autoTable(doc, {
                        startY: 58,
                        head: [['Behavior', 'Multiplier']],
                        body: (momentum.behaviors || []).map((item) => [item.label, item.multiplierValue]),
                        theme: 'grid',
                    });
                }

                if (sectionKey === 'actionPlan') {
                    autoTable(doc, {
                        startY: 44,
                        head: [['Priority Actions']],
                        body: (report.actionPlan || []).map((item) => [item]),
                        theme: 'grid',
                    });
                }
            });

            const totalPages = doc.internal.getNumberOfPages();
            for (let page = 1; page <= totalPages; page += 1) addFooter(doc, page, totalPages);

            doc.save(`AIIMIN_${REPORT_MODES[reportMode].label.replace(/\s+/g, '_')}_${startDate}.pdf`);
            toast.success(`${REPORT_MODES[reportMode].label} generated`);
        } catch (error) {
            console.error('Report generation failed:', error);
            toast.error(`Report generation failed: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const rangeBtnStyle = (mode) => ({
        flex: 1,
        padding: '10px 8px',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        fontSize: '13px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s',
        background: rangeMode === mode ? 'var(--accent-dim)' : 'var(--bg-card)',
        color: rangeMode === mode ? 'var(--accent)' : 'var(--text-2)',
    });

    const modeBtnStyle = (mode) => ({
        flex: 1,
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        background: reportMode === mode ? 'linear-gradient(135deg, rgba(212,175,55,0.18), rgba(224,92,42,0.12))' : 'var(--bg-card)',
        color: reportMode === mode ? 'var(--text-1)' : 'var(--text-2)',
        cursor: 'pointer',
        textAlign: 'left',
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

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, var(--accent) 0%, #e05c2a 100%)',
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '15px',
                            cursor: isGenerating ? 'not-allowed' : 'pointer',
                            opacity: isGenerating ? 0.7 : 1,
                        }}
                    >
                        {isGenerating ? 'Generating Report...' : `Generate ${REPORT_MODES[reportMode].label}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reports;
