---
authority: historical
derived_from: Genesis
status: archived
owner: founder
lifecycle: archive
last_reviewed: 2026-07-25
can_override_genesis: false
knowledge_layer: KL-COLD
graph_role: cold
note_type: NT-COLD
migration_batch: W4
fm_source: script
---

> **ARCHIVED — provenance**
> - **Why archived:** Native V2 doctrine superseded by Genesis P8/P9 during Stage A constitutional migration.
> - **Status:** superseded
> - **Canonical / active successor:** [[Genesis/P8 Master Specification/10_Component_System]] · [[Genesis/P8 Master Specification/11_Visual_System]]
> - **Use:** Historical reference only. Do not treat as living law. Cannot override Genesis.

# 06 — Design System (Native)

> **Depends:** [[05_NATIVE_UX]] [[08_DESIGN/Palette]]  
> **Status:** Complete draft · 2026-07-19  
> **Brand lock:** Core accents unchanged without founder approval. System maps them into M3 roles.

---

## 1. Color system

### Dark (default companion)

| Token | Hex | M3 role |
|-------|-----|---------|
| `bg` | `#1A1A1A` | surface / background |
| `surface` | `#2D2D2D` | surfaceContainer |
| `surfaceHigh` | `#333333` | surfaceContainerHigh |
| `accent` | `#FF6B35` | primary |
| `onAccent` | `#1A1A1A` | onPrimary |
| `success` | `#10B981` | tertiary / custom success |
| `muted` | `#6B7280` | outline / onSurfaceVariant |
| `text` | `#F0EDE8` | onSurface |
| `danger` | `#EF4444` | error |

### Light

| Token | Hex | M3 role |
|-------|-----|---------|
| `bg` | `#EDE4D3` | background |
| `surface` | `#FFFFFF` | surface |
| `accent` | `#FF6B35` / calm `#E85A24` for large fills | primary |
| `text` | `#14171A` | onSurface |
| same success/muted | | |

60/30/10: neutrals dominate; accent ≤10% of pixels for CTAs/score.

Dynamic color (Android 12+): **optional overlay** — brand primary remains AIIMIN orange for CTAs even if wallpaper tints surfaces.

---

## 2. Typography

| Role | Spec |
|------|------|
| Family UI | Figtree or Familjen Grotesk (match web brand fonts via bundled) |
| Mono / scores | JetBrains Mono for Life Score, money, timers |
| Scale | display · headline · title · body · label (M3 type scale) |
| Max | 4 sizes emphasized per screen; 2 weights regular/semibold |

---

## 3. Spacing

8-point grid: 4, 8, 12, 16, 24, 32, 48, 64.  
Screen horizontal padding: 16 compact / 24 medium.  
Card padding: 16–24.  
Section gap: 24–32.

---

## 4. Radius

| Token | dp |
|-------|-----|
| xs | 4 chips |
| sm | 8 inputs |
| md | 12 cards |
| lg | 16 sheets |
| xl | 28 FAB/hero |

---

## 5. Elevation

Prefer **tonal surfaces** over drop shadows.  
Shadows only: FAB, menus, dialogs — tinted, soft.

---

## 6. Grid / layout

Compact phone: single column.  
Medium: optional two-pane Track list-detail.  
Never put critical controls across fold hinge.

---

## 7. Iconography

Material Symbols rounded, optical size 24.  
Tab icons outlined; selected filled or indicator.  
Custom brand mark for splash/launcher only.

---

## 8. Motion language

Calm, interruptible, physical.  
Curves: M3 emphasized / standard.  
Durations: short 50–200 · medium 250–400 · long 450–600.  
See [[07_MOTION]].

---

## 9. Glass / blur

Use sparingly: sheet scrims, nav bar translucent on scroll.  
Not glassmorphism wallpaper aesthetic.

---

## 10. Material mapping

Compose `MaterialTheme` extended with `AiiminColors` CompositionLocal for success/streak/pillar colors (academic/career/health/personal).

---

## 11. Dark / light / system

Follow system by default on first launch; user override in You → Appearance.  
Status bar icons invert per background.

---

## 12. Haptics vocabulary

| Event | Haptic |
|-------|--------|
| Habit done | Light impact |
| Save | Medium |
| Error | Heavy / reject |
| MCQ correct | Success tick |
| MCQ wrong | Soft warn |
| Focus complete | Double light |

---

## 13. Accessibility

Contrast AA · touch 48dp · Reduce motion · Font scale to 1.3 without clipping CTAs · Color-blind safe streak states (shape+color).

---

## 14. Inspiration notes (not copies)

| Brand | Steal |
|-------|-------|
| Apple | Navigation clarity, empty states |
| Linear | Information hierarchy calm |
| Notion | Content-first write |
| Nothing | Restraint in motion |
| Arc | Bold but purposeful moments |
| Material 3 Expressive | Motion/shape energy within tokens |

---

## 15. Component inventory (native)

Buttons · IconButtons · TextFields · SearchBar · Cards · Lists · HabitRow · ScoreHero · WeekStrip · SheetScaffold · TopAppBar · NavBar · Banners · Chips · Progress · TimerRing · PaywallCard · EmptyState · Skeleton  

**Added this revision:** VoiceRecordBar · Waveform · KeepNoteCard · KeepColorRow · KeepChecklist · AgendaPeek · DayChipStrip · VaultDocRow · DriveStatusBanner · ResumeCard · MicPermissionCard · SegmentedVaultTabs · FamilyMemberChip

---

*Next: [[07_MOTION]]*
