# 07 — Motion Design

> **Depends:** [[06_DESIGN_SYSTEM]] [[04_APP_FLOW]]  
> **Status:** Complete draft · 2026-07-19  
> **Owner lens:** Motion (Nothing/Apple restraint + M3 tokens)

---

## 1. Principles

1. Motion explains hierarchy — never decorates emptiness.  
2. Interruptible always.  
3. Reduced motion → opacity cuts only.  
4. Peak moments rare (≤2 memorable motions per session).  
5. Physics: spring for sheets; easing for fades.

---

## 2. Timing tokens

| Token | ms | Easing | Use |
|-------|-----|--------|-----|
| `short1` | 50 | linear | Ripple start |
| `short2` | 100 | FastOutSlowIn | Icon toggle |
| `short3` | 150 | FastOutSlowIn | Chip select |
| `short4` | 200 | FastOutSlowIn | Button press feedback |
| `medium1` | 250 | EmphasizedDecel | Fade content |
| `medium2` | 300 | Emphasized | Tab change, sheet settle |
| `medium3` | 350 | Emphasized | Push enter |
| `medium4` | 400 | Emphasized | Container transform |
| `long2` | 500 | Emphasized | Shared element hero |
| `peak` | 600–800 | Spring | Success celebration |

---

## 3. Springs (sheets)

damping 0.85 · stiffness 400 (tunable) · dismiss velocity threshold platform default.

---

## 4. Catalog

### Page / tab

| Name | Spec | Haptic |
|------|------|--------|
| `tab_fade` | Crossfade 200–300ms | none |
| `push_forward` | Shared axis X + fade 300ms | none |
| `pop_back` | Reverse; predictive back linked | none |

### Surfaces

| Name | Spec | Haptic |
|------|------|--------|
| `sheet_present` | Slide up + scrim 0→0.4 · spring | light |
| `sheet_dismiss` | Slide down 250ms | none |
| `modal_in` | Fade + scale 0.92→1 250ms | light |

### Components

| Name | Spec | Haptic |
|------|------|--------|
| `btn_press` | Scale 0.98 100ms | light optional |
| `habit_tick` | Check draw + color 200ms | light |
| `score_countup` | Mono number tween 600ms | none |
| `streak_flame` | Subtle scale pulse once | light |
| `skeleton_shimmer` | Gradient loop 1200ms | none |
| `banner_in` | Slide from top 250ms | none |
| `swipe_reveal` | Follow finger | none |

### Peak / emotion

| Name | Spec | Haptic |
|------|------|--------|
| `peak_check` | Check burst + particles lite ≤800ms | medium |
| `focus_complete` | Ring close + soft glow | double light |
| `day_complete` | Card rise + confetti lite | medium |
| `voice_pulse` | Mic ring breathe while recording | light tick start/stop |
| `keep_expand` | Shared-element card → detail 400ms | none |
| `keep_pin` | Pin icon spring | light |
| `vault_open` | Doc fade-through 250ms | none |
| `drive_ok` | Status banner green flash | none |

### AI

| Name | Spec |
|------|------|
| `ai_thinking` | Dot pulse / shimmer line |
| `ai_stream` | Token fade-in per chunk |
| `transcript_in` | Partial transcript fade 150ms |

### Onboarding

Staggered card enter 50ms delay · page dots morph.

### Notifications (in-app)

Toast slide + fade · stack.

---

## 5. Shared elements

Home ScoreHero → More/Score if needed.  
**KeepNoteCard → NoteDetail** mandatory shared bounds.  
Habit tick: draw check.

---

## 6. Loading

Skeleton for Keep grid (card placeholders) · Journal feed lines · Vault rows.  
Voice: waveform placeholder while permission resolves.

---

## 7. Do not

Infinite looping attention hacks · parallax overload · blocking Lottie >1.5s · celebration every tick · month-calendar page-flip fantasy.

---

*Aligned with Journal voice + Keep notes · [[05_NATIVE_UX]]*
