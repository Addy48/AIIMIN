import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Download, AlertCircle, Calendar, FileText, CheckCircle } from 'lucide-react';

/** Folio Life OS — locked Pro Standard PDF (academic + OS identity, AIIMIN palette). */
const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    backgroundColor: '#faf8f5',
    fontFamily: 'Times-Roman',
  },
  coverPage: {
    padding: 56,
    backgroundColor: '#faf8f5',
    fontFamily: 'Times-Roman',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  coverRule: {
    height: 3,
    width: 72,
    backgroundColor: '#ff6b35',
    marginBottom: 28,
  },
  coverBrand: {
    fontSize: 14,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#ff6b35',
    marginBottom: 12,
    fontFamily: 'Helvetica',
  },
  coverTitle: {
    fontSize: 34,
    marginBottom: 10,
    color: '#14171a',
    lineHeight: 1.15,
  },
  coverSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Helvetica',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 40,
  },
  coverScoreLabel: {
    fontSize: 11,
    color: '#6b7280',
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  coverScore: {
    fontSize: 56,
    color: '#14171a',
    marginBottom: 6,
  },
  coverScoreHint: {
    fontSize: 11,
    color: '#6b7280',
    fontFamily: 'Helvetica',
  },
  coverMeta: {
    fontSize: 10,
    color: '#6b7280',
    fontFamily: 'Helvetica',
    borderTopWidth: 1,
    borderTopColor: '#e7e2da',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1.5,
    borderBottomColor: '#14171a',
    paddingBottom: 14,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    color: '#14171a',
  },
  headerMeta: {
    fontSize: 9,
    color: '#6b7280',
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: { marginBottom: 26 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#14171a',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e7e2da',
    paddingBottom: 6,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e7e2da',
    borderRadius: 2,
    padding: 14,
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 24,
    color: '#14171a',
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
  },
  cardLabel: {
    fontSize: 9,
    color: '#6b7280',
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  insightBox: {
    backgroundColor: '#fffaf4',
    borderLeftWidth: 3,
    borderLeftColor: '#ff6b35',
    padding: 14,
    marginBottom: 16,
  },
  insightText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 1.55,
    fontFamily: 'Helvetica',
  },
  methods: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f3efe8',
    borderRadius: 2,
  },
  methodsTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#14171a',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  methodsText: {
    fontSize: 9,
    color: '#6b7280',
    fontFamily: 'Helvetica',
    lineHeight: 1.45,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e7e2da',
  },
  rowLabel: { fontSize: 11, color: '#52525b', width: '40%', fontFamily: 'Helvetica' },
  rowValue: {
    fontSize: 11,
    color: '#14171a',
    fontFamily: 'Helvetica-Bold',
    width: '20%',
    textAlign: 'right',
  },
  rowBarContainer: {
    width: '40%',
    height: 6,
    backgroundColor: '#e7e2da',
    borderRadius: 2,
  },
  rowBarFill: { height: '100%', backgroundColor: '#ff6b35', borderRadius: 2 },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 48,
    right: 48,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 8,
    fontFamily: 'Helvetica',
    borderTopWidth: 1,
    borderTopColor: '#e7e2da',
    paddingTop: 10,
  },
});

const ReportDocument = ({ data, timeline }) => (
  <Document>
    <Page size="A4" style={styles.coverPage}>
      <View>
        <View style={styles.coverRule} />
        <Text style={styles.coverBrand}>AIIMIN · Life OS</Text>
        <Text style={styles.coverTitle}>Standard Performance Review</Text>
        <Text style={styles.coverSubtitle}>Folio Life OS · Pro report</Text>
        <Text style={styles.coverScoreLabel}>System integrity</Text>
        <Text style={styles.coverScore}>{data.disciplineScore}</Text>
        <Text style={styles.coverScoreHint}>Composite of gym, learning, and mood baselines</Text>
      </View>
      <Text style={styles.coverMeta}>
        Window: {timeline} · Generated {new Date().toLocaleDateString()} · Confidential
      </Text>
    </Page>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Executive dashboard</Text>
        </View>
        <Text style={styles.headerMeta}>{timeline}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key performance indicators</Text>
        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardValue}>{data.avgSleep}h</Text>
            <Text style={styles.cardLabel}>Avg sleep duration</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardValue}>{data.gymConsistency}%</Text>
            <Text style={styles.cardLabel}>Gym consistency</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardValue}>{data.avgMood}/10</Text>
            <Text style={styles.cardLabel}>Avg mood</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardValue}>{data.daysLogged}</Text>
            <Text style={styles.cardLabel}>Days logged</Text>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Review notes</Text>
        <View style={styles.insightBox}>
          <Text style={styles.insightText}>
            {data.daysLogged < 5
              ? 'Insufficient data for a stable review. Continue daily logging to establish baseline telemetry.'
              : `Across this window you averaged ${data.avgSleep}h sleep and ${data.gymConsistency}% gym consistency with mood ${data.avgMood}/10. Treat weak days as signal, not failure — Folio is a performance review, not a scoreboard.`}
          </Text>
        </View>
        <View style={styles.methods}>
          <Text style={styles.methodsTitle}>Methods (window)</Text>
          <Text style={styles.methodsText}>
            Life Score proxies gym + learning + mood. No clinical inference. Elite Deep analysis is paused —
            this Folio Standard report is the Pro artifact.
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Domain breakdown</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Physical vitality</Text>
          <View style={styles.rowBarContainer}>
            <View style={[styles.rowBarFill, { width: `${data.gymConsistency}%` }]} />
          </View>
          <Text style={styles.rowValue}>{data.gymConsistency}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Mood baseline</Text>
          <View style={styles.rowBarContainer}>
            <View style={[styles.rowBarFill, { width: `${Math.min(100, Number(data.avgMood) * 10)}%`, backgroundColor: '#10b981' }]} />
          </View>
          <Text style={styles.rowValue}>{Math.round(Number(data.avgMood) * 10)}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Learning consistency</Text>
          <View style={styles.rowBarContainer}>
            <View style={[styles.rowBarFill, { width: `${data.learningConsistency}%`, backgroundColor: '#14171a' }]} />
          </View>
          <Text style={styles.rowValue}>{data.learningConsistency}%</Text>
        </View>
      </View>
      <Text style={styles.footer}>AIIMIN · Folio Life OS · Standard · Pro+ · Not for clinical use</Text>
    </Page>
  </Document>
);

const PDFReportGenerator = ({ user, rangeLabel, startDate, endDate, days }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eligible, setEligible] = useState(false);
  const [timeline, setTimeline] = useState(rangeLabel || 'Last 30 Days');

  useEffect(() => {
    if (rangeLabel) setTimeline(rangeLabel);
  }, [rangeLabel]);

  useEffect(() => {
    const fetchReportData = async () => {
      if (!user?.id || user.isGuest) {
        setLoading(false);
        setEligible(false);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams({
          days: String(days || (timeline.includes('15') ? 15 : timeline.includes('Year') ? 365 : timeline.includes('Quarter') ? 90 : 30)),
        });
        if (startDate) params.set('start', startDate);
        if (endDate) params.set('end', endDate);

        const { apiGet } = await import('../utils/api');
        const report = await apiGet(`/intelligence/report?${params.toString()}`);
        const rows = report?.meta?.timeline || [];

        if (rows.length < 3) {
          setEligible(false);
          return;
        }

        let totalSleep = 0;
        let validSleepCount = 0;
        let totalMood = 0;
        let validMoodCount = 0;
        let gymDays = 0;
        let learningDays = 0;

        rows.forEach((log) => {
          if (Number(log.sleep_hours) > 0) {
            totalSleep += Number(log.sleep_hours);
            validSleepCount++;
          }
          if (Number(log.mood) > 0) {
            totalMood += Number(log.mood);
            validMoodCount++;
          }
          if (log.gym_done) gymDays++;
          if (log.learning_done) learningDays++;
        });

        const daysLogged = rows.length;
        const avgSleep = validSleepCount > 0 ? (totalSleep / validSleepCount).toFixed(1) : 0;
        const avgMood = validMoodCount > 0 ? (totalMood / validMoodCount).toFixed(1) : 0;
        const gymConsistency = Math.round((gymDays / daysLogged) * 100);
        const learningConsistency = Math.round((learningDays / daysLogged) * 100);
        const disciplineScore = Math.round((gymConsistency + learningConsistency + (Number(avgMood) * 10)) / 3);

        setEligible(true);
        setData({
          daysLogged,
          avgSleep,
          avgMood,
          gymConsistency,
          learningConsistency,
          disciplineScore,
        });
      } catch (err) {
        console.error('Failed to fetch report data', err);
        setEligible(false);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [user?.id, timeline, rangeLabel, startDate, endDate, days]);

  if (loading) {
    return (
      <div style={{ padding: '24px', background: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
        <div style={{ color: 'var(--text-3)', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid var(--text-3)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          Compiling Folio review…
        </div>
      </div>
    );
  }

  if (!eligible) {
    return (
      <div style={{ padding: '32px', background: 'var(--bg-elevated)', borderRadius: '16px', border: '1px dashed var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-1)' }}>Insufficient data</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-3)' }}>At least 3 days of logging required for {timeline}.</p>
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <select
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            style={{ width: '200px', padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-1)', fontSize: '13px' }}
          >
            <option value="Last 15 Days">Last 15 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Quarterly (Q2)">Quarterly (Q2)</option>
            <option value="Year-to-Date">Year-to-Date</option>
          </select>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', background: 'var(--bg-elevated)', borderRadius: '16px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--color-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
            <FileText size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Folio Life OS PDF</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-3)' }}>Pro Standard performance review — academic Folio + Life OS identity.</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '100px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <CheckCircle size={14} /> Data Ready
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>Reporting Period</label>
        {rangeLabel ? (
          <div style={{ padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-1)', fontSize: '14px', fontWeight: 600 }}>
            {timeline}
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <Calendar size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 14px 14px 44px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                color: 'var(--text-1)',
                fontSize: '14px',
                fontWeight: 600,
                appearance: 'none',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="Last 15 Days">Last 15 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Quarterly (Q2)">Quarterly (Q2)</option>
              <option value="Year-to-Date">Year-to-Date</option>
            </select>
            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid var(--text-3)' }} />
          </div>
        )}
      </div>

      <PDFDownloadLink
        document={<ReportDocument data={data} timeline={timeline} />}
        fileName={`AIIMIN_Folio_${timeline.replace(/\s+/g, '_')}.pdf`}
        style={{ textDecoration: 'none' }}
      >
        {({ loading: pdfLoading }) => (
          <button
            type="button"
            disabled={pdfLoading}
            style={{
              width: '100%',
              padding: '16px',
              background: pdfLoading ? 'var(--bg-card)' : 'var(--color-accent)',
              color: pdfLoading ? 'var(--text-3)' : '#fff',
              border: pdfLoading ? '1px solid var(--border)' : 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 800,
              cursor: pdfLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Download size={18} />
            {pdfLoading ? 'Compiling Folio…' : 'Download Folio Life OS PDF'}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default PDFReportGenerator;
