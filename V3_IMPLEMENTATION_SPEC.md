# AIIMIN V3 UI — Complete Implementation Specification

**Date:** 2026-03-26  
**Status:** DESIGN TOKENS APPLIED ✅  
**Build:** ✅ SUCCESSFUL (previous build)

---

## ✅ COMPLETED

### 1. V3 Design Tokens (Color.kt)
All colors updated per specification:
- ✅ `colorHeroBg` = #1C1814
- ✅ `colorPageBg` = #F5F0E8
- ✅ `colorCardBg` = #FEFCF9
- ✅ `colorCardBgDim` = #F0EBE1
- ✅ `colorPrimary` = #C8621A
- ✅ `colorText` = #1C1814
- ✅ `colorTextMuted` = #9B9590
- ✅ `colorDarkBase` = #0D0B08

### 2. Theme System (Theme.kt)
- ✅ Light scheme uses cream background
- ✅ Dark scheme uses hero brown
- ✅ All colors mapped to Material 3 color scheme

---

## 📋 V3 REBUILD CHECKLIST

### Phase 1: Core Components (2-3 hours)

#### 1.1 Bottom Navigation (FloatingDock.kt)
**Changes needed:**
- Background: `colorCardBg`
- Top border: 0.5dp `colorBorderLight`
- 5 items: Home, Plan, FAB, History, Intel
- FAB: 38dp circle, `colorPrimary`, elevated 4dp
- Labels: 7.5sp, selected=`colorPrimary`, unselected=`colorTextMuted`

**File:** `app/src/main/java/com/aiimin/app/ui/components/FloatingDock.kt`

#### 1.2 Cards (Create Common Component)
**Spec:**
- Background: `colorCardBg`
- Corner radius: 16dp
- Border: 0.5dp `colorBorderLight`
- Padding: 11dp vertical / 13dp horizontal

**File:** Create `app/src/main/java/com/aiimin/app/ui/components/V3Card.kt`

#### 1.3 Chips (Create Common Component)
**Spec:**
- Height: 30dp
- Idle: `colorChipIdle` bg, `colorChipIdleText`, border 0.5dp
- Active: `colorPrimary` bg, white text, no border
- Radius: 8dp

**File:** Create `app/src/main/java/com/aiimin/app/ui/components/V3Chip.kt`

#### 1.4 Page Headers (Create Common Component)
**Spec:**
- Background: `colorPageBg`
- Padding: 18dp horizontal, 8dp top, 6dp bottom
- Title: 20sp/700/`colorText`, letterSpacing=-0.02em
- Subtitle: 10sp/`colorTextMuted`

**File:** Create `app/src/main/java/com/aiimin/app/ui/components/V3PageHeader.kt`

---

### Phase 2: Screen Rebuilds (4-5 hours)

#### 2.1 Home Screen (TodayScreen.kt)
**Layout:**
- **Hero Section** (dark `colorHeroBg`):
  - Status bar padding
  - Top bar: Avatar (28dp) | Logo | Add button
  - Score: 52sp bold + "/100" 18sp 35% alpha
  - Badge: pill with `colorPrimary` 25% alpha
  - Arc ring: 72dp, 5dp stroke width

- **Body Section** (cream `colorPageBg`):
  - Metric row: 3 equal cards (58dp height)
  - Focus CTA: dark card (`colorCardDark`)
  - Task empty state
  - Spending alert (orange left border)

**File:** `app/src/main/java/com/aiimin/app/ui/screens/TodayScreen.kt`

#### 2.2 Planner Screen
**Changes:**
- Page header per V3 spec
- Calendar widget
- Operations list with new card style
- Weekly Mission card (NEW)

**File:** `app/src/main/java/com/aiimin/app/ui/screens/PlannerScreen.kt`

#### 2.3 History Screen
**Changes:**
- Page header
- Day list with new card style
- 7-Day Score Trend chart (NEW)

**File:** `app/src/main/java/com/aiimin/app/ui/screens/LogsScreen.kt`

#### 2.4 Intelligence Screen
**Changes:**
- Page header with search
- Execution score card
- Weekly pattern card
- Digital balance card

**File:** `app/src/main/java/com/aiimin/app/ui/screens/InsightsScreen.kt`

#### 2.5 Login Screen
**Changes:**
- Full screen background: `colorDarkBase`
- Card: `colorCardDark`, 24dp radius, border 0.5dp `colorBorderDark`
- Tab switcher: active tab `Color.White.copy(alpha = 0.1f)`
- Inputs: `Color.White.copy(alpha = 0.06)` bg, 12dp radius
- CTA: `colorPrimary`, 48dp height, 14dp radius

**File:** `app/src/main/java/com/aiimin/app/ui/screens/LoginScreen.kt`

#### 2.6 Add Task Screen
**Changes:**
- Back header (no secondary action)
- Input: `colorCardBgDim` bg, 12dp radius
- Duration chips (V3Chip component)
- Priority chips
- Mode chips
- Save button: `colorPrimary`, 48dp height

**File:** `app/src/main/java/com/aiimin/app/ui/screens/AddTaskScreen.kt`

---

### Phase 3: New Features (3-4 hours)

#### 3.1 Focus Session Timer (HIGH PRIORITY)
**Files:**
- `features/focus/FocusSessionScreen.kt`
- `features/focus/FocusTimerViewModel.kt`

**UI:**
- Full-screen overlay, `colorHeroBg`
- Giant countdown: 48sp
- Pause/End buttons
- Disables back navigation

**Logic:**
- CountDownTimer (25m/50m)
- Store in Room DB
- +10 XP on complete

#### 3.2 Weekly Mission
**Files:**
- `domain/model/WeeklyMission.kt`
- Update `PlannerScreen.kt`

**UI:**
- Card with star icon
- "(+50 XP)" label
- Set mission sheet

#### 3.3 Reflection Vault
**Files:**
- `ui/screens/ReflectionVaultScreen.kt`
- `features/logs/ReflectionHistoryViewModel.kt`

**UI:**
- Searchable list
- Entry: date, mood emoji, text

#### 3.4 7-Day Heatmap
**Files:**
- `ui/components/ScoreHeatmap.kt`
- Update `LogsScreen.kt`

**UI:**
- 7 colored bars
- Height = score proportion
- Color = `colorPrimary` opacity

---

## 🏗️ BUILD INSTRUCTIONS

### Current Status
**Last successful build:** ✅ YES  
**APK location:** `app/build/outputs/apk/debug/app-debug.apk`

### To Build V3
1. **Apply design tokens** ✅ DONE
2. **Implement components** (Phase 1)
3. **Rebuild screens** (Phase 2)
4. **Add new features** (Phase 3)
5. **Build:** `./gradlew assembleDebug`

---

## 📊 MIGRATION GUIDE

### Old → New Color Mapping

| Old | New | Usage |
|-----|-----|-------|
| `BackgroundDark` | `colorHeroBg` | Home hero section |
| `BackgroundLight` | `colorPageBg` | All screen backgrounds |
| `CardLight` | `colorCardBg` | Card surfaces |
| `BrandTerracotta` | `colorPrimary` | Primary actions |
| `TextPrimaryLight` | `colorText` | Primary text |
| `TextMutedLight` | `colorTextMuted` | Secondary text |

### Typography Changes

| Element | Old | New |
|---------|-----|-----|
| Page Title | 24sp SemiBold | 20sp Bold, -0.02em |
| Header | Orange ALL CAPS | 15sp/500/#1C1814 |
| Body | 14sp | 13sp |
| Label | 12sp | 8sp uppercase |

---

## ⚠️ IMPORTANT NOTES

1. **Backward Compatibility:** Keep legacy color aliases with `@Deprecated`
2. **Theme:** V3 uses light theme by default (dark only for login/hero)
3. **Borders:** All cards use 0.5dp border (was none or 1dp)
4. **Spacing:** Reduced padding throughout for denser info
5. **Typography:** Smaller sizes, tighter letter-spacing

---

## 🎯 NEXT STEPS

1. **Review this specification** thoroughly
2. **Implement Phase 1** (components) first
3. **Test each screen** as you rebuild
4. **Build frequently** to catch errors early
5. **Compare with mockups** constantly

---

**Specification Version:** 1.0  
**Last Updated:** 2026-03-26  
**Status:** Ready for Implementation

---

**End of Specification**
