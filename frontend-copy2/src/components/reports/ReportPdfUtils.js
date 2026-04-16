/**
 * Report PDF Utilities — shared drawing functions for all report tiers.
 */

export const REPORT_MODES = {
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

export const PAGE_TITLES = {
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

export function drawHeader(doc, title, subtitle = '') {
    // Top Page Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(20, 20, 20);
    doc.text('AIIMIN Life-System Report', 14, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(120, 120, 120);
    doc.text(subtitle, 14, 26);

    // Header Separator
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.line(14, 32, 196, 32);

    // Section Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text(title, 14, 46);
}

export function drawSectionHeader(doc, title, y) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(60, 60, 60);
    doc.text(title, 14, y);
}

export function drawSeparator(doc, y) {
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.2);
    doc.line(14, y, 196, y);
}

export function drawMetricCard(doc, label, value, x, y, width, trend = null) {
    doc.setFillColor(252, 252, 252);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, width, 26, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(140, 140, 140);
    doc.text(label, x + 6, y + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text(String(value), x + 6, y + 20);

    if (trend !== null && trend !== undefined) {
        doc.setFontSize(11);
        const up = trend > 0;
        doc.setTextColor(up ? 34 : 220, up ? 197 : 50, up ? 94 : 50);
        doc.text(up ? '↑' : '↓', x + width - 12, y + 16);
    }
}

export function drawEmptyState(doc, title, y) {
    drawSectionHeader(doc, title, y);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(150, 150, 150);
    doc.text("Insufficient data to generate insights for this period.", 14, y + 10);
}

export function normalizeScore(value) {
    if (value === null || value === undefined || isNaN(value)) return 0;
    return Math.min(100, Math.max(0, Math.round(Number(value))));
}

export function hasData(arr) {
    return Array.isArray(arr) && arr.length > 0;
}

export function addFooter(doc, page, totalPages) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.setTextColor(160);
    doc.text(`AIIMIN Life-System Report • Page ${page} / ${totalPages}`, 105, 286, { align: 'center' });
}

export function drawRadarChart(doc, scores = {}) {
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

export function drawTrendGraph(doc, forecast = {}) {
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

export function getDateRange(mode) {
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
}
