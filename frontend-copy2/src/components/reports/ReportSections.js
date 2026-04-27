/**
 * Report Section Renderers — each function renders one section into a jsPDF doc.
 */
import autoTable from 'jspdf-autotable';
import { drawRadarChart, drawTrendGraph, drawSectionHeader, drawMetricCard, drawSeparator } from './ReportPdfUtils';

export function renderExecutiveSummary(doc, { lhs, momentum }) {
    drawSectionHeader(doc, 'Global Performance Metrics', 52);

    const w = 55;
    const gap = 8;
    const topBehavior = momentum?.behaviors?.[0]?.label || 'Needs Data';

    drawMetricCard(doc, 'Life Health Score', lhs.globalScore || 0, 14, 60, w, 2.5);
    drawMetricCard(doc, 'Top Behavior', topBehavior, 14 + w + gap, 60, w);
    drawMetricCard(doc, 'Focus Score', lhs.baseMetrics?.focusScore || 0, 14 + (w + gap) * 2, 60, w, 1.2);

    drawSeparator(doc, 92);
    drawSectionHeader(doc, 'System Breakdown', 104);

    autoTable(doc, {
        startY: 112,
        head: [['System', 'Score']],
        body: Object.entries(lhs.systemScores || {}).map(([key, value]) => [key, value]),
        theme: 'grid',
    });
}

export function renderLifeHealthRadar(doc, { lhs }) {
    drawRadarChart(doc, lhs.systemScores);
    autoTable(doc, {
        startY: 134,
        head: [['Base Metric', 'Value']],
        body: Object.entries(lhs.baseMetrics || {}).map(([key, value]) => [key, Number(value).toFixed(1)]),
        theme: 'plain',
    });
}

export function renderSystemDiagnostics(doc, { forecast }) {
    autoTable(doc, {
        startY: 44,
        head: [['Metric', 'Current', 'Previous', 'Delta']],
        body: Object.keys(forecast?.sevenDays || {}).map((key) => [
            key,
            forecast.sevenDays[key]?.projectedValue || 0,
            forecast.thirtyDays[key]?.projectedValue || 0,
            forecast.sevenDays[key]?.projectedChange || 0
        ]),
        theme: 'grid',
    });
}

export function renderTrendAnalysis(doc, { forecast }) {
    drawTrendGraph(doc, forecast?.sevenDays);
    autoTable(doc, {
        startY: 126,
        head: [['Metric', '7d Change', '30d Change']],
        body: Object.keys(forecast?.sevenDays || {}).map((key) => [
            key,
            forecast.sevenDays[key]?.projectedChange || 0,
            forecast.thirtyDays[key]?.projectedChange || 0,
        ]),
        theme: 'grid',
    });
}

export function renderBehaviorDrivers(doc, { drivers }) {
    autoTable(doc, {
        startY: 44,
        head: [['Driver', 'Avg True', 'Avg False', 'Impact']],
        body: (Array.isArray(drivers?.rankedDrivers) ? drivers.rankedDrivers : []).map((item) => [item.label, item.avgWhenTrue, item.avgWhenFalse, item.impact]),
        theme: 'grid',
    });
}

export function renderBestVsWorstDay(doc, { report }) {
    const best = report.bestVsWorstDay?.bestDay;
    const worst = report.bestVsWorstDay?.worstDay;
    doc.setFontSize(12);
    doc.setTextColor(70);
    doc.text(`Best Day: ${best?.date || 'N/A'} • Score ${best?.globalScore || 0}`, 14, 50);
    doc.text(`Worst Day: ${worst?.date || 'N/A'} • Score ${worst?.globalScore || 0}`, 14, 62);
    autoTable(doc, {
        startY: 74,
        head: [['Day', 'Sleep', 'Focus', 'Mood', 'Spend']],
        body: [best, worst].filter(Boolean).map((day) => [day.date, day.sleep_hours, day.focus_cycles, day.mood, day.daily_spend]),
        theme: 'grid',
    });
}

export function renderBehaviorClusters(doc, { report }) {
    autoTable(doc, {
        startY: 44,
        head: [['Cluster', 'Mood Delta', 'Focus Delta', 'LHS Delta']],
        body: (Array.isArray(report?.behaviorClusters) ? report.behaviorClusters : []).map((c) => [c.name, c.count || 0, '-', '-']),
        theme: 'grid',
    });
}

export function renderFinancialPosture(doc, { report }) {
    const spendDrift = report.financialPosture?.spendDrift;
    doc.setFontSize(12);
    doc.text(`Financial score: ${report.financialPosture?.financialScore || 0}`, 14, 48);
    doc.text(`Spending drift: ${spendDrift ? spendDrift.drift : 0}`, 14, 58);
}

export function renderStabilityAndDrift(doc, { forecast }) {
    autoTable(doc, {
        startY: 44,
        head: [['Metric', 'Baseline', 'Recent', 'Drift', 'Severity']],
        body: Object.keys(forecast?.thirtyDays || {}).map((key) => {
            const slope = forecast.thirtyDays[key]?.slope || 0;
            return [
                key,
                forecast.thirtyDays[key]?.projectedValue || 0,
                forecast.sevenDays[key]?.projectedValue || 0,
                slope,
                slope < 0 ? 'High' : 'Stable'
            ];
        }),
        theme: 'grid',
    });
}

export function renderPredictions(doc, { forecast }) {
    autoTable(doc, {
        startY: 44,
        head: [['Metric', '7d Projected', '30d Projected', 'Slope']],
        body: Object.keys(forecast?.sevenDays || {}).map((key) => [
            key,
            forecast.sevenDays[key]?.projectedValue || 0,
            forecast.thirtyDays[key]?.projectedValue || 0,
            forecast.sevenDays[key]?.slope || 0,
        ]),
        theme: 'grid',
    });
}

export function renderMomentumMultiplier(doc, { momentum, drivers }) {
    doc.setFontSize(14);
    doc.text(momentum.explanation || 'Key behavior multipliers based on causal impact.', 14, 48);
    autoTable(doc, {
        startY: 58,
        head: [['Behavior', 'Multiplier']],
        body: (Array.isArray(drivers?.rankedDrivers) ? drivers.rankedDrivers : []).map((item) => [item.label, `${item.impact > 0 ? '+' : ''}${Math.round(item.impact)}%`]),
        theme: 'grid',
    });
}

export function renderActionPlan(doc, { report }) {
    autoTable(doc, {
        startY: 44,
        head: [['Priority Actions']],
        body: (Array.isArray(report?.actionPlan) ? report.actionPlan : []).map((item) => [item]),
        theme: 'grid',
    });
}

// Map section key to render function
export const SECTION_RENDERERS = {
    executiveSummary: renderExecutiveSummary,
    lifeHealthRadar: renderLifeHealthRadar,
    systemDiagnostics: renderSystemDiagnostics,
    trendAnalysis: renderTrendAnalysis,
    behaviorDrivers: renderBehaviorDrivers,
    bestVsWorstDay: renderBestVsWorstDay,
    behaviorClusters: renderBehaviorClusters,
    financialPosture: renderFinancialPosture,
    stabilityAndDrift: renderStabilityAndDrift,
    predictions: renderPredictions,
    momentumMultiplier: renderMomentumMultiplier,
    actionPlan: renderActionPlan,
};
