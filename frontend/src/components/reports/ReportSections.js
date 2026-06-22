/**
 * ReportSections.js — Premium section renderers for AIIMIN Life-System PDF Reports.
 * Each function renders one rich, data-driven section into a jsPDF document.
 */
import autoTable from 'jspdf-autotable';
import {
    drawHeader, drawSectionHeader, drawSeparator,
    drawMetricCard, drawScoreBadge, drawRadarChart,
    drawBarChart, drawTrendGraph, drawHabitGrid, drawGoalsTable,
    drawInsightBox, drawEmptyState, normalizeScore, hasData,
    GOLD, drawCoverPage,
} from './ReportPdfUtils';

// ─── Cover Page ─────────────────────────────────────────────────────────────
export function renderCoverPage(doc, ctx) {
    drawCoverPage(doc, ctx);
}

// ─── Executive Summary ────────────────────────────────────────────────────────
export function renderExecutiveSummary(doc, { lhs, momentum, reportMeta }) {
    const scores = lhs?.systemScores || {};
    const global = lhs?.globalScore || 0;
    const topBehavior = momentum?.behaviors?.[0]?.label || 'Build Consistency';

    // Top metric cards
    drawMetricCard(doc, 'Overall LHS Score', `${global}/100`, 14, 44, 56, {
        color: global >= 70 ? [34, 197, 94] : global >= 50 ? [212, 175, 55] : [239, 68, 68],
        bg: [248, 252, 248],
    });
    drawMetricCard(doc, 'Focus Score', `${normalizeScore(lhs?.baseMetrics?.focusScore)}/100`, 75, 44, 56, {
        color: [59, 130, 246],
        bg: [245, 248, 255],
    });
    drawMetricCard(doc, 'Top Pattern', topBehavior.substring(0, 16), 136, 44, 60, {
        color: [139, 92, 246],
        bg: [248, 245, 255],
    });

    // System breakdown bar chart
    drawSectionHeader(doc, 'System Health Breakdown', 82);
    const bars = Object.entries(scores).map(([key, val]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: normalizeScore(val),
        color: val >= 70 ? [34, 197, 94] : val >= 50 ? [212, 175, 55] : [239, 68, 68],
    }));
    drawBarChart(doc, bars, { y: 88, maxValue: 100 });

    // Key insights
    const insights = generateInsights(lhs, momentum);
    if (insights.length > 0) {
        drawInsightBox(doc, '🔍 Key Insights', insights.slice(0, 4), 165, {
            color: [212, 175, 55],
            bgColor: [252, 250, 240],
        });
    }
}

// ─── Life Health Radar ────────────────────────────────────────────────────────
export function renderLifeHealthRadar(doc, { lhs }) {
    const scores = lhs?.systemScores || {};
    
    // Radar chart (centered on left half)
    drawRadarChart(doc, scores, 60, 100);
    
    // Score table on right
    drawSectionHeader(doc, 'System Scores', 50);
    
    const tableData = Object.entries(scores).map(([key, val]) => {
        const score = normalizeScore(val);
        const grade = score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : score >= 35 ? 'D' : 'F';
        const status = score >= 70 ? '✓ Healthy' : score >= 50 ? '~ Moderate' : '✗ Needs Work';
        return [
            key.charAt(0).toUpperCase() + key.slice(1),
            score.toString(),
            grade,
            status,
        ];
    });

    autoTable(doc, {
        startY: 55,
        margin: { left: 115 },
        tableWidth: 81,
        head: [['System', 'Score', 'Grade', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [20, 20, 30],
            textColor: [212, 175, 55],
            fontSize: 8,
            fontStyle: 'bold',
        },
        bodyStyles: { fontSize: 8, cellPadding: 3 },
        alternateRowStyles: { fillColor: [248, 248, 252] },
        didParseCell: ({ cell, row, column }) => {
            if (column.index === 3) {
                const text = cell.text[0] || '';
                if (text.startsWith('✓')) cell.styles.textColor = [34, 197, 94];
                else if (text.startsWith('~')) cell.styles.textColor = [212, 175, 55];
                else if (text.startsWith('✗')) cell.styles.textColor = [239, 68, 68];
            }
        },
    });

    // Base metrics section
    drawSeparator(doc, 148);
    drawSectionHeader(doc, 'Base Metrics', 158);
    
    const baseMetrics = lhs?.baseMetrics || {};
    const metricsData = Object.entries(baseMetrics).map(([key, val]) => {
        const label = key.replace(/([A-Z])/g, ' $1').trim();
        return [label, Number(val || 0).toFixed(1)];
    });

    if (metricsData.length > 0) {
        autoTable(doc, {
            startY: 163,
            head: [['Metric', 'Value']],
            body: metricsData,
            theme: 'striped',
            headStyles: { fillColor: [20, 20, 30], textColor: [212, 175, 55], fontSize: 8 },
            bodyStyles: { fontSize: 8 },
            columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
        });
    }
}

// ─── System Diagnostics ───────────────────────────────────────────────────────
export function renderSystemDiagnostics(doc, { forecast }) {
    const sevenDays = forecast?.sevenDays || {};
    const thirtyDays = forecast?.thirtyDays || {};
    const keys = Object.keys(sevenDays);

    if (!keys.length) {
        drawEmptyState(doc, 'System Diagnostics', 50);
        return;
    }

    drawSectionHeader(doc, '7-Day vs 30-Day Projection', 48);

    const tableData = keys.map(key => {
        const s7 = sevenDays[key] || {};
        const s30 = thirtyDays[key] || {};
        const delta = (s7.projectedChange || 0) - (s30.projectedChange || 0);
        return [
            key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            Number(s7.projectedValue || 0).toFixed(1),
            Number(s30.projectedValue || 0).toFixed(1),
            `${s7.projectedChange >= 0 ? '+' : ''}${Number(s7.projectedChange || 0).toFixed(1)}`,
            `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}`,
        ];
    });

    autoTable(doc, {
        startY: 54,
        head: [['Metric', '7d Value', '30d Value', '7d Change', 'Momentum']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [20, 20, 30], textColor: [212, 175, 55], fontSize: 8.5 },
        bodyStyles: { fontSize: 8.5, cellPadding: 4 },
        alternateRowStyles: { fillColor: [248, 248, 252] },
        didParseCell: ({ cell, column }) => {
            if (column.index === 3 || column.index === 4) {
                const val = parseFloat(cell.text[0]);
                if (!isNaN(val)) {
                    cell.styles.textColor = val > 0 ? [34, 197, 94] : val < 0 ? [239, 68, 68] : [100, 100, 110];
                    cell.styles.fontStyle = 'bold';
                }
            }
        },
    });

    // Trend graph
    drawSectionHeader(doc, 'Trend Visualization', doc.lastAutoTable.finalY + 12);
    drawTrendGraph(doc, sevenDays, doc.lastAutoTable.finalY + 18);
}

// ─── Habits Analysis ─────────────────────────────────────────────────────────
export function renderHabitsAnalysis(doc, { habits = [] }) {
    if (!habits.length) {
        drawEmptyState(doc, 'Habits Analysis', 50);
        return;
    }

    // Summary metrics
    const totalHabits = habits.length;
    const today = new Date().toLocaleDateString('en-CA');
    const completedToday = habits.filter(h => (h.meta?.completedDates || []).includes(today)).length;
    const avgCompletion = habits.reduce((sum, h) => {
        const dates = h.meta?.completedDates || [];
        const pct = dates.length > 0 ? Math.min(100, Math.round((dates.length / 30) * 100)) : 0;
        return sum + pct;
    }, 0) / Math.max(1, totalHabits);

    drawMetricCard(doc, 'Active Habits', totalHabits, 14, 44, 56, { color: [59, 130, 246] });
    drawMetricCard(doc, 'Done Today', `${completedToday}/${totalHabits}`, 75, 44, 56, {
        color: completedToday === totalHabits ? [34, 197, 94] : [212, 175, 55],
    });
    drawMetricCard(doc, 'Avg Completion (30d)', `${Math.round(avgCompletion)}%`, 136, 44, 60, {
        color: avgCompletion >= 70 ? [34, 197, 94] : [239, 68, 68],
    });

    // Habit heatmap grid
    drawSectionHeader(doc, '30-Day Habit Activity Grid', 82);
    drawHabitGrid(doc, habits, 88);

    // Habit performance table
    const tableY = 88 + Math.min(habits.length, 8) * 8 + 16;
    drawSectionHeader(doc, 'Habit Performance Summary', tableY);

    const habitTableData = habits.map(h => {
        const dates = h.meta?.completedDates || [];
        const streak = calcStreakFromDates(dates);
        const last30 = dates.filter(d => {
            const dayDiff = (new Date() - new Date(d)) / 86400000;
            return dayDiff <= 30;
        }).length;
        const pct = Math.round((last30 / 30) * 100);
        return [
            h.emoji + ' ' + h.name,
            h.category || 'General',
            `${streak} days`,
            `${last30}/30`,
            `${pct}%`,
            pct >= 70 ? 'Strong' : pct >= 40 ? 'Building' : 'Needs Work',
        ];
    });

    autoTable(doc, {
        startY: tableY + 6,
        head: [['Habit', 'Category', 'Streak', '30-Day', 'Rate', 'Status']],
        body: habitTableData,
        theme: 'grid',
        headStyles: { fillColor: [20, 20, 30], textColor: [212, 175, 55], fontSize: 8 },
        bodyStyles: { fontSize: 8, cellPadding: 3 },
        alternateRowStyles: { fillColor: [248, 248, 252] },
        didParseCell: ({ cell, column }) => {
            if (column.index === 5) {
                const text = cell.text[0];
                if (text === 'Strong') cell.styles.textColor = [34, 197, 94];
                else if (text === 'Building') cell.styles.textColor = [212, 175, 55];
                else cell.styles.textColor = [239, 68, 68];
                cell.styles.fontStyle = 'bold';
            }
        },
    });
}

// ─── Goals Progress ───────────────────────────────────────────────────────────
export function renderGoalsProgress(doc, { goals = [] }) {
    if (!goals.length) {
        drawEmptyState(doc, 'Goals Progress', 50);
        return;
    }

    const achieved = goals.filter(g => g.status === 'Achieved').length;
    const onTrack = goals.filter(g => g.status === 'On Track').length;
    const atRisk = goals.filter(g => g.status === 'At Risk').length;

    drawMetricCard(doc, 'Total Goals', goals.length, 14, 44, 56, { color: [139, 92, 246] });
    drawMetricCard(doc, 'Achieved', achieved, 75, 44, 56, { color: [34, 197, 94] });
    drawMetricCard(doc, 'At Risk', atRisk, 136, 44, 56, { color: [239, 68, 68] });

    drawSectionHeader(doc, 'Goal Progress Cards', 82);
    drawGoalsTable(doc, goals, 88);

    // Milestone breakdown
    const totalMilestones = goals.reduce((s, g) => s + (g.milestones?.length || 0), 0);
    const doneMilestones = goals.reduce((s, g) => s + (g.milestones?.filter(m => m.done).length || 0), 0);
    const milestonePct = totalMilestones > 0 ? Math.round((doneMilestones / totalMilestones) * 100) : 0;

    const finalY = 88 + Math.min(goals.length, 6) * 22 + 10;
    drawInsightBox(doc, '📌 Milestone Progress', [
        `${doneMilestones} of ${totalMilestones} milestones completed (${milestonePct}%)`,
        `${achieved} goal${achieved !== 1 ? 's' : ''} fully achieved this period`,
        `${onTrack} goal${onTrack !== 1 ? 's' : ''} on track for completion`,
        atRisk > 0 ? `⚠️ ${atRisk} goal${atRisk !== 1 ? 's' : ''} need attention` : '✓ No goals critically at risk',
    ], finalY, { color: [212, 175, 55] });
}

// ─── Trend Analysis ───────────────────────────────────────────────────────────
export function renderTrendAnalysis(doc, { forecast }) {
    const sevenDays = forecast?.sevenDays || {};
    
    drawTrendGraph(doc, sevenDays);

    const keys = Object.keys(sevenDays);
    autoTable(doc, {
        startY: 126,
        head: [['Metric', '7d Change', '30d Change', 'Slope', 'Direction']],
        body: keys.map(key => {
            const s7 = forecast.sevenDays[key] || {};
            const s30 = forecast.thirtyDays?.[key] || {};
            const change = s7.projectedChange || 0;
            const dir = change > 0.5 ? '↑ Improving' : change < -0.5 ? '↓ Declining' : '→ Stable';
            return [
                key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                `${change >= 0 ? '+' : ''}${Number(change).toFixed(2)}`,
                `${s30.projectedChange >= 0 ? '+' : ''}${Number(s30.projectedChange || 0).toFixed(2)}`,
                Number(s7.slope || 0).toFixed(3),
                dir,
            ];
        }),
        theme: 'grid',
        headStyles: { fillColor: [20, 20, 30], textColor: [212, 175, 55], fontSize: 8.5 },
        bodyStyles: { fontSize: 8.5, cellPadding: 4 },
        alternateRowStyles: { fillColor: [248, 248, 252] },
        didParseCell: ({ cell, column }) => {
            if (column.index === 4) {
                const text = cell.text[0] || '';
                if (text.startsWith('↑')) cell.styles.textColor = [34, 197, 94];
                else if (text.startsWith('↓')) cell.styles.textColor = [239, 68, 68];
                else cell.styles.textColor = [100, 100, 110];
                cell.styles.fontStyle = 'bold';
            }
        },
    });
}

// ─── Behavior Drivers ─────────────────────────────────────────────────────────
export function renderBehaviorDrivers(doc, { drivers }) {
    const ranked = Array.isArray(drivers?.rankedDrivers) ? drivers.rankedDrivers : [];

    if (!ranked.length) {
        drawEmptyState(doc, 'Behavior Drivers', 50);
        return;
    }

    // Visual bar chart of impact
    drawSectionHeader(doc, 'Driver Impact Analysis', 48);
    const bars = ranked.slice(0, 8).map(d => ({
        label: d.label,
        value: Math.abs(d.impact || 0),
        color: d.impact > 0 ? [34, 197, 94] : [239, 68, 68],
    }));
    drawBarChart(doc, bars, { y: 54, maxValue: Math.max(1, ...bars.map(b => b.value)) });

    // Detailed table
    autoTable(doc, {
        startY: 54 + bars.length * 14 + 10,
        head: [['Driver', 'Impact', 'When True', 'When False', 'Correlation']],
        body: ranked.slice(0, 10).map(d => [
            d.label,
            `${d.impact > 0 ? '+' : ''}${Number(d.impact || 0).toFixed(1)}`,
            Number(d.avgWhenTrue || 0).toFixed(1),
            Number(d.avgWhenFalse || 0).toFixed(1),
            d.impact > 5 ? 'Strong ↑' : d.impact < -5 ? 'Strong ↓' : 'Moderate',
        ]),
        theme: 'grid',
        headStyles: { fillColor: [20, 20, 30], textColor: [212, 175, 55], fontSize: 8.5 },
        bodyStyles: { fontSize: 8.5, cellPadding: 3.5 },
        alternateRowStyles: { fillColor: [248, 248, 252] },
        didParseCell: ({ cell, column }) => {
            if (column.index === 1) {
                const val = parseFloat(cell.text[0]);
                if (!isNaN(val)) {
                    cell.styles.textColor = val > 0 ? [34, 197, 94] : [239, 68, 68];
                    cell.styles.fontStyle = 'bold';
                }
            }
        },
    });
}

// ─── Best vs Worst Day ────────────────────────────────────────────────────────
export function renderBestVsWorstDay(doc, { report }) {
    const best = report?.bestVsWorstDay?.bestDay;
    const worst = report?.bestVsWorstDay?.worstDay;

    if (!best && !worst) {
        drawEmptyState(doc, 'Peak vs Trough Days', 50);
        return;
    }

    // Best day card
    if (best) {
        const [r, g, b] = [34, 197, 94];
        const score = normalizeScore(best.globalScore);
        drawMetricCard(doc, '🏆 Best Day', best.date || 'N/A', 14, 44, 90, {
            color: [r, g, b],
            bg: [240, 255, 245],
        });
        drawMetricCard(doc, 'Score', `${score}/100`, 110, 44, 86, { color: [r, g, b] });
    }

    if (worst) {
        drawMetricCard(doc, '📉 Trough Day', worst.date || 'N/A', 14, 80, 90, {
            color: [239, 68, 68],
            bg: [255, 242, 242],
        });
        drawMetricCard(doc, 'Score', `${normalizeScore(worst.globalScore)}/100`, 110, 80, 86, {
            color: [239, 68, 68],
        });
    }

    // Comparison table
    autoTable(doc, {
        startY: 118,
        head: [['Metric', 'Best Day', 'Worst Day', 'Delta']],
        body: [
            ['Date', best?.date || 'N/A', worst?.date || 'N/A', '—'],
            ['Overall Score', best?.globalScore || 0, worst?.globalScore || 0, `${((best?.globalScore || 0) - (worst?.globalScore || 0)).toFixed(0)}`],
            ['Sleep Hours', best?.sleep_hours || 0, worst?.sleep_hours || 0, `${((best?.sleep_hours || 0) - (worst?.sleep_hours || 0)).toFixed(1)}`],
            ['Focus Cycles', best?.focus_cycles || 0, worst?.focus_cycles || 0, `${((best?.focus_cycles || 0) - (worst?.focus_cycles || 0)).toFixed(0)}`],
            ['Mood', best?.mood || 0, worst?.mood || 0, `${((best?.mood || 0) - (worst?.mood || 0)).toFixed(0)}`],
            ['Daily Spend', best?.daily_spend || 0, worst?.daily_spend || 0, `${((worst?.daily_spend || 0) - (best?.daily_spend || 0)).toFixed(0)}`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [20, 20, 30], textColor: [212, 175, 55], fontSize: 9 },
        bodyStyles: { fontSize: 9, cellPadding: 4 },
        alternateRowStyles: { fillColor: [248, 248, 252] },
        didParseCell: ({ cell, column, row }) => {
            if (column.index === 3 && row.index > 0) {
                const val = parseFloat(cell.text[0]);
                if (!isNaN(val) && val !== 0) {
                    cell.styles.textColor = val > 0 ? [34, 197, 94] : [239, 68, 68];
                    cell.styles.fontStyle = 'bold';
                }
            }
        },
    });

    // Insights
    const scoreGap = (best?.globalScore || 0) - (worst?.globalScore || 0);
    drawInsightBox(doc, '💡 Day Quality Gap', [
        `Your ${scoreGap.toFixed(0)}-point gap between best and worst days reveals key patterns.`,
        `Best-day sleep: ${best?.sleep_hours || 0}h vs worst-day: ${worst?.sleep_hours || 0}h — sleep is critical.`,
        `Focus sessions: ${best?.focus_cycles || 0} vs ${worst?.focus_cycles || 0} — deep work drives quality.`,
    ], doc.lastAutoTable.finalY + 10);
}

// ─── Behavior Clusters ────────────────────────────────────────────────────────
export function renderBehaviorClusters(doc, { report }) {
    const clusters = Array.isArray(report?.behaviorClusters) ? report.behaviorClusters : [];

    if (!clusters.length) {
        drawEmptyState(doc, 'Behavior Patterns', 50);
        return;
    }

    autoTable(doc, {
        startY: 44,
        head: [['Pattern', 'Occurrences', 'Mood Impact', 'Focus Impact', 'Recommendation']],
        body: clusters.map(c => [
            c.name || 'Unknown Pattern',
            c.count || 0,
            c.moodDelta ? `${c.moodDelta > 0 ? '+' : ''}${c.moodDelta}` : 'N/A',
            c.focusDelta ? `${c.focusDelta > 0 ? '+' : ''}${c.focusDelta}` : 'N/A',
            c.count > 5 ? 'Reinforce this pattern' : 'Build frequency',
        ]),
        theme: 'grid',
        headStyles: { fillColor: [20, 20, 30], textColor: [212, 175, 55], fontSize: 8.5 },
        bodyStyles: { fontSize: 8.5, cellPadding: 4 },
        alternateRowStyles: { fillColor: [248, 248, 252] },
    });
}

// ─── Financial Posture ────────────────────────────────────────────────────────
export function renderFinancialPosture(doc, { report }) {
    const fin = report?.financialPosture || {};
    const score = normalizeScore(fin.financialScore);

    drawMetricCard(doc, 'Financial Health Score', `${score}/100`, 14, 44, 86, {
        color: score >= 70 ? [34, 197, 94] : score >= 50 ? [212, 175, 55] : [239, 68, 68],
    });
    drawMetricCard(doc, 'Spending Drift', fin.spendDrift?.drift ? `${fin.spendDrift.drift > 0 ? '+' : ''}${Number(fin.spendDrift.drift).toFixed(1)}` : 'N/A', 106, 44, 90, {
        color: (fin.spendDrift?.drift || 0) <= 0 ? [34, 197, 94] : [239, 68, 68],
    });

    autoTable(doc, {
        startY: 82,
        head: [['Metric', 'Value', 'Assessment']],
        body: [
            ['Financial Score', score, score >= 70 ? '✓ Healthy' : score >= 50 ? '~ Moderate' : '✗ Needs Work'],
            ['Monthly Spend', fin.spend ? `₹${Number(fin.spend).toLocaleString()}` : 'N/A', '—'],
            ['Monthly Income', fin.income ? `₹${Number(fin.income).toLocaleString()}` : 'N/A', '—'],
            ['Spend Drift', fin.spendDrift?.drift ? `${fin.spendDrift.drift.toFixed(2)}%` : 'N/A', (fin.spendDrift?.drift || 0) > 0 ? '↑ Overspending' : '↓ Under budget'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [20, 20, 30], textColor: [212, 175, 55], fontSize: 9 },
        bodyStyles: { fontSize: 9, cellPadding: 4 },
        alternateRowStyles: { fillColor: [248, 248, 252] },
    });
}

// ─── Stability & Drift ────────────────────────────────────────────────────────
export function renderStabilityAndDrift(doc, { forecast }) {
    const thirtyDays = forecast?.thirtyDays || {};
    const keys = Object.keys(thirtyDays);

    autoTable(doc, {
        startY: 44,
        head: [['Metric', '30d Baseline', '7d Recent', 'Drift', 'Severity', 'Action']],
        body: keys.map(key => {
            const slope = thirtyDays[key]?.slope || 0;
            const sevenVal = forecast.sevenDays?.[key]?.projectedValue || 0;
            const thirtyVal = thirtyDays[key]?.projectedValue || 0;
            const drift = sevenVal - thirtyVal;
            const severity = Math.abs(slope) > 2 ? 'High' : Math.abs(slope) > 0.5 ? 'Medium' : 'Stable';
            return [
                key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                Number(thirtyVal).toFixed(1),
                Number(sevenVal).toFixed(1),
                `${drift >= 0 ? '+' : ''}${drift.toFixed(1)}`,
                severity,
                slope < -1 ? 'Intervene Now' : slope < 0 ? 'Monitor' : 'Maintain',
            ];
        }),
        theme: 'grid',
        headStyles: { fillColor: [20, 20, 30], textColor: [212, 175, 55], fontSize: 8.5 },
        bodyStyles: { fontSize: 8.5, cellPadding: 4 },
        alternateRowStyles: { fillColor: [248, 248, 252] },
        didParseCell: ({ cell, column }) => {
            if (column.index === 4) {
                const text = cell.text[0];
                if (text === 'High') cell.styles.textColor = [239, 68, 68];
                else if (text === 'Medium') cell.styles.textColor = [249, 115, 22];
                else cell.styles.textColor = [34, 197, 94];
                cell.styles.fontStyle = 'bold';
            }
        },
    });
}

// ─── Predictions ──────────────────────────────────────────────────────────────
export function renderPredictions(doc, { forecast }) {
    const sevenDays = forecast?.sevenDays || {};
    const keys = Object.keys(sevenDays);

    drawSectionHeader(doc, '7-Day Predictive Projections', 44);

    autoTable(doc, {
        startY: 50,
        head: [['Metric', '7d Projected', '30d Projected', 'Slope', 'Confidence', 'Outlook']],
        body: keys.map(key => {
            const s7 = sevenDays[key] || {};
            const s30 = forecast.thirtyDays?.[key] || {};
            const slope = s7.slope || 0;
            const confidence = Math.abs(slope) < 0.1 ? 'High' : Math.abs(slope) < 0.5 ? 'Medium' : 'Low';
            const outlook = slope > 0.5 ? '↑ Positive' : slope < -0.5 ? '↓ Negative' : '→ Flat';
            return [
                key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                Number(s7.projectedValue || 0).toFixed(1),
                Number(s30.projectedValue || 0).toFixed(1),
                Number(slope).toFixed(3),
                confidence,
                outlook,
            ];
        }),
        theme: 'grid',
        headStyles: { fillColor: [20, 20, 30], textColor: [212, 175, 55], fontSize: 8.5 },
        bodyStyles: { fontSize: 8.5, cellPadding: 4 },
        alternateRowStyles: { fillColor: [248, 248, 252] },
        didParseCell: ({ cell, column }) => {
            if (column.index === 5) {
                const text = cell.text[0] || '';
                if (text.startsWith('↑')) cell.styles.textColor = [34, 197, 94];
                else if (text.startsWith('↓')) cell.styles.textColor = [239, 68, 68];
                else cell.styles.textColor = [100, 100, 110];
                cell.styles.fontStyle = 'bold';
            }
        },
    });
}

// ─── Momentum Multiplier ──────────────────────────────────────────────────────
export function renderMomentumMultiplier(doc, { momentum, drivers }) {
    const explanation = momentum?.explanation || 'Behavior multipliers show which habits have the highest leverage on your overall performance.';
    drawInsightBox(doc, '⚡ Momentum Overview', [explanation], 44);

    autoTable(doc, {
        startY: 72,
        head: [['Behavior / Driver', 'Multiplier', 'Impact Type', 'Leverage Score']],
        body: (Array.isArray(drivers?.rankedDrivers) ? drivers.rankedDrivers : []).slice(0, 10).map(item => [
            item.label,
            `${item.impact > 0 ? '+' : ''}${Math.round(item.impact || 0)}%`,
            item.impact > 0 ? 'Positive' : 'Negative',
            Math.abs(item.impact || 0) > 10 ? 'High' : Math.abs(item.impact || 0) > 5 ? 'Medium' : 'Low',
        ]),
        theme: 'grid',
        headStyles: { fillColor: [20, 20, 30], textColor: [212, 175, 55], fontSize: 8.5 },
        bodyStyles: { fontSize: 8.5, cellPadding: 4 },
        alternateRowStyles: { fillColor: [248, 248, 252] },
        didParseCell: ({ cell, column }) => {
            if (column.index === 1) {
                const val = parseFloat(cell.text[0]);
                if (!isNaN(val)) {
                    cell.styles.textColor = val > 0 ? [34, 197, 94] : [239, 68, 68];
                    cell.styles.fontStyle = 'bold';
                }
            }
        },
    });
}

// ─── Action Plan ──────────────────────────────────────────────────────────────
export function renderActionPlan(doc, { report, lhs, habits, goals }) {
    // Generate smart action items based on actual data
    const actions = generateActionPlan(report, lhs, habits, goals);

    drawInsightBox(doc, '🎯 Your Personalized Action Plan', [
        'These actions are prioritized based on your data, weakest systems, and highest-leverage opportunities.',
    ], 44, { color: [212, 175, 55] });

    // Priority actions table
    autoTable(doc, {
        startY: 70,
        head: [['Priority', 'Action', 'System', 'Expected Impact', 'Timeframe']],
        body: actions.slice(0, 10).map((item, i) => [
            i < 3 ? '🔴 High' : i < 6 ? '🟡 Medium' : '🟢 Low',
            item.action,
            item.system,
            item.impact,
            item.timeframe || '1-7 days',
        ]),
        theme: 'grid',
        headStyles: { fillColor: [20, 20, 30], textColor: [212, 175, 55], fontSize: 8.5 },
        bodyStyles: { fontSize: 8.5, cellPadding: 4.5 },
        alternateRowStyles: { fillColor: [248, 248, 252] },
        columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 70 },
            2: { cellWidth: 25 },
            3: { cellWidth: 40 },
            4: { cellWidth: 25 },
        },
    });

    // Weekly commitment card
    const finalY = doc.lastAutoTable.finalY + 12;
    drawInsightBox(doc, '📅 This Week\'s Non-Negotiables', [
        actions[0]?.action || 'Complete all daily habits without exception',
        actions[1]?.action || 'Log 2+ deep focus sessions per day',
        actions[2]?.action || 'Review and update at least one goal milestone',
    ], finalY, { color: [34, 197, 94], bgColor: [240, 255, 245] });
}

// ─── Helper: Generate insights ────────────────────────────────────────────────
function generateInsights(lhs, momentum) {
    const insights = [];
    const scores = lhs?.systemScores || {};

    const weakest = Object.entries(scores).sort(([, a], [, b]) => a - b)[0];
    if (weakest) insights.push(`${weakest[0].charAt(0).toUpperCase() + weakest[0].slice(1)} system at ${normalizeScore(weakest[1])}/100 — your biggest growth opportunity`);

    const strongest = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];
    if (strongest) insights.push(`${strongest[0].charAt(0).toUpperCase() + strongest[0].slice(1)} is your strongest system at ${normalizeScore(strongest[1])}/100`);

    if (lhs?.globalScore >= 70) insights.push('Overall performance in the healthy range — keep compounding');
    else if (lhs?.globalScore >= 50) insights.push('Moderate performance — focus on consistency to unlock growth');
    else insights.push('Performance below baseline — prioritize recovery and fundamentals');

    const focusScore = lhs?.baseMetrics?.focusScore;
    if (focusScore !== undefined) {
        if (focusScore < 40) insights.push('Low focus cycles detected — schedule dedicated deep work blocks');
        else if (focusScore > 75) insights.push('Strong focus discipline — leverage this for your highest-priority goals');
    }

    return insights;
}

// ─── Helper: Generate action plan ────────────────────────────────────────────
function generateActionPlan(report, lhs, habits = [], goals = []) {
    const actions = [];
    const scores = lhs?.systemScores || {};

    // Based on system scores
    const sorted = Object.entries(scores).sort(([, a], [, b]) => a - b);
    sorted.slice(0, 2).forEach(([system, score]) => {
        actions.push({
            action: `Prioritize ${system} recovery — currently at ${normalizeScore(score)}/100`,
            system: system.charAt(0).toUpperCase() + system.slice(1),
            impact: '+5-15 LHS points',
            timeframe: '1-2 weeks',
        });
    });

    // Based on habits
    const weakHabits = habits.filter(h => {
        const dates = h.meta?.completedDates || [];
        const last7 = dates.filter(d => (new Date() - new Date(d)) / 86400000 <= 7).length;
        return last7 < 4;
    });
    weakHabits.slice(0, 2).forEach(h => {
        actions.push({
            action: `Recommit to "${h.name}" — missed over half this week`,
            system: 'Habits',
            impact: '+streak & discipline score',
            timeframe: 'Tomorrow',
        });
    });

    // Based on goals
    const atRiskGoals = goals.filter(g => g.status === 'At Risk');
    atRiskGoals.slice(0, 2).forEach(g => {
        actions.push({
            action: `Review goal "${(g.title || 'Untitled').substring(0, 25)}" — change status or update plan`,
            system: 'Goals',
            impact: 'Alignment',
            timeframe: 'This week',
        });
    });

    // Generic high-value items
    actions.push(
        { action: 'Log daily reflections consistently in Journal', system: 'Mindset', impact: '+emotional score', timeframe: 'Daily' },
        { action: 'Complete at least 2 deep focus sessions (90min each)', system: 'Focus', impact: '+cognitive score', timeframe: 'Daily' },
        { action: 'Review and update all goal milestones', system: 'Goals', impact: 'Clarity & momentum', timeframe: 'This week' },
        { action: 'Track all expenses for zero spending blindspots', system: 'Finance', impact: '+financial score', timeframe: 'Daily' },
    );

    return actions.filter(Boolean);
}

// ─── Helper: Calculate streak ─────────────────────────────────────────────────
function calcStreakFromDates(dates = []) {
    let streak = 0;
    const d = new Date();
    while (true) {
        const key = d.toLocaleDateString('en-CA');
        if (dates.includes(key)) { streak++; d.setDate(d.getDate() - 1); }
        else break;
    }
    return streak;
}

// ─── Section Renderer Map ─────────────────────────────────────────────────────
export const SECTION_RENDERERS = {
    coverPage: renderCoverPage,
    executiveSummary: renderExecutiveSummary,
    lifeHealthRadar: renderLifeHealthRadar,
    systemDiagnostics: renderSystemDiagnostics,
    habitsAnalysis: renderHabitsAnalysis,
    goalsProgress: renderGoalsProgress,
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
