# AIIMIN Android App — Critical Bug Fixes

**Date:** 2026-03-26  
**Status:** Ready to Apply  
**Location:** `/Users/aaditya/AndroidStudioProjects/AIIMIN/`

---

## 🔴 Issues Identified & Fixes

### 1. Reflection Button Crash
**Location:** `QuickLogBottomSheet.kt` → `MainScreen.kt`

**Problem:**
- "Capture Reflection" button in QuickActionsBottomSheet shows QuickLogDialog
- QuickLogBottomSheet has complex state management that may crash on configuration changes
- Mood selector and tag selection could cause state loss

**Fix:**
- Add proper state saving/restoration
- Add error handling for onSubmit callback
- Ensure ViewModel properly handles the reflection log insertion

**Files to Modify:**
- `app/src/main/java/com/aiimin/app/features/logs/QuickLogBottomSheet.kt`
- `app/src/main/java/com/aiimin/app/ui/screens/MainScreen.kt`

---

### 2. Screen Time Display Format
**Location:** `TodayScreen.kt` → `BehaviorSignalTile`

**Problem:**
- Shows `${screenTime}m` (e.g., "245m")
- Should show "Xh Ym" format (e.g., "4h 5m")
- InsightsScreen already has correct format, TodayScreen doesn't match

**Current Code (TodayScreen.kt line ~420):**
```kotlin
BehaviorSignalTile(
    label = "PHONE",
    value = "${screenTime}m",  // ❌ Shows "245m"
    icon = Icons.Default.Smartphone,
    ...
)
```

**Fix:**
```kotlin
val hours = screenTime / 60
val minutes = screenTime % 60
val screenTimeText = if (hours > 0) "${hours}h ${minutes}m" else "${minutes}m"

BehaviorSignalTile(
    label = "PHONE",
    value = screenTimeText,  // ✅ Shows "4h 5m"
    ...
)
```

---

### 3. System Uptime Metric (Remove)
**Location:** `TodayScreen.kt` → `BehaviorSignalsRow`

**Problem:**
- Shows "UPTIME" tile with system uptime
- Useless metric for behavior tracking
- Takes up valuable screen space

**Fix:**
- Remove uptime tile from BehaviorSignalsRow
- Replace with something useful (e.g., "STREAK" or "WATER")
- Or just show 3 tiles: STEPS, SLEEP, PHONE

**Files to Modify:**
- `app/src/main/java/com/aiimin/app/ui/screens/TodayScreen.kt`
- `app/src/main/java/com/aiimin/app/viewmodel/MainViewModel.kt` (remove uptime collection)

---

### 4. Steps Restricted — No Permission Flow
**Location:** `TodayScreen.kt` → `BehaviorSignalsRow` → onStepsClick

**Problem:**
- Shows "RESTRICTED" when Health Connect not authorized
- Clicking opens general Settings (not Health Connect settings)
- No proper permission request flow

**Current Code:**
```kotlin
onStepsClick = {
    try {
        val intent = android.content.Intent(android.provider.Settings.ACTION_SETTINGS)
        context.startActivity(intent)  // ❌ Opens general settings
    } catch (_: Exception) {}
}
```

**Fix:**
```kotlin
onStepsClick = {
    if (!isHealthAuthorized) {
        // Launch Health Connect permission request
        val intent = android.content.Intent(
            "androidx.health.ACTION_SHOW_PERMISSIONS",
            android.net.Uri.parse("package:${context.packageName}")
        )
        // Or use HealthConnectClient.permissionController.requestPermission()
        context.startActivity(intent)
    }
}
```

**Better Fix:** Add a PermissionGateScreen that properly explains why steps are needed and requests permission gracefully.

---

### 5. Currency Display ($ → ₹)
**Location:** `QuickLogBottomSheet.kt` → Expense entry

**Problem:**
- Shows `$` prefix in expense amount
- We're in India, should show `₹` (INR)

**Current Code (line ~227):**
```kotlin
prefix = { Text("$", style = TitleText.copy(fontSize = 24.sp, color = BrandGold)) }
```

**Fix:**
```kotlin
prefix = { Text("₹", style = TitleText.copy(fontSize = 24.sp, color = BrandGold)) }
```

**Also fix:**
- `SpendingSignalCard` in TodayScreen.kt shows `$${amount}`
- Change to `₹${amount}`

---

### 6. Forensic Identity Section (Poor UX)
**Location:** ProfileScreen.kt / Account settings

**Problem:**
- "Forensic Identity" section is poorly designed
- No usable features
- Just shows basic profile info

**Fix:**
- Rename to "Account & Identity"
- Add actual features:
  - Identity metrics (streaks, rank, achievements)
  - Spending behavior analysis
  - App usage patterns
  - Sleep consistency score
- Make it actionable, not just informational

---

### 7. Launch Recovery Protocol (Does Nothing)
**Location:** NightClosure screen / Recovery screen

**Problem:**
- Button exists but does nothing
- No actual recovery protocol implemented

**Fix:**
Implement actual recovery protocol:
1. **Sleep Recovery:** Calculate sleep debt, suggest bedtime
2. **Digital Detox:** Suggest app limits based on usage
3. **Stress Reduction:** Breathing exercise timer (4-7-8 technique)
4. **Gratitude Prompt:** Log 3 things you're grateful for
5. **Movement Suggestion:** Quick stretching routine

**Create New File:**
`app/src/main/java/com/aiimin/app/features/recovery/RecoveryProtocolScreen.kt`

---

### 8. Sleep Pattern Detection (Not Working)
**Location:** `SleepEngine.kt` / `SleepManager.kt`

**Problem:**
- No pattern detection implemented
- Just shows raw sleep hours
- No chronotype, consistency, or debt analysis

**Fix:**
Implement in `SleepEngine.kt`:
```kotlin
data class SleepPattern(
    val chronotype: String, // "Early Bird", "Night Owl", "Intermediate"
    val consistencyScore: Int, // 0-100
    val avgBedtime: String, // "11:30 PM"
    val avgWakeTime: String, // "7:00 AM"
    val sleepDebtHours: Float,
    val recommendation: String
)

fun analyzeSleepPattern(logs: List<DailyLogEntity>): SleepPattern {
    // Calculate circular mean for bedtime/waketime
    // Detect chronotype based on average times
    // Calculate consistency (standard deviation)
    // Track sleep debt accumulation
}
```

---

## 📝 Files to Modify

| File | Issue | Priority |
|------|-------|----------|
| `TodayScreen.kt` | Screen time format, uptime removal, steps permission, currency | 🔴 Critical |
| `QuickLogBottomSheet.kt` | Reflection crash, currency | 🔴 Critical |
| `MainScreen.kt` | Reflection navigation | 🟡 High |
| `MainViewModel.kt` | Uptime collection removal | 🟡 High |
| `SleepEngine.kt` | Sleep pattern detection | 🟡 High |
| `PermissionManager.kt` | Health Connect permission | 🟡 High |
| `ProfileScreen.kt` | Forensic Identity UX | 🟢 Medium |
| `NightClosureScreen.kt` | Recovery Protocol | 🟢 Medium |

---

## 🚀 Implementation Order

1. **Fix Screen Time Format** (5 min) - Quick win
2. **Remove Uptime** (5 min) - Quick win
3. **Fix Currency** (5 min) - Quick win
4. **Fix Steps Permission** (30 min) - User frustration
5. **Fix Reflection Crash** (30 min) - Critical bug
6. **Sleep Pattern Detection** (2 hrs) - Complex
7. **Recovery Protocol** (2 hrs) - New feature
8. **Forensic Identity UX** (1 hr) - Polish

**Total Estimated Time:** ~6-7 hours

---

## ⚠️ Testing Checklist

After applying fixes:

- [ ] Screen time shows "4h 5m" not "245m"
- [ ] Uptime tile removed from Today screen
- [ ] Currency shows ₹ not $
- [ ] Steps click opens Health Connect settings
- [ ] Reflection button doesn't crash
- [ ] Sleep patterns detected and shown
- [ ] Recovery protocol actually does something
- [ ] Forensic Identity section useful

---

**Ready to implement. Waiting for confirmation to proceed.**
