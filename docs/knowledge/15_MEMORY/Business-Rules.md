---
authority: operations
derived_from: Genesis
status: active
owner: eng
lifecycle: living
last_reviewed: 2026-07-25
can_override_genesis: false
knowledge_layer: KL-OPS
graph_role: leaf
note_type: NT-DOC
migration_batch: W4
fm_source: script
---
# Business Rules

> Caveman pack. Non-negotiable product rules.

## Product

- Mobile `/m` = data capture only. No analytics, insights, pomodoro, tools.
- Desktop `/` = full OS.
- Waitlist public pricing: Explore free, Core ₹29, Pro ₹59 (founding ₹49), Elite ₹99 (founding ₹79).
- Waitlist get complimentary Core at launch; Pro/Elite founding discounts 12 months.
- Tester emails (`TESTER_EMAILS` / allowlist) get Elite + full app access.
- Dev emails (`DEV_EMAILS`) full access.
- Public sign-in without allowlist → pending screen when waitlist on.

## Engineering

- Palette locked — [[08_DESIGN/Palette]]
- No secrets in vault or commits
- Schema/auth changes need explicit user instruction
- Vault update required for any behavior/contract change
- Prefer reading vault over scanning whole repo

## Data

- Sensitive data: backend/DB only. No localStorage for secrets.
- `demo-user-id` legacy placeholder — prefer real auth user id

## Launch

- Go-live target end Sep 2026
- Founding / tester registration closes **31 August 2026**
- LC checklist in Product / Home blockers
- Priorities: [[Roadmap/Operational-Priorities]]
