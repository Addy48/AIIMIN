# 13 — Product Principles

## Non-negotiable principles

### Product

1. **Capture beats configuration** — If a choice can wait, it waits.
2. **One utterance, many tables** — Command Palette routes; user does not pick destination first.
3. **Infer, then chip** — Never silent wrong data without correction path.
4. **Mobile captures; desktop commands** — No analytics/tools on mobile `/m`.
5. **Life Score is honest** — Composite reflects real pillars; not vanity XP.

### Design

6. **Palette locked** — Dark `#1a1a1a`, cards `#2d2d2d`, accent `#ff6b35`, done `#10b981`.
7. **One mood primitive** — No fifth mood picker.
8. **Destructive actions confirm** — Branded ConfirmDialog; typed confirm for account delete.
9. **Enter to save** — Inline capture flows default to keyboard submit.
10. **Empty states teach** — Show chord shortcuts, not generic "no data."

### AI

11. **No clinical claims** — Coaching language only.
12. **Journal encrypted** — Body never in analytics events.
13. **Confidence-gated automation** — See [[07_AUTOMATION_RULES]].
14. **Interruptibility respected** — No modals during Focus.
15. **User can export and delete** — Data portability is trust.

### Engineering / process

16. **Vault ships with code** — Behavior changes documented before done.
17. **No auth/schema without explicit ask** — Product intelligence does not imply migrations.
18. **No secrets in vault** — Env names only.
19. **Telemetry privacy-first** — Hash PII; never log PIN.
20. **Sparring welcome** — Challenge weak features; kill list is feature.

## Principle conflicts

| Conflict | Resolution |
|----------|------------|
| Speed vs accuracy (finance category) | Chip confirm default |
| Gamification vs sincerity | XP for action; Life Score for truth |
| Power users vs beginners | Palette + defaults coexist |
| Passive sensing vs privacy | Opt-in HealthKit; on-device prefer |

## Related

- [[02_PHILOSOPHY]]
- [[15_THINGS_NEVER_TO_BUILD]]
- `docs/knowledge/08_DESIGN/Palette.md`
