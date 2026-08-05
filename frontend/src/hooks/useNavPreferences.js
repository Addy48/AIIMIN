import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  NAV_REGISTRY,
  DEFAULT_PINNED_IDS,
  DEFAULT_ACTIVE_IDS,
  NAV_MAX_PINNED,
  NAV_MIN_PINNED,
  NAV_PERSONA_PRESETS,
  getPersonaPreset,
  sanitizeActiveIds,
  sanitizePinnedIds,
  resolveNavItems,
  availableForMore,
} from '../constants/navItems';
import { applyOverviewWidgetPreset } from '../components/overview/OverviewWidgetGrid';

const STORAGE_KEY = 'aiimin-nav-prefs';
const CHANGE_EVENT = 'aiimin-nav-prefs-changed';
const PERSONA_PROFILE_EVENT = 'aiimin-persona-profile-sync';

const DEFAULT_PREFS = {
  pinnedIds: DEFAULT_PINNED_IDS,
  activeIds: DEFAULT_ACTIVE_IDS,
  bottomNavEnabled: true,
  personaPresetId: 'custom',
};

function ensureNotesNav(activeIds, pinnedIds) {
  let active = [...activeIds];
  let pinned = [...pinnedIds];
  if (!active.includes('notes')) active.push('notes');
  if (!active.includes('reports')) active.push('reports');
  active = sanitizeActiveIds(active);
  if (!pinned.includes('notes') && pinned.length < NAV_MAX_PINNED) {
    const ji = pinned.indexOf('journal');
    if (ji >= 0) pinned.splice(ji + 1, 0, 'notes');
    else pinned.push('notes');
  }
  // Reports stays under More unless user explicitly pins it
  pinned = sanitizePinnedIds(pinned).filter((id) => active.includes(id));
  return { activeIds: active, pinnedIds: pinned };
}

function readPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    const parsed = JSON.parse(raw);
    const baseActive = sanitizeActiveIds(parsed.activeIds);
    const basePinned = sanitizePinnedIds(parsed.pinnedIds).filter((id) => baseActive.includes(id));
    const { activeIds, pinnedIds } = ensureNotesNav(baseActive, basePinned);
    const next = {
      pinnedIds,
      activeIds,
      bottomNavEnabled: parsed.bottomNavEnabled !== false,
      personaPresetId: parsed.personaPresetId || 'custom',
    };
    // Persist one-time Notes / Reports nav migration
    if (
      !baseActive.includes('notes')
      || !baseActive.includes('reports')
      || (!basePinned.includes('notes') && pinnedIds.includes('notes'))
    ) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    return next;
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

function writePrefs(prefs) {
  const activeIds = sanitizeActiveIds(prefs.activeIds);
  const next = {
    pinnedIds: sanitizePinnedIds(prefs.pinnedIds).filter((id) => activeIds.includes(id)),
    activeIds,
    bottomNavEnabled: prefs.bottomNavEnabled !== false,
    personaPresetId: prefs.personaPresetId || 'custom',
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: next }));
  return next;
}

export default function useNavPreferences() {
  const [prefs, setPrefs] = useState(readPrefs);

  useEffect(() => {
    const sync = () => setPrefs(readPrefs());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const setPinnedIds = useCallback((pinnedIds) => {
    setPrefs((prev) => writePrefs({ ...prev, pinnedIds, personaPresetId: 'custom' }));
  }, []);

  const togglePin = useCallback((id) => {
    setPrefs((prev) => {
      const has = prev.pinnedIds.includes(id);
      if (has) {
        if (prev.pinnedIds.length <= NAV_MIN_PINNED) return prev;
        return writePrefs({ ...prev, pinnedIds: prev.pinnedIds.filter((x) => x !== id), personaPresetId: 'custom' });
      }
      if (prev.pinnedIds.length >= NAV_MAX_PINNED) return prev;
      return writePrefs({
        ...prev,
        pinnedIds: [...prev.pinnedIds, id],
        activeIds: prev.activeIds.includes(id) ? prev.activeIds : [...prev.activeIds, id],
        personaPresetId: 'custom',
      });
    });
  }, []);

  const toggleActive = useCallback((id) => {
    setPrefs((prev) => {
      const has = prev.activeIds.includes(id);
      if (has) {
        if (prev.activeIds.length <= NAV_MIN_PINNED) return prev;
        return writePrefs({
          ...prev,
          activeIds: prev.activeIds.filter((x) => x !== id),
          pinnedIds: prev.pinnedIds.filter((x) => x !== id),
          personaPresetId: 'custom',
        });
      }
      return writePrefs({
        ...prev,
        activeIds: [...prev.activeIds, id],
        personaPresetId: 'custom',
      });
    });
  }, []);

  const movePin = useCallback((id, direction) => {
    setPrefs((prev) => {
      const idx = prev.pinnedIds.indexOf(id);
      if (idx < 0) return prev;
      const nextIdx = direction === 'left' ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= prev.pinnedIds.length) return prev;
      const next = [...prev.pinnedIds];
      [next[idx], next[nextIdx]] = [next[nextIdx], next[idx]];
      return writePrefs({ ...prev, pinnedIds: next, personaPresetId: 'custom' });
    });
  }, []);

  const resetPins = useCallback(() => {
    setPrefs(writePrefs({ ...DEFAULT_PREFS }));
  }, []);

  const applyPersonaPreset = useCallback((id) => {
    const preset = getPersonaPreset(id);
    setPrefs(writePrefs({
      ...DEFAULT_PREFS,
      activeIds: preset.activeIds,
      pinnedIds: preset.pinnedIds,
      personaPresetId: preset.id,
    }));
    if (preset.overviewWidgets) {
      applyOverviewWidgetPreset(preset.overviewWidgets);
    }
    if (preset.id !== 'custom' && (preset.sportsDefaults?.length || preset.personaTags?.length)) {
      window.dispatchEvent(new CustomEvent(PERSONA_PROFILE_EVENT, {
        detail: {
          favorite_sports: preset.sportsDefaults || [],
          favorite_teams: preset.teamDefaults || {},
          persona_tags: preset.personaTags || [],
        },
      }));
    }
    return preset;
  }, []);

  const setBottomNavEnabled = useCallback((enabled) => {
    setPrefs((prev) => writePrefs({ ...prev, bottomNavEnabled: enabled }));
  }, []);

  const pinnedItems = useMemo(
    () => resolveNavItems(prefs.pinnedIds, { activeIds: prefs.activeIds }),
    [prefs.pinnedIds, prefs.activeIds],
  );

  const resolveForUser = useCallback(
    (isGuest) => ({
      pinned: resolveNavItems(prefs.pinnedIds, { isGuest, activeIds: prefs.activeIds }),
      more: availableForMore(prefs.pinnedIds, { isGuest, activeIds: prefs.activeIds }),
    }),
    [prefs.pinnedIds, prefs.activeIds],
  );

  return {
    pinnedIds: prefs.pinnedIds,
    activeIds: prefs.activeIds,
    personaPresetId: prefs.personaPresetId,
    pinnedItems,
    bottomNavEnabled: prefs.bottomNavEnabled,
    maxPinned: NAV_MAX_PINNED,
    minPinned: NAV_MIN_PINNED,
    registry: NAV_REGISTRY,
    personaPresets: NAV_PERSONA_PRESETS,
    setPinnedIds,
    togglePin,
    toggleActive,
    movePin,
    resetPins,
    applyPersonaPreset,
    setBottomNavEnabled,
    resolveForUser,
  };
}
