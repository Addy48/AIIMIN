# 15 — Things Never to Build

## Anti-patterns and feature traps

These are explicit **do-not-build** items derived from audit friction, kill list, research ethics, and product locks.

---

### Interaction anti-patterns

| Never build | Why |
|-------------|-----|
| **Another mood picker** | 5 exist; unify instead |
| **Another theme picker surface** | 3 exist; OS sync |
| **Another life arc editor** | 3 exist; single source |
| **Journal mode gate before capture** | Kills vent intent; INT-166 |
| **Required title on quick notes** | Notes title → Kill |
| **Priority dropdown on goals** | Kill; infer behavior |
| **6-field finance as only path** | Compression P0 |
| **14-module Lab launcher as only entry** | Choice overload INT-432 |
| **Onboarding step 6 wake time** | Low signal; Kill |
| **Category dropdown when NLP works** | Finance, habits, feedback |

---

### Product traps

| Trap | Why avoid |
|------|-----------|
| **Social feed** | Not a network; dilutes Life OS |
| **Public leaderboards** | Privacy + comparison anxiety |
| **AI therapist persona** | Clinical liability; not our scope |
| **Automatic posting** | User must own every write |
| **Dark patterns on upgrade** | Tier gate exists; don't nag loop |
| **Infinite customization** | Persona presets enough; infer rest |
| **Mobile analytics dashboard** | Violates `/m` capture-only lock |
| **New brand colors** | Palette locked |
| **Feature flags users see** | Dev/admin only |
| **Protein input on mobile** | Explicitly removed per Daily Log rules |

---

### Data / AI traps

| Trap | Why avoid |
|------|-----------|
| **Infer emergency meds/allergies** | Safety — always ask |
| **Journal body in analytics** | Privacy violation |
| **PIN in telemetry** | Security violation |
| **Diagnostic mental health labels** | Digital phenotyping ethics |
| **Auto-create finance tx without utterance** | User must initiate money |
| **Sell or share lifelog data** | Trust destroyer |
| **Schema change for intelligence** | Intelligence adapts to schema; not vice versa without ask |

---

### Engineering traps

| Trap | Why avoid |
|------|-----------|
| **Whole-repo scan as "research"** | Vault Brain OS exists |
| **Fat AGENTS.md** | Vault is brain |
| **Secrets in vault docs** | Security |
| **Ship docs after code** | Violates Brain OS |
| **window.confirm** | 14 remain; migrate to ConfirmDialog |

---

### "Looks productive but isn't"

| Trap | Real need |
|------|-----------|
| More dashboard widgets | Morning briefing one card |
| More journal modes | AI tags post-capture |
| More onboarding questions | Infer from behavior |
| More gamification badges | Coordinate XP + Life Score |
| More filter dropdowns | AI pre-filter Insights |
| Separate mobile app routes | Responsive capture suffices |

---

## When someone proposes X, ask:

1. Is it in the Kill List?
2. Does it duplicate an existing primitive?
3. Does it increase daily interactions?
4. Does mobile stay capture-only?
5. Can AI infer it instead?

If any answer is wrong → don't build.

## Related

- [[../product-intelligence/things_aiimin_should_stop_asking]]
- [[13_PRODUCT_PRINCIPLES]]
- [[03_HUMAN_PROBLEMS]]
