import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Download, AlertCircle, Calendar, FileText, CheckCircle } from 'lucide-react';

// Create styles for PDF
const styles = StyleSheet.create({
  page: { padding: 50, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
  coverPage: { padding: 50, backgroundColor: '#050505', color: '#ffffff', fontFamily: 'Helvetica', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  coverTitle: { fontSize: 42, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', letterSpacing: -1 },
  coverSubtitle: { fontSize: 14, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: 4, textAlign: 'center', marginBottom: 60 },
  coverDate: { fontSize: 12, color: '#71717a', marginTop: 'auto' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', borderBottomWidth: 1, borderBottomColor: '#e4e4e7', paddingBottom: 20, marginBottom: 30 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#18181b', letterSpacing: -0.5 },
  headerMeta: { fontSize: 10, color: '#71717a', textTransform: 'uppercase', letterSpacing: 1 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#18181b', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f4f4f5', paddingBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  card: { width: '47%', backgroundColor: '#fafafa', borderWidth: 1, borderColor: '#f4f4f5', borderRadius: 8, padding: 16, marginBottom: 15 },
  cardValue: { fontSize: 28, fontWeight: 'bold', color: '#18181b', marginBottom: 4 },
  cardLabel: { fontSize: 10, color: '#71717a', textTransform: 'uppercase', letterSpacing: 1 },
  insightBox: { backgroundColor: '#f8fafc', borderLeftWidth: 4, borderLeftColor: '#3b82f6', padding: 16, marginBottom: 20 },
  insightText: { fontSize: 12, color: '#334155', lineHeight: 1.6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f4f4f5' },
  rowLabel: { fontSize: 12, color: '#52525b', width: '40%' },
  rowValue: { fontSize: 12, color: '#18181b', fontWeight: 'bold', width: '20%', textAlign: 'right' },
  rowBarContainer: { width: '40%', height: 6, backgroundColor: '#f4f4f5', borderRadius: 3 },
  rowBarFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: 3 },
  footer: { position: 'absolute', bottom: 30, left: 50, right: 50, textAlign: 'center', color: '#a1a1aa', fontSize: 9, borderTopWidth: 1, borderTopColor: '#f4f4f5', paddingTop: 15 }
});

const ReportDocument = ({ data, timeline }) => (
  <Document>
    <Page size="A4" style={styles.coverPage}>
      <Text style={styles.coverTitle}>AIIMIN V2</Text>
      <Text style={styles.coverSubtitle}>System Telemetry & Performance Report</Text>
      <View style={{ marginTop: 100, alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: '#e4e4e7', marginBottom: 10 }}>Overall System Integrity</Text>
        <Text style={{ fontSize: 64, fontWeight: 'bold', color: '#10b981' }}>{data.disciplineScore}%</Text>
        <Text style={{ fontSize: 12, color: '#71717a', marginTop: 10 }}>BASED ON RECENT TELEMETRY</Text>
      </View>
      <Text style={styles.coverDate}>Generated for timeline: {timeline} | {new Date().toLocaleDateString()}</Text>
    </Page>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View><Text style={styles.headerTitle}>Executive Dashboard</Text></View>
        <Text style={styles.headerMeta}>{timeline}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardValue}>{data.avgSleep}h</Text>
            <Text style={styles.cardLabel}>Avg Sleep Duration</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardValue}>{data.gymConsistency}%</Text>
            <Text style={styles.cardLabel}>Gym Consistency</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardValue}>{data.avgMood}/10</Text>
            <Text style={styles.cardLabel}>Avg Mood</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardValue}>{data.daysLogged}</Text>
            <Text style={styles.cardLabel}>Days Logged</Text>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI System Insights</Text>
        <View style={styles.insightBox}>
          <Text style={styles.insightText}>
            {data.daysLogged < 5 ? 
              "Insufficient data for deep insights. Continue logging daily to generate accurate baseline telemetry." :
              `Your physiological baseline shows an average sleep of ${data.avgSleep}h and a gym consistency of ${data.gymConsistency}%. Maintaining a consistent sleep schedule and physical activity leads to improved cognitive function and discipline.`
            }
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Domain Breakdown</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Physical Vitality</Text>
          <View style={styles.rowBarContainer}><View style={[styles.rowBarFill, { width: `${data.gymConsistency}%`, backgroundColor: '#10b981' }]} /></View>
          <Text style={styles.rowValue}>{data.gymConsistency}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Dopamine Baseline (Mood)</Text>
          <View style={styles.rowBarContainer}><View style={[styles.rowBarFill, { width: `${data.avgMood * 10}%`, backgroundColor: '#8b5cf6' }]} /></View>
          <Text style={styles.rowValue}>{Math.round(data.avgMood * 10)}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Learning Consistency</Text>
          <View style={styles.rowBarContainer}><View style={[styles.rowBarFill, { width: `${data.learningConsistency}%`, backgroundColor: '#f59e0b' }]} /></View>
          <Text style={styles.rowValue}>{data.learningConsistency}%</Text>
        </View>
      </View>
      <Text style={styles.footer}>CONFIDENTIAL · GENERATED BY AIIMIN V2</Text>
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

        let totalSleep = 0, validSleepCount = 0;
        let totalMood = 0, validMoodCount = 0;
        let gymDays = 0, learningDays = 0;

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
          disciplineScore
        });
      } catch (err) {
        console.error("Failed to fetch report data", err);
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
          Analyzing telemetry data...
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
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-1)' }}>Insufficient Data Volume</h3>
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
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>Executive Telemetry Report</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-3)' }}>Professional PDF export of physiological & cognitive baselines.</p>
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
                    cursor: 'pointer'
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
        fileName={`AIIMIN_Telemetry_${timeline.replace(/\s+/g, '_')}.pdf`}
        style={{ textDecoration: 'none' }}
      >
        {({ blob, url, loading, error }) => (
          <button 
            disabled={loading}
            style={{ 
                width: '100%', 
                padding: '16px', 
                background: loading ? 'var(--bg-card)' : 'var(--text-1)', 
                color: loading ? 'var(--text-3)' : 'var(--bg-base)', 
                border: loading ? '1px solid var(--border)' : 'none', 
                borderRadius: '12px', 
                fontSize: '15px', 
                fontWeight: 800, 
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={e => { if(!loading) e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { if(!loading) e.currentTarget.style.transform = 'none' }}
          >
            <Download size={18} />
            {loading ? 'Compiling Analysis...' : 'Download Executive PDF'}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default PDFReportGenerator;
