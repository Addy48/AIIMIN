# 09 — Android Mapping

## Native today → Studio IA

| Studio | Native Compose (current) | Action |
|--------|--------------------------|--------|
| Today | `HomeScreen.kt` | Evolve home ritual toward Living Day (pulse + habits + nudge) |
| Knowledge | `JournalScreen` + `NotesScreen` | Unify under Knowledge tabs in IA; keep separate routes OK |
| Timeline | (gap) | New destination — chronological graph |
| Family / Documents | `VaultScreen` | Split docs vs family care; shared vault PIN |
| Finance | (lite / more) | Elevate from More into first-class |
| AI | (gap / lab) | Mixed-initiative coach surface |
| Capture FAB | Missing as global | Add; route outbox entities |
| Settings / Profile | `SettingsScreen` | Align rows |
| Auth | `AuthScreen`, `WelcomeGate`, `BiometricGate` | Keep; simplify onboarding beats |

## Bottom nav proposal

Native now: Home / Journal / Notes / Vault / More.  
Studio: Today / Knowledge / FAB / Timeline / More.

**Migration:** Journal+Notes → Knowledge; add Timeline; Vault items under More + Documents/Family.

## Motion

Map CSS `--t2` to Compose `tween(220, FastOutSlowInEasing)` equivalents; reduce motion via Accessibility Manager.

## Do not

Ship Tasks/Projects primary tabs on Android — violates Living Momentum.
