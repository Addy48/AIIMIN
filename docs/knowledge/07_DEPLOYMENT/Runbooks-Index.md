---
authority: engineering
derived_from: 07_DEPLOYMENT/Deploy · repository documentation audit
status: active
owner: ops
lifecycle: living
last_reviewed: 2026-07-30
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: index
note_type: NT-DOC
tags:
  - type/runbook
  - domain/deployment
  - status/active
---

# Deployment runbooks

Deployment procedures remain beside the scripts they operate in `deploy/`. This Vault index classifies them without duplicating commands or secret-handling instructions.

## Current operations

- [GitHub Actions](../../../deploy/GITHUB-ACTIONS.md)
- [EC2 setup](../../../deploy/EC2-SETUP-STEPS.md)
- [Observability setup](../../../deploy/OBSERVABILITY-SETUP.md)
- [Email setup](../../../deploy/EMAIL-SETUP.md)
- [Resend setup](../../../deploy/RESEND-SETUP.md)
- [Post-SES steps](../../../deploy/POST-SES-STEPS.md)
- [Launch plan](../../../deploy/LAUNCH-PLAN.md)
- [Supabase Google auth](../../../deploy/SUPABASE-GOOGLE-AUTH.md)

## Historical alternative

- [Cognito setup](../../../deploy/COGNITO-SETUP.md) — retained as Option A history. Better Auth is the current authentication system; do not execute this runbook without an accepted architecture decision.

## Planning references

- [[07_DEPLOYMENT/AWS_MIGRATION_MASTER_PLAN]]
- [[07_DEPLOYMENT/AWS_SETUP]]

Values for API keys, passwords, connection strings, certificates, and host credentials stay in local or hosted secret stores. The Vault records environment-variable names only.
