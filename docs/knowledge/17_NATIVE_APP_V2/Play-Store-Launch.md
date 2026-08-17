---
authority: operations
derived_from: Roadmap/Legal-Pack-V1 · Roadmap/AIIMIN-V1-Blueprint §12 §15 §19 §27 · 17_NATIVE_APP_V2/20_ROADMAP Phase 5
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-04
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: leaf
note_type: NT-CHECKLIST
tags:
  - type/checklist
  - domain/play-store
  - status/living
---

# Play Store Launch Ledger — AIIMIN Native V3

> [!important] Two queues
> **Product / APK** (screen build, `assembleDebug`, device install) = other chat · `native-android-v3/` · [[V3-BUILD-TRACKER]].
> **This note** = release-readiness only. No fake Console declarations. No premature submit. No inventing legal entity fields.
> Never say **Play-ready** until every **release blocker = yes** row is `VERIFIED` with evidence.

## Overall release state

| Field | Value |
|-------|-------|
| **State** | `BUILDING` |
| **Play product** | Native V3 `native-android-v3/` — **not** Capacitor `/m` |
| **applicationId (release)** | `in.aiimin.app` |
| **Debug suffix** | `.v3` → install id `in.aiimin.app.v3` (side-by-side with V2; release has no suffix) |
| **Last ledger pass** | 2026-08-04 |
| **Do not conflate** | `BUILDING` ≠ `READY FOR CONSOLE` ≠ `IN TESTING` ≠ `RELEASE READY` ≠ `LIVE` |

### Allowed row statuses

`NOT STARTED` · `IN PROGRESS` · `VERIFIED` · `FOUNDER BLOCKED` · `COUNSEL BLOCKED`

### Allowed overall states

`BUILDING` · `READY FOR FOUNDER` · `READY FOR COUNSEL` · `READY FOR CONSOLE` · `IN TESTING` · `RELEASE READY` · `LIVE`

### Truth sources (priority)

1. Founder instruction  
2. [[Roadmap/Legal-Pack-V1]]  
3. [[Roadmap/AIIMIN-V1-Blueprint]] §12 · §15 · §19 · §27  
4. [[17_NATIVE_APP_V2/20_ROADMAP]] Phase 5  
5. Current app code / manifest / Gradle / backend / public legal pages  
6. Official Google Play policy **at submission time** (never from memory)

### Change-parity rule

Any change to permission · collected data · subprocessor · AI provider · price · entitlement · retention · sensitive feature must update **same release unit**: product · consent/disclosure UI · Legal Pack + `/privacy` · Play Data safety · **this ledger**. Incomplete parity = release blocked.

---

## 1 · PRODUCT RELEASE BAR

Owned by product chat for implementation. Tracked here for Play gate truth.

| ID | Requirement | Source | Owner | Status | Evidence | Dependency | Blocker | Last verified |
|----|-------------|--------|-------|--------|----------|------------|---------|---------------|
| P-01 | Play product = native V3 Compose app, not Capacitor `/m` | Mandate · Monorepo | eng | `VERIFIED` | `native-android-v3/` · package `in.aiimin.app` · Capacitor note in `09_FEATURES/Mobile/Capacitor-Android.md` is legacy shell | — | yes | 2026-08-04 |
| P-02 | Real auth + session cookie boundary; no client-supplied `user_id` | Blueprint · Auth arch | eng (product chat) | `NOT STARTED` | V3 still local-state / auth stub per [[V3-BUILD-TRACKER]] Onboarding | API wiring | yes | 2026-08-04 |
| P-03 | Capture-first Today works on device | Genesis · Tracker #3 | eng (product chat) | `IN PROGRESS` | Tracker ✅ local + goldens; phone install pending (device disconnected) | device | yes | 2026-08-04 |
| P-04 | Money: log + truth; empty ≠ fake ₹0 | Tracker #4 · Legal Pack money path | eng (product chat) | `IN PROGRESS` | Commit `d7721af3` · MoneyStore empty copy · goldens; `/api` wealth not wired | API | yes | 2026-08-04 |
| P-05 | Money V1 = opt-in transactional SMS **or** Share/paste/notif/manual/AI/Excel import | Legal Pack §11 · founder 2026-08-05 | eng | `IN PROGRESS` | `READ_SMS` in manifest (runtime + Money opt-in). Fallback paths shipped. **Play declaration required before store** | Play SMS use-case form | yes | 2026-08-05 |
| P-06 | Config: privacy / consent / export / deletion routing (honest) | Mandate · Blueprint §12 | eng (product chat) | `IN PROGRESS` | Config delete veil **refuses** even after DELETE (G6) — honest non-delete. Export label stub. No live wipe | real delete/export API + secure web handoff if used | yes | 2026-08-04 |
| P-07 | Account deletion + export path works E2E | Play policy · Legal L4 · LC-13 | eng | `NOT STARTED` | Web claims Account → Privacy; native refuses delete. No E2E proof | P-02 · live `/data-deletion` | yes | 2026-08-04 |
| P-08 | Offline / error states honest | Mandate | eng (product chat) | `IN PROGRESS` | Money offline golden exists; full cold-start path not release-proven | signed release build | yes | 2026-08-04 |
| P-09 | 18+ age gate (OD-10 closed) | Blueprint §27.5 · Legal Pack | eng (product chat) | `NOT STARTED` | Onboarding code has **no** eligibility/age step (repo grep 2026-08-04) | product Onboarding craft | yes | 2026-08-04 |
| P-10 | Cold-start → sign-in → Today → Capture → Settle on **signed release** AAB | Mandate product bar | eng | `NOT STARTED` | No release AAB artifact yet; debug only | S-02 · P-02 | yes | 2026-08-04 |
| P-11 | No health / money / AI claim beyond shipped function | Claim discipline Legal Pack §0.3 | eng + founder | `IN PROGRESS` | Local surfaces labelled SEED / not live where applicable; listing copy not written | listing (L-*) | yes | 2026-08-04 |
| P-12 | Score / Health: no medical claims; Health Connect only if shipped + declared | Blueprint §27 · Legal §11.3 | eng | `NOT STARTED` | Score screen next in product chat; Health Connect **not** in V3 manifest | product Score | yes (if health ships) | 2026-08-04 |

---

## 2 · PACKAGE, SIGNING, RELEASE BUILD

| ID | Requirement | Source | Owner | Status | Evidence | Dependency | Blocker | Last verified |
|----|-------------|--------|-------|--------|----------|------------|---------|---------------|
| S-01 | Permanent `applicationId` = `in.aiimin.app` | Play identity · Gradle | eng | `VERIFIED` | `native-android-v3/app/build.gradle.kts` `applicationId = "in.aiimin.app"`; debug `applicationIdSuffix = ".v3"` only | — | yes | 2026-08-04 |
| S-02 | Signed **release AAB** (not debug APK as product artifact) | Play | eng (CI / product when asked) | `NOT STARTED` | Release minify on; `signingConfig` still **debug fallback** in `build.gradle.kts` | upload keystore | yes | 2026-08-04 |
| S-03 | Upload keystore generated + backed up **outside git**; password never committed/printed | Play App Signing | founder + eng | `NOT STARTED` | `.gitignore` has `*.keystore`; no upload keystore in repo (correct). Backup not evidenced | founder backup proof | yes | 2026-08-04 |
| S-04 | Enrol Play App Signing | Play Console | founder | `FOUNDER BLOCKED` | No Console app / enrolment evidence | Play developer account | yes | 2026-08-04 |
| S-05 | `versionCode` monotonic; `versionName` policy | Play | eng | `IN PROGRESS` | Current `versionCode = 1`, `versionName = "3.0.0-alpha01"` — fine for pre-store; bump policy not written | first Console upload | no | 2026-08-04 |
| S-06 | Prod API HTTPS only; no debug flags / secrets in release binary | Security | eng | `IN PROGRESS` | Both debug+release `API_BASE_URL` = `https://api.aiimin.in/api`; minify+shrink on release. Binary audit of release AAB **not done** | S-02 | yes | 2026-08-04 |
| S-07 | R8 / minify tested on release | Gradle release | eng | `NOT STARTED` | `isMinifyEnabled = true` declared; no proven `bundleRelease` / install evidence this ledger | S-02 | yes | 2026-08-04 |
| S-08 | Recheck **current** Play targetSdk rule immediately before each submit | Google policy @ submit | eng | `IN PROGRESS` | Code targets **37** (`compileSdk`/`targetSdk` 37 per tracker). Must re-verify official requirement on submit day — do not freeze “37 forever” | submit date | yes | 2026-08-04 |

---

## 3 · LEGAL, PRIVACY, TRUST

Policy SoT: [[Roadmap/Legal-Pack-V1]]. Website pages under `frontend/src/pages/legal/` must match. **Do not invent** entity/address values.

| ID | Requirement | Source | Owner | Status | Evidence | Dependency | Blocker | Last verified |
|----|-------------|--------|-------|--------|----------|------------|---------|---------------|
| G-01 | Legal entity name filled (not placeholder) | Legal Pack §0.2 | founder | `FOUNDER BLOCKED` | `frontend/src/constants/legal.js`: `entity: 'AIIMIN'`, TODO for registered name | founder | yes | 2026-08-04 |
| G-02 | Entity type | Legal Pack §0.2 | founder | `FOUNDER BLOCKED` | Not filled as registered type | founder | yes | 2026-08-04 |
| G-03 | Registered postal address published | DPDP · Play · Legal §0.2 | founder | `FOUNDER BLOCKED` | `LEGAL.address = null`; `ADDRESS_FALLBACK` used | founder | yes | 2026-08-04 |
| G-04 | Grievance officer name + email live | DPDP Rules 2025 · L9 | founder | `IN PROGRESS` | `grievanceOfficer: 'Aaditya Upadhyay'`, `grievance@aiimin.in` in code — mailbox delivery **unproven** | founder mailbox | yes | 2026-08-04 |
| G-05 | Support / privacy / security emails | Legal Pack §0.2 | founder | `IN PROGRESS` | Named in `legal.js`; delivery unproven | founder | yes | 2026-08-04 |
| G-06 | Jurisdiction + liability cap | Legal Pack §0.2 | founder | `IN PROGRESS` | `jurisdiction: 'Uttar Pradesh, India'` + liabilityCap string in code — counsel not signed off | G-12 | no* | 2026-08-04 |
| G-07 | GSTIN if registered | Legal Pack §0.2 · L7 | founder | `FOUNDER BLOCKED` | Not in `legal.js` | founder | if charging | 2026-08-04 |
| G-08 | Effective dates honest | Legal Pack | eng | `IN PROGRESS` | `effectiveDate: 'July 31, 2026'` in code | counsel + publish | no | 2026-08-04 |
| G-09 | Live `/privacy` accurate | Play listing · L1 | eng | `IN PROGRESS` | Route in `App.js` + `Privacy.jsx` in repo. Prod returns SPA shell HTTP 200 (`www.aiimin.in/privacy` 2026-08-04). **Client content / deploy parity not browser-verified**; Vercel env may lag branch | deploy | yes | 2026-08-04 |
| G-10 | Live `/terms` `/data-deletion` `/refunds` `/grievance` `/subprocessors` `/security` `/contact` | Mandate · Play deletion URL | eng | `IN PROGRESS` | All routed in `App.js`. HTTP 200 SPA shells 2026-08-04. Content parity = deploy + browser proof needed | deploy | yes | 2026-08-04 |
| G-11 | No `you@example.com` / credibility bugs on legal pages | Legal Pack §0.2 | eng | `VERIFIED` (repo) | Grep legal pages: no `you@example.com`. Waitlist form placeholder still `you@example.com` (form UX, not legal page) | — | no | 2026-08-04 |
| G-12 | Indian counsel review | Legal Pack counsel gate | counsel + founder | `COUNSEL BLOCKED` | Pack says publish after counsel read-through — not done | G-01…G-03 | yes | 2026-08-04 |
| G-13 | Claim discipline: no E2E / “can’t read” / bank-grade / SMS access | Legal Pack §0.3 | eng | `IN PROGRESS` | `Security.jsx` explicitly denies E2E today; `Privacy.jsx` denies SMS/location/call-log. Listing + marketing not audited | listing | yes | 2026-08-04 |
| G-14 | Stale `frontend/public/privacy.html` removed or redirected | Legal Pack §12 #19 | eng | `IN PROGRESS` | Redirect stub in `frontend/public/privacy.html` + `vercel.json` permanent redirect `/privacy.html` → `/privacy`. Needs deploy + HTTP proof | Vercel deploy | yes | 2026-08-04 |
| G-15 | Data safety mapping table matches L1 | Legal Pack §10 | eng | `NOT STARTED` | Table exists in Legal Pack — Console form **not** filled (and must not be until binary truth) | S-02 · final scopes | yes | 2026-08-04 |

\*G-06 becomes blocker once counsel requires changes.

---

## 4 · PERMISSIONS AND SENSITIVE DATA

| ID | Requirement | Source | Owner | Status | Evidence | Dependency | Blocker | Last verified |
|----|-------------|--------|-------|--------|----------|------------|---------|---------------|
| R-01 | No call-log / location / accessibility / device admin / bulk contacts. **`READ_SMS` opt-in only** (founder 2026-08-05) | Blueprint §27 · Legal §11 · founder override | eng | `IN PROGRESS` | Manifest now includes `READ_SMS` (runtime). Privacy/listing must match before Play submit | Data safety + declaration | yes | 2026-08-05 |
| R-02 | Notification listener (UPI) only later, opt-in + disclosure + Data safety + review video | Legal §11.2 | eng | `NOT STARTED` | Not in manifest — correct for V1 wave | product decision | no (defer OK) | 2026-08-04 |
| R-03 | Health Connect opt-in; declare only used fields; Health apps form if shipped | Legal §11.3 | eng | `NOT STARTED` | Not in V3 | Score/health ship | yes if ships | 2026-08-04 |
| R-04 | Camera / mic / notifications / photos / usage stats: JIT rationale + equal Not now + revoke + matching declaration | Blueprint §27.3 | eng | `NOT STARTED` | Not requested yet | feature ship | yes if ships | 2026-08-04 |
| R-05 | Analytics / crash only after consent | Legal Pack · Blueprint | eng | `NOT STARTED` | Native Sentry/GA not wired; web consent banner exists in repo (`ConsentBanner.jsx`) — prod behaviour separate | LC-09/10 | yes | 2026-08-04 |
| R-06 | Prominent-disclosure recordings for each special-access permission | Blueprint §27.4 | eng | `NOT STARTED` | No special-access yet | R-02/R-03/R-04 | yes if special access | 2026-08-04 |

---

## 5 · PLAY CONSOLE AND LISTING

| ID | Requirement | Source | Owner | Status | Evidence | Dependency | Blocker | Last verified |
|----|-------------|--------|-------|--------|----------|------------|---------|---------------|
| L-01 | Play developer account + identity verification | Google | founder | `FOUNDER BLOCKED` | No evidence supplied | founder | yes | 2026-08-04 |
| L-02 | Create app `in.aiimin.app` in Console | Play | founder | `FOUNDER BLOCKED` | — | L-01 | yes | 2026-08-04 |
| L-03 | Data safety form from **final binary** + Legal Pack §10 only | Play · Mandate | eng + founder | `NOT STARTED` | Must not anticipate unshipped Health/Calendar/etc. | S-02 · G-15 · R-* | yes | 2026-08-04 |
| L-04 | Account deletion URL in listing = live `/data-deletion` | Play | founder | `NOT STARTED` | URL target `https://aiimin.in/data-deletion` (or www) once content verified | G-10 | yes | 2026-08-04 |
| L-05 | Privacy policy URL = live `/privacy` | Play | founder | `NOT STARTED` | `https://aiimin.in/privacy` | G-09 | yes | 2026-08-04 |
| L-06 | Health apps declaration | Play | eng | `NOT STARTED` | N/A until Health Connect ships — mark N/A when deferred | R-03 | yes if health | 2026-08-04 |
| L-07 | Content rating (IARC) | Play | founder | `NOT STARTED` | — | L-02 | yes | 2026-08-04 |
| L-08 | Target audience 18+ | DPDP · OD-10 | founder | `NOT STARTED` | Align with P-09 | P-09 | yes | 2026-08-04 |
| L-09 | Ads declaration = no ads | Product | founder | `NOT STARTED` | Product has no ads — form not submitted | L-02 | yes | 2026-08-04 |
| L-10 | Billing declaration honest (Play Billing vs web-only) | Play policy · Mandate | founder | `FOUNDER BLOCKED` | Entitlement model not chosen for native | founder | yes if digital goods on Play | 2026-08-04 |
| L-11 | Store listing short + full description (no SMS / restricted feature marketing) | Play | founder | `NOT STARTED` | — | P-11 | yes | 2026-08-04 |
| L-12 | Icon 512 · feature graphic 1024×500 | Play | founder / design | `NOT STARTED` | — | brand assets | yes | 2026-08-04 |
| L-13 | Phone screenshots of **shipped Compose** app (not web prototypes) | Mandate | eng + founder | `NOT STARTED` | Screenshot goldens are test refs, not store assets | device / release UI | yes | 2026-08-04 |
| L-14 | Category · countries · pricing · support contact | Play | founder | `FOUNDER BLOCKED` | — | L-01 | yes | 2026-08-04 |
| L-15 | Closed-test rule at account type — **verify in Console**, do not hardcode forever | Google @ account time | founder | `NOT STARTED` | Operating assumption for **new personal** accounts historically: ≥12 opted-in testers · ≥14 continuous days before production access **if Console still requires it**. Re-read Console checklist when L-01 exists | L-01 | yes | 2026-08-04 |

---

## 6 · QUALITY, CLOSED TEST, OPERATIONS

| ID | Requirement | Source | Owner | Status | Evidence | Dependency | Blocker | Last verified |
|----|-------------|--------|-------|--------|----------|------------|---------|---------------|
| Q-01 | Internal testing track + signed AAB on physical devices | Play | eng + founder | `NOT STARTED` | — | S-02 · L-02 | yes | 2026-08-04 |
| Q-02 | Closed testing (testers + duration per **current** Console rule) | L-15 | founder | `NOT STARTED` | — | L-15 · Q-01 | yes | 2026-08-04 |
| Q-03 | Crash monitoring / pre-launch report / device matrix | Ops | eng | `NOT STARTED` | Native crash SDK not wired; web Sentry still Home blocker | R-05 | yes | 2026-08-04 |
| Q-04 | LC-01…LC-14 production proofs (API/web shared) | [[01_PRODUCT/Product]] | eng + founder | `NOT STARTED` | Home still lists LC checklist open | prod access | yes | 2026-08-04 |
| Q-05 | Delete/export E2E proof | LC-13 · Play | eng | `NOT STARTED` | — | P-07 | yes | 2026-08-04 |
| Q-06 | Backup/restore evidence | LC-03 | eng | `NOT STARTED` | — | ops | yes | 2026-08-04 |
| Q-07 | Support channel live | Listing | founder | `NOT STARTED` | `support@aiimin.in` named | mailbox | yes | 2026-08-04 |
| Q-08 | Staged production rollout + halt criteria | Mandate | founder + eng | `NOT STARTED` | Plan: % rollout; halt on crashes / policy / data integrity | `RELEASE READY` | yes | 2026-08-04 |
| Q-09 | Rollback plan (previous Play release) | Ops | eng | `NOT STARTED` | — | first production version | no (pre-first) | 2026-08-04 |

---

## Founder action queue (release chat will not invent these)

| # | Action | Unblocks |
|---|--------|----------|
| 1 | Registered legal entity name + type | G-01 G-02 G-12 |
| 2 | Publishable postal address | G-03 |
| 3 | Prove mailboxes: support / privacy / security / grievance | G-04 G-05 Q-07 |
| 4 | GSTIN if applicable | G-07 L-10 |
| 5 | Indian counsel review booking | G-12 → `READY FOR COUNSEL` |
| 6 | Play developer account + verification | L-01… |
| 7 | Decide native billing: Play Billing vs web-only entitlement | L-10 |
| 8 | Confirm closed-test rule shown in **your** Console | L-15 |
| 9 | Upload-keystore backup confirmation (location only — **never paste password in chat/vault**) | S-03 S-04 |

---

## Eng action queue (this release chat — no APK craft)

| # | Action | Status |
|---|--------|--------|
| 1 | Maintain this ledger against code + Legal Pack | `IN PROGRESS` |
| 2 | Remove or redirect stale `frontend/public/privacy.html` | `IN PROGRESS` — redirect stub written; awaiting deploy proof |
| 3 | Browser-verify deployed legal page **content** (not just SPA 200) after next web deploy | `NOT STARTED` |
| 4 | When product chat ships a permission or data type: update Legal Pack §10 + this ledger same unit | standing |
| 5 | Draft Data safety answers **only** when release binary scopes freeze — never early | blocked on S-02 |
| 6 | Listing copy draft from shipped surfaces only | blocked on product bar |
| 7 | Store screenshot shot list from Compose screens (post device) | blocked on device |

---

## Product-chat interface (do not steal their queue)

| Signal from product chat | Release-chat response |
|--------------------------|----------------------|
| Screen ✅ + commit | Re-scan manifest / claims; patch ledger rows |
| New permission PR | Block merge until R-* + G-15 + L-03 parity plan exists |
| “Ready for release AAB” | Run S-02…S-08 checklist; still no Console lies |
| Asks Play questions | Answer from this ledger + Legal Pack |

---

## Changelog

### 2026-08-04 — Stale privacy.html neutralized
- **What:** Replaced standalone conflicting `frontend/public/privacy.html` (old May 25 copy, purple styling) with redirect stub to SPA `/privacy`.
- **Why:** Legal Pack §12 #19 — duplicate policy URL risks Play/policy mismatch.
- **Files:** `frontend/public/privacy.html`
- **Status:** partial — needs production deploy proof
- **Notes:** Ledger row G-14 → `IN PROGRESS`

### 2026-08-04 — Ledger created
- **What:** First living Play Store launch ledger (checklist rows, evidence-backed statuses). No Console submission. No invented legal entity fields.
- **Why:** Founder mandate — release-readiness queue separate from product/APK chat.
- **Files:** `docs/knowledge/17_NATIVE_APP_V2/Play-Store-Launch.md`
- **Status:** partial — overall `BUILDING`
- **Notes:** Money commit `d7721af3` exists; product bar still local-state. Live legal URLs return SPA 200; content deploy parity unverified in browser.
