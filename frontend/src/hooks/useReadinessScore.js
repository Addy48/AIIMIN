import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

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
        // Fetch DSA (Aptitude) Scores
        const { data: aptitudeData } = await supabase
          .from('lab_aptitude_scores')
          .select('score')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (aptitudeData && aptitudeData.length > 0) {
          const avgDsa = Math.round(aptitudeData.reduce((acc, curr) => acc + curr.score, 0) / aptitudeData.length);
          setDsaMetrics({ 
            score: avgDsa, 
            desc: avgDsa >= 80 ? 'Top 5% of candidate pool' : avgDsa >= 60 ? 'Solid foundation' : 'Needs targeted review' 
          });
        }

        // Fetch Communication (Speaking Logger) Scores
        const { data: commsData } = await supabase
          .from('lab_speaking_logs')
          .select('clarity_score, pacing_score')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (commsData && commsData.length > 0) {
          const avgComms = Math.round(commsData.reduce((acc, curr) => acc + ((curr.clarity_score + curr.pacing_score) / 2), 0) / commsData.length);
          setCommunicationMetrics({ 
            score: avgComms, 
            desc: avgComms >= 80 ? 'Clear & articulate' : avgComms >= 60 ? 'Good pacing' : 'Needs practice' 
          });
        }

        // Fetch System Design Scores
        const { data: sysData } = await supabase
          .from('lab_system_design_logs')
          .select('score')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (sysData && sysData.length > 0) {
          const avgSys = Math.round(sysData.reduce((acc, curr) => acc + curr.score, 0) / sysData.length);
          setSystemDesignMetrics({ 
            score: avgSys, 
            desc: avgSys >= 80 ? 'System patterns successfully structured' : avgSys >= 60 ? 'Basic architectures known' : 'Needs targeted review' 
          });
        }
      } catch (err) {
        console.error("Error fetching readiness metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  return { dsaMetrics, communicationMetrics, systemDesignMetrics, loading };
}
