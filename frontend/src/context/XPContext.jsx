import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { apiGet, apiPost } from '../utils/api';
import { playLevelUp, playXP } from '../utils/soundEngine';
import LevelUpModal from '../components/gamification/LevelUpModal';
import XPGainToast from '../components/gamification/XPGainToast';

const XPContext = createContext(null);

export function XPProvider({ children }) {
  const [xpState, setXpState] = useState({ totalXp: 0, rank: null });
  const [gainEvent, setGainEvent] = useState(null);
  const [levelUp, setLevelUp] = useState(null);

  const refreshXp = useCallback(async () => {
    try {
      const data = await apiGet('/account/xp-status');
      setXpState({ totalXp: data.totalXp, rank: data.rank });
      return data;
    } catch {
      return null;
    }
  }, []);

  const handleGrantResult = useCallback((result) => {
    if (!result || result.skipped || !result.xpGained) return result;

    setXpState({ totalXp: result.totalXp, rank: result.rank });
    setGainEvent({
      id: Date.now(),
      amount: result.xpGained,
      breakdown: result.breakdown,
      multiplier: result.multiplier,
    });

    try { playXP(); } catch { /* ignore */ }

    if (result.leveledUp && result.rank) {
      setLevelUp({
        rank: result.rank,
        prevRank: result.prevRank,
      });
      try { playLevelUp(); } catch { /* ignore */ }
    }

    return result;
  }, []);

  const awardDailyLogXp = useCallback(async (dailyLog, streakLength = 1) => {
    try {
      const result = await apiPost('/account/award-daily-log-xp', { dailyLog, streakLength });
      return handleGrantResult(result);
    } catch {
      return null;
    }
  }, [handleGrantResult]);

  const awardPomodoroXp = useCallback(async () => {
    try {
      const result = await apiPost('/account/award-pomodoro-xp', {});
      return handleGrantResult(result);
    } catch {
      return null;
    }
  }, [handleGrantResult]);

  const awardMoneyXp = useCallback(async () => {
    try {
      const result = await apiPost('/account/award-money-xp', {});
      return handleGrantResult(result);
    } catch {
      return null;
    }
  }, [handleGrantResult]);

  const value = useMemo(() => ({
    xpState,
    refreshXp,
    awardDailyLogXp,
    awardPomodoroXp,
    awardMoneyXp,
    handleGrantResult,
  }), [xpState, refreshXp, awardDailyLogXp, awardPomodoroXp, awardMoneyXp, handleGrantResult]);

  return (
    <XPContext.Provider value={value}>
      {children}
      <XPGainToast event={gainEvent} onDone={() => setGainEvent(null)} />
      <LevelUpModal data={levelUp} onClose={() => setLevelUp(null)} />
    </XPContext.Provider>
  );
}

export function useXP() {
  const ctx = useContext(XPContext);
  if (!ctx) throw new Error('useXP must be used within XPProvider');
  return ctx;
}

export default XPContext;
