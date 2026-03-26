import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import supabase from '../utils/supabase';

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

const Reports = ({ user }) => {
    const d = new Date();
    const today = d.toLocaleDateString('en-CA');
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).toLocaleDateString('en-CA');

    const [rangeMode, setRangeMode] = useState('week');
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
            const { data: logs, error } = await supabase
                .from('daily_logs')
                .select('*')
                .eq('user_id', user.id)
                .gte('date', startDate)
                .lte('date', endDate)
                .order('date', { ascending: true });

            if (error) throw error;

            const doc = new jsPDF();
            const totalLogs = logs?.length || 0;
            const daysInRange = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

            // ── PAGE 1: SUMMARY ──
            doc.setFillColor(245, 166, 35);
            doc.rect(0, 0, 210, 35, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('AIIMIN Performance Report', 14, 22);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`${rangeMode === 'week' ? 'Weekly' : rangeMode === 'month' ? 'Monthly' : 'Custom'} Report`, 14, 30);

            doc.setTextColor(80, 80, 80);
            doc.setFontSize(11);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 48);
            doc.text(`Period: ${startDate}  —  ${endDate}  (${daysInRange} days)`, 14, 55);

            // Summary stats
            const gymDays = logs?.filter(l => l.gym_done).length || 0;
            const gymPct = totalLogs ? Math.round((gymDays / totalLogs) * 100) : 0;
            const sleepAvg = totalLogs ? (logs.reduce((acc, l) => acc + (Number(l.sleep_hours) || 0), 0) / totalLogs) : 0;
            const moodAvg = totalLogs ? (logs.reduce((acc, l) => acc + (Number(l.mood) || 0), 0) / totalLogs) : 0;
            const totalSteps = logs?.reduce((acc, l) => acc + (Number(l.steps) || 0), 0) || 0;
            const totalWater = logs?.reduce((acc, l) => acc + (Number(l.water_bottles) || 0), 0) || 0;
            const learningDays = logs?.filter(l => l.learning_done).length || 0;
            const totalRC = logs?.reduce((acc, l) => acc + (Number(l.rc_count) || 0), 0) || 0;

            // Topics
            const topicCounts = {};
            logs?.forEach(l => { if (l.learning_topic) topicCounts[l.learning_topic] = (topicCounts[l.learning_topic] || 0) + 1; });
            const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t);

            // Best/worst day by mood
            const bestDay = logs?.length ? logs.reduce((b, l) => (Number(l.mood) || 0) > (Number(b.mood) || 0) ? l : b, logs[0]) : null;
            const worstDay = logs?.length ? logs.reduce((w, l) => (Number(l.mood) || 0) < (Number(w.mood) || 0) ? l : w, logs[0]) : null;

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Summary Overview', 14, 72);

            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            let y = 82;
            const addLine = (text) => { doc.text(text, 14, y); y += 7; };

            addLine(`• Days Tracked: ${totalLogs} / ${daysInRange}`);
            addLine(`• Gym Sessions: ${gymDays} (${gymPct}%)`);
            addLine(`• Avg Sleep: ${sleepAvg.toFixed(1)} hrs`);
            addLine(`• Avg Mood: ${moodAvg.toFixed(1)} / 10`);
            addLine(`• Total Steps: ${totalSteps.toLocaleString()}`);
            addLine(`• Total Water: ${totalWater} bottles`);
            addLine(`• Learning Days: ${learningDays}`);
            addLine(`• Reset Count: ${totalRC}`);
            if (topTopics.length) addLine(`• Top Topics: ${topTopics.join(', ')}`);
            if (bestDay) addLine(`• Best Mood Day: ${bestDay.date} (${bestDay.mood}/10)`);
            if (worstDay) addLine(`• Lowest Mood Day: ${worstDay.date} (${worstDay.mood}/10)`);

            // ── PAGE 2+: DATA TABLE ──
            if (logs && logs.length > 0) {
                const tableData = logs.map(log => [
                    log.date,
                    log.gym_done ? 'Yes' : 'No',
                    log.sleep_hours ? `${log.sleep_hours}h` : '-',
                    log.mood || '-',
                    log.steps || '-',
                    log.water_bottles || '-',
                    log.learning_done ? (log.learning_topic || 'Yes') : 'No',
                    log.rc_count || 0
                ]);

                doc.autoTable({
                    startY: y + 10,
                    head: [['Date', 'Gym', 'Sleep', 'Mood', 'Steps', 'Water', 'Learning', 'RC']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: { fillColor: [245, 166, 35], fontSize: 9 },
                    bodyStyles: { fontSize: 8 },
                    alternateRowStyles: { fillColor: [250, 247, 242] },
                    margin: { left: 14, right: 14 },
                });
            } else {
                doc.setFontSize(11);
                doc.text('No tracking data found for this period.', 14, y + 10);
            }

            // Footer on all pages
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(9);
                doc.setTextColor(150);
                doc.text(`AIIMIN Dashboard • Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
            }

            const label = rangeMode === 'week' ? 'weekly' : rangeMode === 'month' ? 'monthly' : 'custom';
            doc.save(`aiimin-${label}-report-${startDate}-to-${endDate}.pdf`);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF report.');
        } finally {
            setIsGenerating(false);
        }
    };

    const rangeBtnStyle = (mode) => ({
        flex: 1, padding: '10px 8px', borderRadius: '8px', border: '1px solid var(--border)',
        fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
        background: rangeMode === mode ? 'var(--accent-dim)' : 'var(--bg-card)',
        color: rangeMode === mode ? 'var(--accent)' : 'var(--text-2)',
        outline: rangeMode === mode ? '1px solid var(--border-accent)' : 'none',
    });

    return (
        <div className="fade-up flex flex-col gap-6">

            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', padding: '32px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text-1)' }}>Performance Reports</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-3)', margin: '0 0 32px 0', maxWidth: '320px', marginInline: 'auto', lineHeight: 1.5 }}>
                    Generate a detailed breakdown of your habits, sleep, mood, and progress.
                </p>

                <div style={{ background: 'var(--bg-elevated)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'stretch' }}>

                    {/* Range Selector */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleRangeSelect('week')} style={rangeBtnStyle('week')}>This Week</button>
                        <button onClick={() => handleRangeSelect('month')} style={rangeBtnStyle('month')}>This Month</button>
                        <button onClick={() => handleRangeSelect('custom')} style={rangeBtnStyle('custom')}>Custom Range</button>
                    </div>

                    {/* Custom Date Pickers (only when custom mode) */}
                    {rangeMode === 'custom' && (
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ flex: 1, textAlign: 'left' }}>
                                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: '13px', fontFamily: 'inherit' }}
                                />
                            </div>
                            <div style={{ flex: 1, textAlign: 'left' }}>
                                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-3)', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase' }}>End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: '13px', fontFamily: 'inherit' }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Preview */}
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500, textAlign: 'left', padding: '8px 12px', background: 'var(--bg-card)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        {rangeMode === 'week' ? '📅 Current week (Mon – Today)' : rangeMode === 'month' ? '📅 Current month (1st – Today)' : `📅 ${startDate} to ${endDate}`}
                        {' · '}
                        {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
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
                        {isGenerating ? 'Compiling Data...' : `Download ${rangeMode === 'week' ? 'Weekly' : rangeMode === 'month' ? 'Monthly' : ''} PDF Report`}
                    </button>

                </div>
            </div>

        </div>
    );
};

export default Reports;
