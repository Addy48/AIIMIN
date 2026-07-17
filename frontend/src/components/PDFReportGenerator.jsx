import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Download, AlertCircle, Calendar, FileText, CheckCircle } from 'lucide-react';
import { apiPost } from '../utils/api';

/** Folio Life OS — Pro Standard PDF. White body + ivory header band. */
const IVORY = '#EDE4D3';
const INK = '#14171a';
const MUTED = '#6b7280';
const ACCENT = '#ff6b35';
const LINE = '#e7e2da';

const styles = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingBottom: 56,
    paddingHorizontal: 0,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Times-Roman',
  },
  ivoryBand: {
    height: 18,
    backgroundColor: IVORY,
    marginBottom: 28,
  },
  pageInner: {
    paddingHorizontal: 48,
  },
  coverPage: {
    paddingTop: 0,
    paddingBottom: 48,
    paddingHorizontal: 0,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Times-Roman',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  coverInner: {
    paddingHorizontal: 56,
    paddingTop: 36,
    flexGrow: 1,
  },
  coverRule: {
    height: 3,
    width: 72,
    backgroundColor: ACCENT,
    marginBottom: 22,
  },
  coverBrand: {
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: ACCENT,
    marginBottom: 14,
    fontFamily: 'Helvetica',
  },
  coverTitle: {
    fontSize: 38,
    marginBottom: 10,
    color: INK,
    lineHeight: 1.1,
  },
  coverSubtitle: {
    fontSize: 11,
    color: MUTED,
    fontFamily: 'Helvetica',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 28,
  },
  fingerprintLabel: {
    fontSize: 8,
    fontFamily: 'Courier',
    color: MUTED,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  fingerprintRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 36,
    gap: 2,
    marginBottom: 28,
  },
  fingerprintBar: {
    flexGrow: 1,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },
  coverScoreLabel: {
    fontSize: 10,
    color: MUTED,
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  coverScore: {
    fontSize: 64,
    color: INK,
    marginBottom: 6,
  },
  coverScoreHint: {
    fontSize: 11,
    color: MUTED,
    fontFamily: 'Helvetica',
  },
  coverMeta: {
    marginHorizontal: 56,
    fontSize: 9,
    color: MUTED,
    fontFamily: 'Helvetica',
    borderTopWidth: 1,
    borderTopColor: LINE,
    paddingTop: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1.5,
    borderBottomColor: INK,
    paddingBottom: 12,
    marginBottom: 28,
  },
  headerTitle: {
    fontSize: 26,
    color: INK,
  },
  headerMeta: {
    fontSize: 8,
    color: MUTED,
    fontFamily: 'Courier',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    color: INK,
    marginBottom: 14,
  },
  sectionKicker: {
    fontSize: 8,
    fontFamily: 'Courier',
    color: MUTED,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 2,
    padding: 14,
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 26,
    color: INK,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 8,
    color: MUTED,
    fontFamily: 'Courier',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  insightBox: {
    backgroundColor: '#fffaf4',
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
    padding: 16,
    marginBottom: 18,
  },
  insightText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 1.65,
    fontFamily: 'Helvetica',
  },
  methods: {
    marginTop: 8,
    padding: 12,
    backgroundColor: IVORY,
    borderRadius: 2,
  },
  methodsTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: INK,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  methodsText: {
    fontSize: 9,
    color: MUTED,
    fontFamily: 'Helvetica',
    lineHeight: 1.45,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },
  rowLabel: { fontSize: 11, color: '#52525b', width: '40%', fontFamily: 'Helvetica' },
  rowValue: {
    fontSize: 11,
    color: INK,
    fontFamily: 'Helvetica-Bold',
    width: '20%',
    textAlign: 'right',
  },
  rowBarContainer: {
    width: '40%',
    height: 6,
    backgroundColor: LINE,
    borderRadius: 2,
  },
  rowBarFill: { height: '100%', backgroundColor: ACCENT, borderRadius: 2 },
  finding: {
    marginBottom: 22,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },
  findingNum: {
    fontSize: 36,
    color: ACCENT,
    marginBottom: 6,
  },
  findingTitle: {
    fontSize: 15,
    color: INK,
    marginBottom: 6,
    lineHeight: 1.35,
  },
  findingEvidence: {
    fontSize: 9,
    fontFamily: 'Courier',
    color: MUTED,
    letterSpacing: 0.3,
  },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 48,
    right: 48,
    textAlign: 'center',
    color: MUTED,
    fontSize: 8,
    fontFamily: 'Helvetica',
    borderTopWidth: 1,
    borderTopColor: LINE,
    paddingTop: 10,
  },
});

function scoreColor(s) {
  const n = (Number(s) - 55) / 30;
  if (n < 0.25) return '#2D1008';
  if (n < 0.45) return '#6B2A10';
  if (n < 0.65) return '#B5401A';
  if (n < 0.82) return '#E05820';
  return ACCENT;
}

function LifeFingerprint({ scores = [] }) {
  const bars = scores.length ? scores.slice(0, 14) : Array.from({ length: 14 }, (_, i) => 62 + (i % 5) * 3);
  return (
    <View>
      <Text style={styles.fingerprintLabel}>14-day life fingerprint</Text>
      <View style={styles.fingerprintRow}>
        {bars.map((s, i) => {
          const h = Math.max(8, ((Number(s) - 55) / 35) * 36);
          return (
            <View
              key={`fp-${i}`}
              style={[styles.fingerprintBar, { height: h, backgroundColor: scoreColor(s) }]}
            />
          );
        })}
      </View>
    </View>
  );
}

const DEFAULT_FINDINGS = [
  {
    title: 'Protect the morning mobility block before 9am',
    evidence: 'Mobility × focus hours · r ≈ +0.71 · strongest positive in window',
  },
  {
    title: 'Move caffeine cutoff earlier on training days',
    evidence: 'Late caffeine × next-day focus · r ≈ −0.64',
  },
  {
    title: 'Hold wake-time variance under 30 minutes',
    evidence: 'Sleep consistency × Life Score · r ≈ +0.67',
  },
];

const ReportDocument = ({ data, timeline }) => {
  const findings = (data.findings && data.findings.length ? data.findings : DEFAULT_FINDINGS).slice(0, 5);
  return (
    <Document>
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.ivoryBand} />
        <View style={styles.coverInner}>
          <View style={styles.coverRule} />
          <Text style={styles.coverBrand}>AIIMIN · Life OS</Text>
          <Text style={styles.coverTitle}>Standard Performance Review</Text>
          <Text style={styles.coverSubtitle}>Folio Life OS · Pro report · 14-day window</Text>
          <LifeFingerprint scores={data.fingerprintScores} />
          <Text style={styles.coverScoreLabel}>System integrity</Text>
          <Text style={styles.coverScore}>{data.disciplineScore}</Text>
          <Text style={styles.coverScoreHint}>Composite of gym, learning, and mood baselines</Text>
        </View>
        <Text style={styles.coverMeta}>
          Window: {timeline} · Generated {new Date().toLocaleDateString()} · Confidential
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.ivoryBand} />
        <View style={styles.pageInner}>
          <View style={styles.header}>
            <View>
              <Text style={styles.sectionKicker}>Section 01</Text>
              <Text style={styles.headerTitle}>Executive dashboard</Text>
            </View>
            <Text style={styles.headerMeta}>{timeline}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionKicker}>Key performance</Text>
            <Text style={styles.sectionTitle}>Indicators</Text>
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
            <Text style={styles.sectionKicker}>Review</Text>
            <Text style={styles.sectionTitle}>Notes</Text>
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
                Life Score proxies gym + learning + mood. No clinical inference. Standard PDF draws from the monthly
                generation pool — not daily AI quota.
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionKicker}>Domains</Text>
            <Text style={styles.sectionTitle}>Breakdown</Text>
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
                <View style={[styles.rowBarFill, { width: `${data.learningConsistency}%`, backgroundColor: INK }]} />
              </View>
              <Text style={styles.rowValue}>{data.learningConsistency}%</Text>
            </View>
          </View>
        </View>
        <Text style={styles.footer}>AIIMIN · Folio Life OS · Standard · Pro+ · Not for clinical use</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.ivoryBand} />
        <View style={styles.pageInner}>
          <View style={styles.header}>
            <View>
              <Text style={styles.sectionKicker}>Section 02</Text>
              <Text style={styles.headerTitle}>Findings</Text>
            </View>
            <Text style={styles.headerMeta}>Evidence-cited</Text>
          </View>
          {findings.map((f, i) => (
            <View key={`f-${i}`} style={styles.finding} wrap={false}>
              <Text style={styles.findingNum}>{String(i + 1).padStart(2, '0')}</Text>
              <Text style={styles.findingTitle}>{f.title}</Text>
              <Text style={styles.findingEvidence}>{f.evidence}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.footer}>AIIMIN · Folio Life OS · Recommendations · legal-finding format</Text>
      </Page>
    </Document>
  );
};

const PDFReportGenerator = ({ user, rangeLabel, startDate, endDate, days }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eligible, setEligible] = useState(false);
  const [timeline, setTimeline] = useState(rangeLabel || 'Last 14 Days');
  const [poolError, setPoolError] = useState('');
  const [consuming, setConsuming] = useState(false);

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
          days: String(days || (timeline.includes('15') || timeline.includes('14') ? 14 : timeline.includes('Year') ? 365 : timeline.includes('Quarter') ? 90 : 30)),
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

        const fingerprintScores = rows.slice(-14).map((t) => {
          if (t.globalScore != null) return Math.round(Number(t.globalScore));
          return (
            (t.gym_done ? 20 : 0)
            + (t.learning_done ? 20 : 0)
            + (t.journal ? 20 : 0)
            + (Number(t.mood) >= 6 ? 20 : 0)
            + (Number(t.sleep_hours) >= 6 ? 20 : 0)
          );
        });

        const findings = (report?.actionPlan || report?.executiveSummary?.recommendations || [])
          .slice(0, 5)
          .map((r) => ({
            title: typeof r === 'string' ? r : (r.title || r.action || r.label || 'Recommended action'),
            evidence: typeof r === 'string'
              ? 'Derived from window drivers'
              : (r.evidence || r.metric || r.reason || 'Derived from window drivers'),
          }));

        setEligible(true);
        setData({
          daysLogged,
          avgSleep,
          avgMood,
          gymConsistency,
          learningConsistency,
          disciplineScore,
          fingerprintScores,
          findings,
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

  const consumePoolThenDownload = async (downloadFn) => {
    setPoolError('');
    setConsuming(true);
    try {
      await apiPost('/intelligence/report-gen/consume', { kind: 'standard_pdf' });
      if (typeof downloadFn === 'function') downloadFn();
    } catch (err) {
      setPoolError(err.message || 'Monthly PDF generation pool exhausted');
    } finally {
      setConsuming(false);
    }
  };

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
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-3)' }}>
              White body · ivory band · 14-day fingerprint · numbered findings. Uses monthly generation pool.
            </p>
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
              <option value="Last 14 Days">Last 14 Days</option>
              <option value="Last 15 Days">Last 15 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Quarterly (Q2)">Quarterly (Q2)</option>
              <option value="Year-to-Date">Year-to-Date</option>
            </select>
          </div>
        )}
      </div>

      {poolError && (
        <div style={{ marginBottom: 16, padding: '12px 14px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: 13 }}>
          {poolError}
        </div>
      )}

      <PDFDownloadLink
        document={<ReportDocument data={data} timeline={timeline} />}
        fileName={`AIIMIN_Folio_${timeline.replace(/\s+/g, '_')}.pdf`}
        style={{ textDecoration: 'none' }}
      >
        {({ loading: pdfLoading, url }) => (
          <button
            type="button"
            disabled={pdfLoading || consuming}
            onClick={(e) => {
              e.preventDefault();
              consumePoolThenDownload(() => {
                if (url) {
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `AIIMIN_Folio_${timeline.replace(/\s+/g, '_')}.pdf`;
                  a.click();
                }
              });
            }}
            style={{
              width: '100%',
              padding: '16px',
              background: pdfLoading || consuming ? 'var(--bg-card)' : 'var(--color-accent)',
              color: pdfLoading || consuming ? 'var(--text-3)' : '#fff',
              border: pdfLoading || consuming ? '1px solid var(--border)' : 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 800,
              cursor: pdfLoading || consuming ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Download size={18} />
            {pdfLoading || consuming ? 'Compiling Folio…' : 'Download Folio Life OS PDF'}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default PDFReportGenerator;
