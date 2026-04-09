# AIIMIN Android App — Complete UI Redesign Implementation Guide

**Date:** 2026-03-26  
**Status:** DESIGN TOKENS UPDATED  
**Next:** Build all new features

---

## ✅ Completed (Design System)

### 1. Color Palette Updated
**File:** `app/src/main/java/com/aiimin/app/ui/theme/Color.kt`

**Changes:**
- `BackgroundDark`: #0E100F → **#1C1814** (warm near-black)
- `BrandTerracotta`: #FF7A00 → **#C8621A** (richer amber-orange)
- `BrandGold`: #FFB800 → **#E8751A** (warm gold)
- `SuccessGreen`: #4CAF50 → **#15803D** (warm forest green)
- All typography colors updated for new backgrounds

### 2. Typography System Updated
**File:** `app/src/main/java/com/aiimin/app/ui/theme/Type.kt`

**Changes:**
- `HeadlineText`: 28sp Black → **24sp SemiBold** (no more screaming headers)
- Removed ALL CAPS styling
- Added `DisplayText` for large numbers/scores
- Added `MetricText` for card metrics
- Reduced letter-spacing throughout

---

## 🔄 Remaining Implementation Tasks

### Task 3: Update TodayScreen (Headers + Cards)
**What to change:**
- Replace orange ALL CAPS headers with new `HeadlineText` style
- Update card designs with left-border accents for alerts
- Fix visual hierarchy between screen types
- Use new color palette consistently

**Files:** `app/src/main/java/com/aiimin/app/ui/screens/TodayScreen.kt`

---

### Task 4: Bottom Navigation with Labels
**What to create:**
- 5 tabs: Home, Plan, +, History, Intel
- Add text labels below icons
- Improve visual feedback for active state

**Files:** `app/src/main/java/com/aiimin/app/ui/components/FloatingDock.kt`

---

### Task 5: Redesigned Score Ring
**What to change:**
- Thicker gradient arc (12dp → 16dp)
- Add context badge: "12/100 · Needs attention"
- Better visual weight

**Files:** `app/src/main/java/com/aiimin/app/ui/screens/TodayScreen.kt` (DailyFocusRing composable)

---

### Task 6: Login Screen Theme
**What to change:**
- Remove dark background
- Match cream surface of main app
- Consistent branding

**Files:** `app/src/main/java/com/aiimin/app/ui/screens/LoginScreen.kt` (if exists)

---

## 🆕 New Features to Implement

### Feature 7: Focus Session Timer
**Priority:** 🔴 CRITICAL  
**ETA:** 2 hours

**What:**
- 25m/50m deep work timer
- Lock screen during session
- Countdown ring visualization
- XP reward on completion

**Files to Create:**
- `app/src/main/java/com/aiimin/app/features/focus/FocusSessionScreen.kt`
- `app/src/main/java/com/aiimin/app/features/focus/FocusTimerViewModel.kt`
- `app/src/main/java/com/aiimin/app/features/focus/FocusLockService.kt` (optional)

**Integration:**
- Add FAB to TodayScreen
- Navigate to FocusSessionScreen on click

---

### Feature 8: 7-Day Streak Heatmap
**Priority:** 🟡 HIGH  
**ETA:** 1 hour

**What:**
- Single row of 7 color-intensity blocks
- Shows behavioral consistency
- Zero data overhead (uses existing logs)

**Files to Modify:**
- `app/src/main/java/com/aiimin/app/ui/screens/LogsScreen.kt` (add heatmap at top)
- `app/src/main/java/com/aiimin/app/domain/usecase/GetStreakUseCase.kt` (add 7-day calculation)

---

### Feature 9: Body Quick Log
**Priority:** 🟡 HIGH  
**ETA:** 1.5 hours

**What:**
- Single bottom sheet from + FAB
- Water (glasses counter)
- Gym check-in (toggle + duration)
- Sleep log (bedtime/wake time)

**Files to Create:**
- `app/src/main/java/com/aiimin/app/features/logs/BodyQuickLogBottomSheet.kt`

**Files to Modify:**
- `app/src/main/java/com/aiimin/app/ui/screens/MainScreen.kt` (add to + FAB actions)

---

### Feature 10: App Usage Blocker
**Priority:** 🟡 HIGH  
**ETA:** 2 hours

**What:**
- When Dopamine Audit detects loop
- Offer "Block Instagram for 1h"
- Uses Android UsageStatsManager
- Actual intervention, not just tracking

**Files to Create:**
- `app/src/main/java/com/aiimin/app/features/blocker/AppBlockerService.kt`
- `app/src/main/java/com/aiimin/app/ui/components/AppBlockDialog.kt`

**Files to Modify:**
- `app/src/main/java/com/aiimin/app/domain/engine/PhoneUsageEngine.kt` (add loop detection)
- `app/src/main/java/com/aiimin/app/ui/screens/InsightsScreen.kt` (show block suggestion)

---

### Feature 11: Weekly Mission
**Priority:** 🟢 MEDIUM  
**ETA:** 1 hour

**What:**
- One big goal per week
- XP reward from existing gamification
- Lives at top of Planner screen

**Files to Create:**
- `app/src/main/java/com/aiimin/app/domain/model/WeeklyMission.kt`
- `app/src/main/java/com/aiimin/app/domain/usecase/GetWeeklyMissionUseCase.kt`

**Files to Modify:**
- `app/src/main/java/com/aiimin/app/ui/screens/PlannerScreen.kt` (add mission card at top)

---

### Feature 12: Reflection Vault
**Priority:** 🟢 MEDIUM  
**ETA:** 1.5 hours

**What:**
- Searchable history of all reflections
- "Capture Reflection" already exists but writes to void
- Filter by date, mood, tags

**Files to Create:**
- `app/src/main/java/com/aiimin/app/ui/screens/ReflectionVaultScreen.kt`
- `app/src/main/java/com/aiimin/app/features/logs/ReflectionHistoryViewModel.kt`

**Files to Modify:**
- `app/src/main/java/com/aiimin/app/domain/repository/ReflectionRepository.kt` (add query methods)
- `app/src/main/java/com/aiimin/app/ui/screens/LogsScreen.kt` (add navigation to vault)

---

## 📊 Implementation Order

### Phase 1: Critical UI Fixes (2 hours)
1. ✅ Color palette update (DONE)
2. ✅ Typography update (DONE)
3. TodayScreen headers + cards
4. Bottom navigation labels
5. Score ring redesign

### Phase 2: Core Features (4 hours)
6. Focus Session Timer (highest leverage)
7. Body Quick Log
8. 7-Day Streak Heatmap

### Phase 3: Advanced Features (4 hours)
9. App Usage Blocker
10. Weekly Mission
11. Reflection Vault

### Phase 4: Polish (2 hours)
12. Login screen theme
13. Test all features
14. Fix any bugs

**Total Estimated Time:** ~12 hours

---

## 🧪 Build Verification Checklist

After implementing all features:

- [ ] Project compiles without errors
- [ ] No deprecated API usage warnings
- [ ] All new colors render correctly
- [ ] Typography hierarchy is clear
- [ ] Bottom nav labels are readable
- [ ] Focus timer works correctly
- [ ] Streak heatmap displays 7 days
- [ ] Body quick log saves data
- [ ] App blocker actually blocks
- [ ] Weekly mission shows in Planner
- [ ] Reflection vault is searchable
- [ ] Login screen matches cream theme

---

## ⚠️ Critical Notes

1. **Backward Compatibility:** All existing data must remain accessible
2. **Theme Consistency:** Light and dark themes must both work
3. **Performance:** New features must not slow down app
4. **Battery:** Focus timer and app blocker must be battery-efficient
5. **Permissions:** App blocker requires special permissions (document this)

---

**Ready to implement. Building features systematically now.**
