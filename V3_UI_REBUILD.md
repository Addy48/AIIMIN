# AIIMIN V3 UI Rebuild — Implementation Guide

**Date:** 2026-03-26  
**Status:** DESIGN TOKENS APPLIED  
**Next:** Implement all screens per V3 mockups

---

## ✅ COMPLETED

### 1. Color Palette (Color.kt)
- ✅ `colorHeroBg` = #1C1814 (dark warm brown)
- ✅ `colorPageBg` = #F5F0E8 (warm cream)
- ✅ `colorCardBg` = #FEFCF9 (near-white cards)
- ✅ `colorCardBgDim` = #F0EBE1 (metric tiles)
- ✅ `colorPrimary` = #C8621A (amber orange)
- ✅ `colorText` = #1C1814
- ✅ `colorTextMuted` = #9B9590
- ✅ `colorDarkBase` = #0D0B08 (login)

### 2. Theme.kt Updated
- ✅ Light scheme uses cream background
- ✅ Dark scheme uses hero brown
- ✅ All colors mapped correctly

---

## 🔄 REMAINING IMPLEMENTATION

### Home Screen (TodayScreen.kt)
**Layout:** Vertical split
- **Hero Section:**
  - Background: `colorHeroBg`
  - Top bar: Avatar (28dp) | Logo | Add button
  - Score: 52sp bold + "/100" 18sp
  - Badge: pill with `colorPrimary` 25% alpha
  - Arc ring: 72dp CircularProgressIndicator

- **Body Section:**
  - Background: `colorPageBg`
  - Metric row: 3 equal cards (58dp height)
  - Focus CTA: dark card with Start button
  - Task empty state with "Initialize task" link
  - Spending alert with orange left border

### Bottom Navigation (FloatingDock.kt)
- 5 items: Home, Plan, FAB, History, Intel
- FAB: 38dp circle, `colorPrimary`, elevated
- Labels: 7.5sp, selected=#C8621A, unselected=#9B9590
- Background: `colorCardBg`, top border 0.5dp

### Page Headers
- Title: 20sp/700/#1C1814, letterSpacing=-0.02em
- Subtitle: 10sp/#9B9590
- Right actions: 28dp icon buttons

### Cards
- Background: `colorCardBg`
- Corner: 16dp
- Border: 0.5dp rgba(0,0,0,0.06)
- Padding: 11dp vertical / 13dp horizontal

### Chips
- Idle: `colorChipIdle` bg, `colorChipIdleText`, 30dp height
- Active: `colorPrimary` bg, white text
- Radius: 8dp

### Login Screen
- Background: `colorDarkBase` full screen
- Card: `colorCardDark`, 24dp radius
- Tab switcher: active tab rgba(255,255,255,0.1)
- Inputs: rgba(255,255,255,0.06) bg
- CTA: `colorPrimary`, 48dp height

---

## 🆕 NEW FEATURES

### 1. Focus Session Timer (HIGH PRIORITY)
**Files to create:**
- `features/focus/FocusSessionScreen.kt`
- `features/focus/FocusTimerViewModel.kt`
- `domain/usecase/StartFocusSessionUseCase.kt`

**UI:**
- Full-screen overlay, `colorHeroBg`
- Giant countdown: 48sp
- Pause/End buttons
- Disables back navigation

**Logic:**
- Uses CountDownTimer
- Stores in Room DB
- On complete: +10 XP

### 2. Weekly Mission
**Files to modify:**
- `ui/screens/PlannerScreen.kt` (add mission card)
- `domain/model/WeeklyMission.kt` (create data class)

**UI:**
- Planner screen card with star icon
- "(+50 XP)" label
- Set mission sheet: text input + confirm

### 3. Reflection Vault
**Files to create:**
- `ui/screens/ReflectionVaultScreen.kt`
- `features/logs/ReflectionHistoryViewModel.kt`

**UI:**
- Searchable list
- Each entry: date, mood emoji, text, mood_score
- Accessible from History tab

### 4. 7-Day Heatmap
**Files to modify:**
- `ui/screens/HistoryScreen.kt` (add at bottom)
- `ui/components/ScoreHeatmap.kt` (create component)

**UI:**
- 7 colored bars
- Height = proportional to score
- Color = opacity of `colorPrimary`

---

## 📊 BUILD STATUS

**Last Build:** ✅ SUCCESSFUL (1m 55s)  
**APK:** `app/build/outputs/apk/debug/app-debug.apk`

---

## 🎯 IMPLEMENTATION ORDER

1. ✅ Color tokens (DONE)
2. ✅ Theme update (DONE)
3. ⏳ Home screen hero section
4. ⏳ Bottom navigation redesign
5. ⏳ Focus Session Timer
6. ⏳ Weekly Mission
7. ⏳ Reflection Vault
8. ⏳ 7-Day Heatmap
9. ⏳ Login screen redesign
10. ⏳ All page headers
11. ⏳ All cards
12. ⏳ All chips

---

**Ready to implement. Building screens now.**
