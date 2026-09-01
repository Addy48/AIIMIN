import {
  NAV_REGISTRY,
  LEGACY_NAV_ID_MAP,
  NAV_PERSONA_PRESETS,
  DEFAULT_PINNED_IDS,
  DEFAULT_ACTIVE_IDS,
  NAV_MAX_PINNED,
  getNavItem,
  resolveNavItems,
  availableForMore,
  sanitizePinnedIds,
  sanitizeActiveIds,
} from '../navItems';

describe('navItems constants and migration logic', () => {
  describe('NAV_REGISTRY structure', () => {
    test('contains forge as a unified group', () => {
      const forgeItem = NAV_REGISTRY.find((item) => item.id === 'forge');
      expect(forgeItem).toBeDefined();
      expect(forgeItem.label).toBe('Forge');
      expect(forgeItem.to).toBe('/lab');
      expect(Array.isArray(forgeItem.children)).toBe(true);
      expect(forgeItem.children.length).toBe(2);

      const [labChild, sportsChild] = forgeItem.children;
      expect(labChild).toEqual(
        expect.objectContaining({
          id: 'lab',
          label: 'Skill Lab',
          to: '/lab',
        })
      );
      expect(sportsChild).toEqual(
        expect.objectContaining({
          id: 'sports',
          label: 'Sports Arena',
          to: '/sports',
        })
      );
    });

    test('does not contain sports or lab as standalone top-level items in registry', () => {
      const topLevelIds = NAV_REGISTRY.map((i) => i.id);
      expect(topLevelIds).toContain('forge');
      expect(topLevelIds).not.toContain('sports');
      expect(topLevelIds).not.toContain('lab');
    });

    test('has updated polished labels for navigation items', () => {
      const registryMap = Object.fromEntries(NAV_REGISTRY.map((i) => [i.id, i.label]));
      expect(registryMap.family).toBe('Family Vault');
      expect(registryMap.focus).toBe('Focus Room');
      expect(registryMap.forge).toBe('Forge');
    });
  });

  describe('Legacy compatibility & LEGACY_NAV_ID_MAP', () => {
    test('maps legacy sports and lab to forge', () => {
      expect(LEGACY_NAV_ID_MAP.sports).toBe('forge');
      expect(LEGACY_NAV_ID_MAP.lab).toBe('forge');
    });

    test('getNavItem returns forge directly', () => {
      const forge = getNavItem('forge');
      expect(forge).toBeDefined();
      expect(forge.id).toBe('forge');
      expect(forge.children?.length).toBe(2);
    });

    test('getNavItem returns backward-compatible fallback for sports and lab', () => {
      const sports = getNavItem('sports');
      expect(sports).toBeDefined();
      expect(sports.id).toBe('sports');
      expect(sports.label).toBe('Sports Arena');
      expect(sports.parentId).toBe('forge');

      const lab = getNavItem('lab');
      expect(lab).toBeDefined();
      expect(lab.id).toBe('lab');
      expect(lab.label).toBe('Skill Lab');
      expect(lab.parentId).toBe('forge');
    });

    test('getNavItem returns undefined for unknown ID', () => {
      expect(getNavItem('unknown_xyz')).toBeUndefined();
    });
  });

  describe('sanitizePinnedIds', () => {
    test('maps legacy sports and lab to forge', () => {
      const result = sanitizePinnedIds(['overview', 'sports']);
      expect(result).toEqual(['overview', 'forge']);
    });

    test('deduplicates when both sports and lab are in pinned list', () => {
      const result = sanitizePinnedIds(['overview', 'sports', 'lab']);
      expect(result).toEqual(['overview', 'forge']);
    });

    test('drops invalid IDs and caps at NAV_MAX_PINNED', () => {
      const result = sanitizePinnedIds(['overview', 'sports', 'fake_id', 'habits', 'goals', 'journal', 'notes', 'finance', 'calendar', 'focus']);
      expect(result.length).toBeLessThanOrEqual(NAV_MAX_PINNED);
      expect(result).not.toContain('fake_id');
      expect(result).toContain('forge');
    });

    test('falls back to default pinned when input is empty or invalid', () => {
      expect(sanitizePinnedIds(null)).toEqual(DEFAULT_PINNED_IDS);
      expect(sanitizePinnedIds([])).toEqual(DEFAULT_PINNED_IDS);
      expect(sanitizePinnedIds('not an array')).toEqual(DEFAULT_PINNED_IDS);
      expect(sanitizePinnedIds(['fake_1', 'fake_2'])).toEqual(DEFAULT_PINNED_IDS);
    });
  });

  describe('sanitizeActiveIds', () => {
    test('maps legacy sports and lab to forge and deduplicates', () => {
      const result = sanitizeActiveIds(['overview', 'sports', 'lab', 'habits']);
      expect(result).toEqual(['overview', 'forge', 'habits']);
    });

    test('preserves valid registry IDs and removes non-existent IDs', () => {
      const allRegistryIds = NAV_REGISTRY.map((i) => i.id);
      const result = sanitizeActiveIds([...allRegistryIds, 'invalid_1', 'invalid_2']);
      expect(result).toEqual(allRegistryIds);
    });

    test('falls back to default active IDs on invalid or empty input', () => {
      expect(sanitizeActiveIds(null)).toEqual(DEFAULT_ACTIVE_IDS);
      expect(sanitizeActiveIds([])).toEqual(DEFAULT_ACTIVE_IDS);
    });
  });

  describe('resolveNavItems', () => {
    test('resolves pinned items correctly for authenticated users', () => {
      const items = resolveNavItems(['overview', 'forge'], {
        activeIds: ['overview', 'forge', 'habits', 'reports'],
        isGuest: false,
      });

      expect(items.map((i) => i.id)).toEqual(['overview', 'forge']);
      const forgePinned = items.find((i) => i.id === 'forge');
      expect(forgePinned.children.length).toBe(2);
    });

    test('filters out hideFromGuest items when isGuest is true', () => {
      const items = resolveNavItems(['overview', 'discipline', 'forge'], {
        activeIds: ['overview', 'discipline', 'forge'],
        isGuest: true,
      });

      const resolvedIds = items.map((i) => i.id);
      expect(resolvedIds).not.toContain('discipline');
      expect(resolvedIds).toContain('overview');
      expect(resolvedIds).toContain('forge');
    });

    test('transparently handles legacy pinned IDs like sports in input', () => {
      const items = resolveNavItems(['overview', 'sports'], {
        activeIds: ['overview', 'forge'],
        isGuest: false,
      });

      expect(items.map((i) => i.id)).toEqual(['overview', 'forge']);
    });
  });

  describe('availableForMore', () => {
    test('returns active items that are not pinned', () => {
      const more = availableForMore(['overview', 'forge'], {
        activeIds: ['overview', 'forge', 'habits'],
      });
      expect(more.map((i) => i.id)).toEqual(['habits']);
    });
  });

  describe('NAV_PERSONA_PRESETS', () => {
    test('all presets have valid pinned and active IDs existing in NAV_REGISTRY', () => {
      const registryIds = new Set(NAV_REGISTRY.map((i) => i.id));

      NAV_PERSONA_PRESETS.forEach((preset) => {
        expect(preset.pinnedIds.length).toBeGreaterThanOrEqual(1);

        preset.pinnedIds.forEach((id) => {
          expect(registryIds.has(id)).toBe(true);
        });

        preset.activeIds.forEach((id) => {
          expect(registryIds.has(id)).toBe(true);
        });

        // Pinned IDs in preset must not contain deprecated sports or lab
        expect(preset.pinnedIds).not.toContain('sports');
        expect(preset.pinnedIds).not.toContain('lab');
        expect(preset.activeIds).not.toContain('sports');
        expect(preset.activeIds).not.toContain('lab');
      });
    });

    test('presets with forge include it in activeIds or pinnedIds', () => {
      const student = NAV_PERSONA_PRESETS.find((p) => p.id === 'student');
      const founder = NAV_PERSONA_PRESETS.find((p) => p.id === 'founder');
      const athlete = NAV_PERSONA_PRESETS.find((p) => p.id === 'athlete');

      expect(student.activeIds).toContain('forge');
      expect(founder.pinnedIds).toContain('forge');
      expect(athlete.pinnedIds).toContain('forge');
    });
  });
});
