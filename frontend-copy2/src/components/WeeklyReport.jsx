import React, { useState, useEffect } from 'react';
import supabase from '../utils/supabase';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import useFeatureFlag from '../hooks/useFeatureFlag';

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica' },
    header: { marginBottom: 30 },
    title: { fontSize: 24, color: '#e05c2a', marginBottom: 10, fontWeight: 'bold' },
    subtitle: { fontSize: 12, color: '#666666' },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 16, color: '#1a1a1a', marginBottom: 10, fontWeight: 'bold' },
    text: { fontSize: 12, color: '#333333', marginBottom: 6 },
    textSuccess: { fontSize: 12, color: '#5db87a', marginBottom: 4, fontWeight: 'bold' },
    textAccent: { fontSize: 12, color: '#e05c2a', marginBottom: 4, fontWeight: 'bold' },
    footer: { position: 'absolute', bottom: 30, left: 40, fontSize: 10, color: '#999999' }
});

const ReportPDF = ({ report }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Image src="/logo-aiimin.png" style={{ width: 40, height: 40, marginBottom: 16 }} />
                <Text style={styles.title}>AIIMIN Weekly Intelligence</Text>
                <Text style={styles.subtitle}>Generated: {new Date().toLocaleDateString()}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Performance Summary</Text>
                <Text style={styles.text}>• Days Logged: {report.daysLogged}/7</Text>
                <Text style={styles.text}>• Best Performance: {report.bestDay.day} ({report.bestDay.date})</Text>
                {report.avgMood && <Text style={styles.text}>• Average Mood: {report.avgMood}/5.0</Text>}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>System Insights</Text>
                <Text style={styles.textSuccess}>Reinforcement:</Text>
                <Text style={styles.text}>{report.reinforcement}</Text>

                <Text style={[styles.textAccent, { marginTop: 10 }]}>Strategy:</Text>
                <Text style={styles.text}>{report.suggestion}</Text>
            </View>

            <Text style={styles.footer}>AIIMIN Behavioral OS - Internal Report</Text>
        </Page>
    </Document>
);

/**
 * WeeklyReport — Auto-generated weekly intelligence summary
 */
const WeeklyReport = ({ user }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const showPdfExport = useFeatureFlag('pdf_reports');

    // PDF generation handled declaratively by PDFDownloadLink above.

    useEffect(() => {
        if (!user) return;

        const generate = async () => {
            setLoading(true);
            const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

            const { data: logs, error } = await supabase
                .from('daily_logs')
                .select('date, sleep_hours, gym_done, learning_done, mood, steps')
                .eq('user_id', user.id)
                .gte('date', sevenDaysAgo)
                .order('date', { ascending: true });

            if (error || !logs || logs.length < 3) {
                setLoading(false);
                return;
            }

            // Score each day
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const scored = logs.map(l => {
                let s = 0;
                if (l.sleep_hours && l.sleep_hours >= 6) s += 2;
                if (l.gym_done) s += 2;
                if (l.learning_done) s += 1;
                if (l.mood && l.mood >= 4) s += 1;
                if (l.steps && l.steps >= 5000) s += 1;
                const dt = new Date(l.date);
                return { date: l.date, day: dayNames[dt.getDay()], score: s, ...l };
            });

            const best = scored.reduce((a, b) => a.score > b.score ? a : b);
            const worst = scored.reduce((a, b) => a.score < b.score ? a : b);

            // Identify weakest area
            const gymDays = logs.filter(l => l.gym_done).length;
            const learnDays = logs.filter(l => l.learning_done).length;
            const sleepDays = logs.filter(l => l.sleep_hours >= 7).length;
            const areas = [
                { name: 'exercise', count: gymDays },
                { name: 'learning', count: learnDays },
                { name: 'sleep quality', count: sleepDays },
            ];
            const weakest = areas.reduce((a, b) => a.count < b.count ? a : b);

            // Generate messages
            const suggestions = [
                `Focus on ${weakest.name} — you only hit it ${weakest.count}/${logs.length} days this week.`,
                `Try scheduling ${weakest.name} at a fixed time to build the habit.`,
                `Your ${weakest.name} consistency is your biggest opportunity for growth.`,
            ];

            const reinforcements = [
                gymDays >= 5 && '🏋️ Crushed the gym this week — 5+ sessions!',
                learnDays >= 5 && '📚 Learning streak — knowledge compounds!',
                sleepDays >= 5 && '😴 Sleep discipline on point — brain fuel.',
                logs.length >= 6 && '🔥 Logged 6+ days — you showed up consistently.',
            ].filter(Boolean);

            setReport({
                daysLogged: logs.length,
                bestDay: best,
                worstDay: worst,
                suggestion: suggestions[Math.floor(Math.random() * suggestions.length)],
                reinforcement: reinforcements[0] || '🌱 Every log counts. Keep building momentum.',
                avgMood: logs.filter(l => l.mood).length > 0
                    ? (logs.filter(l => l.mood).reduce((s, l) => s + l.mood, 0) / logs.filter(l => l.mood).length).toFixed(1)
                    : null,
            });
            setLoading(false);
        };

        generate();
    }, [user]);

    if (loading) {
        return (
            <div className="insight-card">
                <div className="skeleton skeleton-text" style={{ width: '50%' }} />
                <div className="skeleton skeleton-text" style={{ width: '80%' }} />
            </div>
        );
    }

    if (!report) return null;

    return (
        <div className="insight-card card-hover reveal-up" style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Subtle accent gradient */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--accent), var(--success))' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    📊 Weekly Intelligence
                </div>
                {showPdfExport && (
                    <PDFDownloadLink
                        document={<ReportPDF report={report} />}
                        fileName={`aiimin-weekly-report-${new Date().toISOString().split('T')[0]}.pdf`}
                        style={{
                            background: 'none', border: 'none', color: 'var(--accent)',
                            fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                            padding: '2px 8px', borderRadius: '4px',
                            textDecoration: 'none'
                        }}
                    >
                        {({ loading }) => loading ? 'Preparing...' : 'PDF Export'}
                    </PDFDownloadLink>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '4px' }}>Logged</div>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-1)' }}>{report.daysLogged}/7</div>
                </div>
                <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '4px' }}>Best Day</div>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--success)' }}>{report.bestDay.day}</div>
                </div>
                {report.avgMood && (
                    <div style={{ background: 'var(--bg-elevated)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '4px' }}>Avg Mood</div>
                        <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--accent)' }}>{report.avgMood}</div>
                    </div>
                )}
            </div>

            {/* Reinforcement */}
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success)', marginBottom: '8px' }}>
                {report.reinforcement}
            </div>

            {/* Suggestion */}
            <div style={{ fontSize: '12px', color: 'var(--text-2)', lineHeight: 1.5 }}>
                💡 {report.suggestion}
            </div>
        </div>
    );
};

export default WeeklyReport;
