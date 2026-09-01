import { renderHook, act } from '@testing-library/react';
import useNavPreferences from '../useNavPreferences';

describe('useNavPreferences hook and storage migration', () => {
  const STORAGE_KEY = 'aiimin-nav-prefs';

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('loads default preferences when localStorage is empty', () => {
    const { result } = renderHook(() => useNavPreferences());
    expect(result.current.pinnedIds).toContain('overview');
    expect(result.current.activeIds).toContain('forge');
    expect(result.current.bottomNavEnabled).toBe(true);
  });

  test('migrates legacy stored sports/lab IDs to forge in localStorage', () => {
    const legacyPrefs = {
      pinnedIds: ['overview', 'habits', 'sports'],
      activeIds: ['overview', 'habits', 'sports', 'lab', 'goals'],
      bottomNavEnabled: true,
      personaPresetId: 'athlete',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacyPrefs));

    const { result } = renderHook(() => useNavPreferences());

    // Pinned sports should be migrated to forge
    expect(result.current.pinnedIds).toContain('forge');
    expect(result.current.pinnedIds).not.toContain('sports');
    expect(result.current.pinnedIds).not.toContain('lab');

    // Active sports and lab should be deduplicated to forge
    expect(result.current.activeIds).toContain('forge');
    expect(result.current.activeIds).not.toContain('sports');
    expect(result.current.activeIds).not.toContain('lab');

    // Check that localStorage was updated with the migrated state
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved.pinnedIds).toContain('forge');
    expect(saved.pinnedIds).not.toContain('sports');
    expect(saved.activeIds).toContain('forge');
  });

  test('deduplicates when both sports and lab were pinned in legacy prefs', () => {
    const legacyPrefs = {
      pinnedIds: ['overview', 'sports', 'lab'],
      activeIds: ['overview', 'sports', 'lab'],
      bottomNavEnabled: true,
      personaPresetId: 'custom',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacyPrefs));

    const { result } = renderHook(() => useNavPreferences());

    const forgeCountInPinned = result.current.pinnedIds.filter((id) => id === 'forge').length;
    expect(forgeCountInPinned).toBe(1);
    expect(result.current.pinnedIds).not.toContain('sports');
    expect(result.current.pinnedIds).not.toContain('lab');
  });

  test('allows toggling pin and active state for forge', () => {
    const { result } = renderHook(() => useNavPreferences());

    // If forge is not pinned, pin it
    if (!result.current.pinnedIds.includes('forge')) {
      act(() => {
        result.current.togglePin('forge');
      });
      expect(result.current.pinnedIds).toContain('forge');
    }

    // Toggle unpin
    act(() => {
      result.current.togglePin('forge');
    });
    expect(result.current.pinnedIds).not.toContain('forge');
  });

  test('handles corrupted localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid-json{{');
    const { result } = renderHook(() => useNavPreferences());
    expect(result.current.pinnedIds.length).toBeGreaterThan(0);
    expect(result.current.activeIds).toContain('forge');
  });
});
