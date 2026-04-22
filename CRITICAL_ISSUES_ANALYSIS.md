# AIIMIN — Critical Issues Root Cause Analysis

**Date:** 2026-03-25  
**Analysis:** Deep-dive into persistent bugs across builds

---

## 🔴 ISSUE 1: Reflection Button Crash (Mobile)

### Symptom
Clicking reflection button on mobile app causes crash

### Root Cause
The Pomodoro reflection feature exists in desktop (`PomodoroTimer.jsx`) but:
- No dedicated "reflection" button exists in mobile app
- If user added a reflection button, it likely references non-existent component
- Mobile app is data-collection only, no Pomodoro timer exists there

### Fix Required
**Option A:** Remove reflection button from mobile (mobile is data-collection only)
**Option B:** Add lightweight reflection capture to mobile (simple journal entry)

**Recommended:** Option A - Keep mobile focused on data collection

---

## 🔴 ISSUE 2: Screen Time Display (Incorrect + Wrong Format)

### Symptom
- Screen time shows incorrect values (different from actual device screen time)
- Shows in minutes only, not hrs+mins format
- Shows "mobile uptime" which is unnecessary

### Root Cause
**CRITICAL FINDING:** There is NO actual screen time tracking implemented in the codebase.
- No UsageStatsManager API integration (Android)
- No Screen Time API integration (iOS)
- No PWA-compatible usage tracking exists
- Any "screen time" display is showing MOCK/PLACEHOLDER data

### Why It Shows Wrong Data
The screen time widget is likely displaying:
- Random/mock numbers
- Pomodoro focus time (which is NOT screen time)
- Some other metric mislabeled as "screen time"

### Fix Required
**Option A (Recommended):** REMOVE screen time feature entirely
- PWA cannot access native device usage stats
- Requires native app (React Native/Capacitor) for real tracking
- Misleading users with fake data damages trust

**Option B:** Implement native wrapper + UsageStatsManager
- Major undertaking (native development)
- Requires Play Store permissions justification
- Out of scope for PWA

**Option C:** Rename to "Focus Time" and show actual Pomodoro data
- Honest representation
- Uses existing tracked data

---

## 🔴 ISSUE 3: Sleep Pattern Detection Not Working

### Symptom
No sleep patterns detected or analyzed

### Root Cause
The `SleepAnalytics.jsx` component HAS pattern detection logic:
- Bedtime consistency calculation (circular mean)
- Wake time consistency
- Sleep debt tracking
- Chronotype detection (Early Bird / Night Owl)
- Mood correlation

**BUT:**
- Component may not be rendered on mobile (mobile is data-collection only)
- Dashboard sleep analytics may not be visible/accessible
- Pattern detection requires 7+ days of data to show meaningful results

### Fix Required
1. Ensure SleepAnalytics is visible on dashboard `/systems/physical`
2. Add sleep pattern summary to mobile (read-only, after save)
3. Improve pattern visualization (currently just charts, no insights)

---

## 🔴 ISSUE 4: Steps Restricted - No Permission Navigation

### Symptom
Clicking "steps restricted" just opens settings, no proper permission flow

### Root Cause
**CRITICAL FINDING:** PWA CANNOT access native step counter.
- No Web API exists for pedometer/step counting
- Requires native app for automatic step tracking
- Current implementation: MANUAL step entry only

### Why "Restricted" Shows
- User expects automatic step tracking (like Google Fit/Apple Health)
- PWA cannot provide this
- No clear messaging about limitation

### Fix Required
1. **Remove "restricted" language** - confusing
2. **Add clear messaging:** "Manual entry only — PWA cannot access step sensor"
3. **Option:** Suggest native app for auto-tracking (future)
4. **Improve manual entry:** Quick-add chips (5k, 8k, 10k, 12k) already exist

---

## 🔴 ISSUE 5: Forensic Identity Section (Poorly Made)

### Symptom
- Account/Identity section not usable
- No proper features
- Spending notifications in dollars (not INR)

### Root Cause
The Account modal (`AccountModal.jsx`) has:
- Profile settings ✓
- Change password ✓
- Data export ✓
- Account deletion ✓

**BUT:**
- "Forensic Identity" features were planned but not implemented
- No spending behavior analysis
- No identity tracking beyond basic profile
- Currency symbols inconsistent (some $ some ₹)

### Fix Required
1. **Rename "Forensic Identity" → "Account Settings"** (accurate naming)
2. **Add spending insights:**
   - Top spending categories
   - Unusual spending alerts
   - Late-night spending patterns (already exists in MoneyOverview)
3. **Fix currency:** Ensure ALL money displays use ₹ (INR)

---

## 🔴 ISSUE 6: Forensic Timeline (Long App List)

### Symptom
Shows crazy long list of apps opened and for what time

### Root Cause
**CRITICAL FINDING:** This feature DOES NOT EXIST in the codebase.
- No app usage tracking implemented
- No timeline of app usage
- Cannot show app usage without native API access

This appears to be a planned feature that was discussed but never built.

### Fix Required
**Option A:** Remove references to non-existent feature
**Option B:** Build actual app usage tracking (requires native app)
**Option C:** Show behavioral timeline instead (logs, sessions, etc.)

**Recommended:** Option C — Show actual tracked data:
- Daily log completion timeline
- Pomodoro sessions
- Money transactions
- Tasks completed

---

## 🔴 ISSUE 7: Launch Recovery Protocol (Does Nothing)

### Symptom
Button does nothing when clicked

### Root Cause
**CRITICAL FINDING:** This feature DOES NOT EXIST.
- No "Recovery Protocol" implementation found
- No protocol system exists
- Likely planned feature that was never built

### Fix Required
**Option A:** Remove button (it's broken)
**Option B:** Implement actual recovery protocol

**Recommended Implementation:**
Recovery Protocol = Guided reset sequence:
1. Sleep recovery plan (calculate sleep debt, suggest bedtime)
2. Stress reduction exercises (breathing, meditation timer)
3. Digital detox suggestions (based on "screen time" if implemented)
4. Social connection nudges (message a friend, call family)
5. Physical movement (stretching, walk suggestions)

---

## 📊 Summary: What Exists vs What's Planned

| Feature | Status | Reality |
|---------|--------|---------|
| Reflection (Desktop) | ✅ Implemented | Pomodoro reflection works |
| Reflection (Mobile) | ❌ Not implemented | No reflection component |
| Screen Time Tracking | ❌ NOT implemented | PWA cannot access this |
| Sleep Pattern Detection | ⚠️ Partial | Exists but not visible |
| Automatic Step Tracking | ❌ NOT implemented | PWA cannot access this |
| Forensic Identity | ⚠️ Partial | Basic account settings only |
| App Usage Timeline | ❌ NOT implemented | Requires native API |
| Recovery Protocol | ❌ NOT implemented | No implementation |

---

## 🛠️ Recommended Action Plan

### Phase 8A: Remove Broken/Misleading Features (1-2 days)
1. Remove "screen time" display (fake data is worse than no data)
2. Remove "app usage timeline" references
3. Remove "Launch Recovery Protocol" button OR implement basic version
4. Rename "Forensic Identity" → "Account Settings"

### Phase 8B: Fix Existing Features (2-3 days)
1. **Sleep Patterns:**
   - Add sleep insights card to mobile (post-save summary)
   - Improve SleepAnalytics visualization
   - Add sleep pattern streaks (consistent bedtime, etc.)

2. **Steps:**
   - Change "restricted" messaging to "manual entry"
   - Add tooltip: "PWA cannot access step sensor"

3. **Currency:**
   - Audit all money displays for ₹ consistency
   - Fix any remaining $ symbols

4. **Reflection:**
   - Remove reflection button from mobile (not in scope)
   - OR add simple journal prompt after save

### Phase 8C: Implement Missing Features (Future)
1. **Recovery Protocol** (if desired):
   - Sleep debt calculator + bedtime suggestion
   - Breathing exercise timer
   - Gratitude prompt
   - Movement suggestion

2. **Behavioral Timeline** (instead of app usage):
   - Show daily log streaks
   - Pomodoro sessions timeline
   - Money transactions
   - Tasks completed

---

## ⚠️ Critical Technical Limitations

### PWA Cannot Access:
- Step counter / pedometer
- Screen time / app usage
- Health data (Google Fit / Apple Health)
- Device sensors (except basic ones)

### Requires Native App:
- React Native
- Flutter
- Capacitor wrapper

**Recommendation:** Be honest with users about PWA limitations. Don't show fake data or misleading metrics.

---

**End of Analysis**
