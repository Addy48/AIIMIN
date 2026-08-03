---
authority: operations
derived_from: Genesis
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-08-03
can_override_genesis: false
knowledge_layer: KL-META
graph_role: hub
note_type: NT-GUIDE
tags:
  - type/guide
  - status/living
---

# Start here

> Written for **you**, not for an agent. Plain language, links into the detail.
> Agents should use [[00_ROUTING]] instead.

## What AIIMIN is

A Personal Life OS. One place where your day, money, mind and discipline are captured once
and read back as truth. Live at **aiimin.in**.

The doctrine, from [[Maps of Content/Genesis|Genesis]]: **Today is capture-first.** You open
it to *act*, not to read a dashboard. There is deliberately **no Dashboard surface** — that
was refused (GOV-165). Every surface must declare exactly one job.

## The five guides

| Guide | Answers |
|-------|---------|
| **[[Guides/How-It-Works]]** | How do I log in, how is my data kept private, how is the Life Score calculated |
| **[[Guides/Decisions-And-Why]]** | What is locked, and what was the reasoning |
| **[[Guides/Whats-Broken-Right-Now]]** | What is genuinely broken, what is merely untested |
| **[[Guides/Where-Everything-Lives]]** | Which folder holds what, in the repo and in this vault |
| **[[Guides/The-App-Build]]** | The native Android app — where it is, what's next |

## The three clients

| Client | What it is | State |
|--------|-----------|-------|
| **Web Life OS** — `frontend/` | The full drawing. Deep analytics, Reports, Lab. | live at aiimin.in |
| **Capacitor `/m`** — `frontend/android/` | Phone web shell, capture only. | live, limited |
| **Native Android V3** — `native-android-v3/` | Kotlin + Compose, built from scratch. | **being built now** |

`native-android/` (V2) is the **old app**. Reference only — never copy its UI.

## What's happening right now

Always current: **[[15_MEMORY/Current-Context]]**
Full status of everything: **[[17_NATIVE_APP_V2/AIIMIN_MASTER_STATUS_AND_NEXT_STAGE]]**

## How this vault works

`Reference/` is a **symlink to the repo's `docs/knowledge/`** — it is not a copy. There is
exactly one version of every note, under git. Editing a note here edits the repo.

`My Notes/` is **yours**. Nothing generated ever writes there, and it lives outside the
repository, so nothing you write can reach the public GitHub repo.

`00-Home.md` and this guide set are regenerated automatically at the end of any session that
changes the vault.

## The rules that don't bend

1. Data goes through `/api/*` with the session cookie. Never direct PostgREST, never a
   client-supplied user id.
2. Genesis (`Genesis/`) is constitutional and immutable. Never edit it.
3. The Drafting Table palette and typography are locked. Craft is open.
4. Nobody types your PIN but you.
5. Evidence before claims — nothing is "done" without real output.
