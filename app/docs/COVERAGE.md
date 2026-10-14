# AIIMIN native — coverage against AIIMIN_PLAN.md (v4.1, 148 surfaces)

Legend: ✅ built and opened on the emulator · 🟡 built, partial (what's missing is named) · ⬜ not built

Checked 13 Oct 2026: every route below opens without a crash (`--es aiimin_go <screen>` smoke over all
routes on the AiiminLean emulator, sample profile loaded). `./gradlew testDebugUnitTest` green: 95 tests, 0 failures
(engine 40 incl. Score Engine 3 vectors EV1–EV12, data 30, nlp, sensing, privacy, model, network, onboarding).

## Onboarding and access
| O1 Welcome (light logo) ✅ · O2–O7 ✅ · O8 Try your voice ✅ · O9 Keep it safe ✅ · O10 Ready ✅ · O-HC ✅ |
| AU1 / AU2 sign in, verify link ✅ · AU3 Bring your data here (Merge · **Replace this phone's data** · Keep separate) ✅ |
| Role page: shift workers set their roster (D/N/O) inline ✅ · LK1 App locked, with the owner's **emergency card** readable without unlocking ✅ |

## Today and planning
| T1 Today ✅ (Later today rows: time · title · tag, no checkbox; "Mark done" is a screen-reader action) · T2 ✅ · T3 ✅ · T4 ✅ · T5 ✅ · T6 Calendar **Day · Week · Month** ✅ · T7 ✅ · T8/T9 ✅ · T10 🟡 · T11 ✅ · T12 🟡 · T13 🟡 · T14 ✅ · T15 Goals ✅ (Room, synced) · T16 ✅ · T17 ✅ |

## Score, signals, body
| S1 ✅ · S2 ✅ · S3 ✅ · S4 ✅ · S5 Intention editor ✅ (live Easy/Stretch/Hard label, 60th-percentile suggestion, inline floor/ceiling message; today-only override ⬜) · S6 Custom signal ✅ (type, direction) · S7 ✅ · S8 ✅ · S9 App detail ✅ (today, 7-day average, Work/Personal) · S10 ✅ · S11 ✅ |
| **Score Engine 3** ✅ (rules 3.0.0): target-anchored points with personal stretch anchor, challenge factor, credit (doubt shrinks only good news), level with 7-day half-life, 3/5-point cap, exceptional-day clip, slump protection, momentum (form − base), range φ and conservative display, bands Good 60–71 · Strong 72–79 · Peak 80+. Streak's kept-day bar now uses only earlier days (no look-ahead). |

## Money
| M1 Home ✅ (accounts row with quiet-source dot and filter, Owed, Coming up, footer links) · M2 ✅ · M3 ✅ (+ Split with…) · M4 ✅ · M5 ✅ · M6 🟡 · M7 ✅ · M8 ✅ |
| M9 Accounts / M10 Account ✅ · M11 Splits / M12 Person balance ✅ (UPI pay link per NPCI, "Ask" share link, mark settled; never a collect request) · M13 Recurring and bills ✅ (detection: 3 steady hits, ±15%; AutoPay list; NT2 reminder) · M14 Export for CA ✅ (month, ledger, row count, CSV with account/time/note) · M15 ✅ · M16 Payee memory ✅ (label, category, ledger, always ask) |
| Payee names: "VPA pvrcinemas@ybl PVR Phoenix" → "PVR Phoenix", "swiggy8@ybl" → "Swiggy", bare numbers → "UPI ••4471" ✅ |

## Vault and family
| V1 ✅ · V2 ✅ · V3 Save document ✅ (title, category, expiry, duplicate → open old / remove copy) · V4 ✅ · V5 Scanner ✅ (ML Kit system flow → V3) · V6 ✅ · V7 🟡 · V8 ✅ · V9 ✅ · V10 ✅ · V11 🟡 · V12 ✅ · V13 🟡 · V14/V15 🟡 (server-wait request path) · V16 ✅ · V17 🟡 |
| VB1 Vault backups ✅ (folder you pick via the system picker, AES-256-GCM, key from passphrase via PBKDF2-HMAC-SHA256 600k — the platform has no Argon2id; newest 3 kept; restore; NT23 overdue reminder) |
| EK1 Emergency kit ✅ (encrypted `.aiimin` file for a trusted person, code shown once) · EK2 Printed sheet ✅ (PDF: code, how to open, emergency card; no QR yet) · Open a kit sent to you ✅ |

## Notes and journal
| N1 ✅ · N2 ✅ · N3 Link picker ✅ (opens on typing `[[`; notes, tasks, documents, people, payments; chips open the right item) · J1 ✅ (month mood strip; tag says plainly when journal sync is on) · J2 ✅ · J3 Mood year ✅ |

## Capture and assistant
| C1 ✅ · C2 🟡 (system speech dialog; no live transcript) · C3 ✅ · C4 Card editor ✅ (type change, fields re-map, re-speak) · C5 Recent captures ✅ (24 h, undo per capture) · A1–A3 ✅ · A4 🟡 |

## Global
| G1 ✅ · G2 ✅ · G3 ✅ · G4 Sync sheet ✅ · G5 Conflict review ✅ · G6 ✅ · G7 Trash ✅ (30 days, restore, delete, empty) |

## Me, plans, settings
| P1 Me ✅ · P2 Edit profile ✅ · P3 Plans ✅ (prices only from Google Play; "not on sale yet" state while products aren't published) · P3a Compare ✅ · P4 Checkout ✅ (Play Billing) · P5 Subscription ✅ · P6 Settings ✅ |
| SE1 Account ✅ · SE2 Linked devices ✅ (Better Auth sessions, remove) · SE3 🟡 · SE4 ✅ · SE5 🟡 · SE6 ✅ · SE7 Money ✅ · SE8 🟡 (backups and kits live under Vault) · SE9 ✅ · SE10 ✅ · SE11 Appearance ✅ (text size, motion, haptics; light only) · SE12 Language ✅ · SE13 Help ✅ · SE14 About ✅ |
| Sync settings page ✅: per-kind switches (tasks, calendar, notes, goals, minimums, payments, journal opt-in with consent sheet), Wi-Fi only, status, retry time, honest "plain text on aiimin.in, not end-to-end encrypted". |

## Sync (step 4)
Tasks, notes, payments, **calendar events, goals, minimums ↔ habits (with daily ticks), journal (opt-in, push only)**.
Three-way merge against a stored shadow; both-sides edits become G5 conflicts. First-time pairs are de-duplicated
(task title+day, note text, payment amount+day+payee, event title+start minute, goal/minimum name). Deletes go both
ways; the phone keeps them in Trash. Sign-out and "Delete my data on aiimin.in" unlink every item so another account
never reads the phone's items as deleted. Retry: per-run exponential backoff (30 s → 30 min) and a WorkManager job
with network constraint (Wi-Fi only if chosen). Room schema v2 (`remoteId` on events/minimums/journal, `goals`,
`sync_shadow`, `sync_conflicts`, `accounts`, `bills`, payee-rule label/always-ask, person UPI) via AutoMigration 1→2,
tested on a v1 database with data.

**Not yet tested against the live server:** `api.aiimin.in` resolves to 13.207.146.15, which serves a certificate
for another host (no aiimin.in service there). The local `.env` points at the production database, so a local
server was not started. Endpoints were matched to `server/routes/{tasks,calendar,goals,habits,journal,mobile}.js`.

## Known gaps
- C2 live transcript, S5 today-only override, V14/V15 server-wait access, EK2 QR code, SE3/SE5 detail pages.
- Dark theme intentionally not designed.
