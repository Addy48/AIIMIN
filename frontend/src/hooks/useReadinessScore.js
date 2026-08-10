import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { sanitizeScore } from '../utils/enumLabels';

function avgValid(scores, opts) {
  const cleaned = scores
    .map((s) => sanitizeScore(s, opts))
    .filter((s) => s.value != null);
  if (!cleaned.length) return null;
  const avg = Math.round(cleaned.reduce((a, c) => a + c.value, 0) / cleaned.length);
  return sanitizeScore(avg);
}

export function useReadinessScore(user) {
  const [dsaMetrics, setDsaMetrics] = useState({ score: 0, desc: 'Not enough data' });
  const [communicationMetrics, setCommunicationMetrics] = useState({ score: 0, desc: 'Not enough data' });
  const [systemDesignMetrics, setSystemDesignMetrics] = useState({ score: 0, desc: 'Not enough data' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.isGuest) {
      setLoading(false);
      return;
    }

    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const { data: aptitudeData } = await supabase
          .from('lab_aptitude_scores')
          .select('score')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (aptitudeData?.length) {
          const avgDsa = avgValid(aptitudeData.map((r) => r.score));
          if (avgDsa?.value != null) {
            setDsaMetrics({
              score: avgDsa.value,
              desc: avgDsa.value >= 80 ? 'Top 5% of candidate pool' : avgDsa.value >= 60 ? 'Solid foundation' : 'Needs targeted review',
            });
          }
        }

        // Seed + schema use pace_score; older rows may use pacing_score
        const { data: commsData } = await supabase
          .from('lab_speaking_logs')
          .select('clarity_score, pace_score, pacing_score')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (commsData?.length) {
          const pairs = commsData.map((c) => {
            const pace = c.pace_score ?? c.pacing_score;
            if (c.clarity_score == null || pace == null) return null;
            return (Number(c.clarity_score) + Number(pace)) / 2;
          });
          const avgComms = avgValid(pairs.filter((v) => v != null));
          if (avgComms?.value != null) {
            setCommunicationMetrics({
              score: avgComms.value,
              desc: avgComms.value >= 80 ? 'Clear & articulate' : avgComms.value >= 60 ? 'Good pacing' : 'Needs practice',
            });
          }
        }

        // System design logs are 0–10; scale to 0–100 for Market Readiness bars
        const { data: sysData } = await supabase
          .from('lab_system_design_logs')
          .select('score')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (sysData?.length) {
          const avgSys = avgValid(sysData.map((r) => r.score), { scaleFrom: 10 });
          if (avgSys?.value != null) {
            setSystemDesignMetrics({
              score: avgSys.value,
              desc: avgSys.value >= 80 ? 'System patterns successfully structured' : avgSys.value >= 60 ? 'Basic architectures known' : 'Needs targeted review',
            });
          }
        }
      } catch (err) {
        console.error('Error fetching readiness metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  return { dsaMetrics, communicationMetrics, systemDesignMetrics, loading };
}
