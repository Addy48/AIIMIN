# 03 — Interaction Principles Governance Index

```yaml
document: Interaction Principles Governance Index
phase: P7
twin_json: 02_GOVERNANCE_DECISIONS.json
twin_report: 01_GOVERNANCE_REPORT.md
```

## Canonical Decisions (new)

| GOV ID | Title | Category | Status | Confidence | Cost | Depends On | Source |
|--------|-------|----------|--------|------------|------|------------|--------|
| GOV-122 | One obvious primary action per view | UX — Primary Action | Approved | High | Medium | GOV-062, GOV-029, GOV-106 | IX-1 — One obvious primary action |
| GOV-123 | Reduce decisions — defer choice; infer with correction before asking | UX — Decision Reduction | Approved | High | High | GOV-032, GOV-074, GOV-035, GOV-051, GOV-080 | IX-3 — Reduce decisions |
| GOV-124 | Context before controls — orient before toolbars | UX — Orientation | Approved | High | Medium | GOV-028, GOV-100, GOV-029, GOV-109 | IX-5 — Context before controls |
| GOV-125 | Optimistic where safe; branded confirm where destructive | UX — Commit Strategy | Approved | High | Medium | GOV-015, GOV-065, GOV-046, GOV-077, GOV-089 | IX-12 — Optimistic where safe; confirm where destructive |
| GOV-126 | Infer then chip — correction chips are first-class UI | UX — AI Correction | Approved | High | High | GOV-035, GOV-051, GOV-047, GOV-052, GOV-123 | IX-13 — Infer, then chip |
| GOV-127 | Capture beats navigation — Palette/Logger outrank deep-link tourism | UX — Capture Priority | Needs Discussion | High | High | GOV-028, GOV-059, GOV-066, GOV-099, GOV-095 | IX-14 — Capture beats navigation |
| GOV-128 | Undo over fear — recoverable mistakes get undo; unrecoverable get confirm | UX — Error Recovery | Approved | High | High | GOV-125, GOV-015, GOV-065, GOV-030 | IX-16 — Undo over fear |
| GOV-129 | Shortcuts are progressive enhancement — never the only essential path | UX — Keyboard / Shortcuts | Approved | High | Medium | GOV-066, GOV-127, GOV-056, GOV-099 | IX-17 — Shortcuts are progressive enhancement |
| GOV-130 | Forms are a last resort — NL + chips + progressive fields default | UX — Capture Forms | Approved | High | High | GOV-008, GOV-047, GOV-126, GOV-123, GOV-032 | IX-18 — Forms are a last resort |
| GOV-131 | Consistency of verbs — same action, same verb across surfaces | UX — Verb Consistency | Approved | High | Medium | GOV-040, GOV-062 | IX-20 — Consistency of verbs |
| GOV-132 | Latency honesty — skeleton for waits; never fake instant if pending | UX — Latency Honesty | Approved | High | Medium | GOV-089, GOV-121, GOV-077, GOV-125 | IX-21 — Latency honesty |
| GOV-133 | Accessibility is interaction quality — not a later audit | Accessibility — Interaction Quality | Approved | High | High | GOV-056, GOV-071, GOV-129, GOV-072 | IX-22 — Accessibility is interaction quality |
| GOV-134 | Device-appropriate gestures — platform conventions win | UX — Gestures | Approved | High | Medium | GOV-040, GOV-085, GOV-013, GOV-041, GOV-118 | IX-23 — Device-appropriate gestures |
| GOV-135 | Compression is continuous — estimate interaction delta; net-positive count fails | UX — Interaction Compression | Needs Discussion | High | High | GOV-034, GOV-060, GOV-062, GOV-093 | IX-25 — Compression is continuous; Reasoning |

## Existing GOV referenced (no new ID)

| IX item | Existing GOV | Note |
|---------|--------------|------|
| IX-2 (never surprise — silent wrong / confirm / feedback) | GOV-035, GOV-051, GOV-015, GOV-065, GOV-046, GOV-077 | Correctable inference + destructive confirm + mandatory feedback already canon — no re-mint for ambush core |
| IX-4 (progressive disclosure) | GOV-032 | Progressive disclosure by stakes already Constitution canon |
| IX-6 (intelligence without interruption) | GOV-033, GOV-088, GOV-048 | Interruptibility + no mid-Focus coaching + confidence bands — bands still Needs Discussion |
| IX-7 (justify fidelity/speed/trust/clarity) | GOV-062 | Identical Non-Negotiable — no re-mint |
| IX-8 (animation communicates) | GOV-063, GOV-112 | Motion meaning + purpose allowlist already governed |
| IX-9 (notification deserve attention) | GOV-064 | Already NN; still Needs Discussion — no re-mint |
| IX-10 (purpose / anti-clutter widgets) | GOV-076, GOV-062 | Today anti-clutter + justify interaction cover decorative/placeholder debt |
| IX-11 (Enter to save) | GOV-066 | Ceremony-free Enter/primary save already NN |
| IX-15 (feedback mandatory) | GOV-077, GOV-089 | No interaction without feedback + sync honesty |
| IX-19 (empty states teach) | GOV-067 | Every empty state must teach already NN |
| IX-24 (no duplicate navigation) | GOV-075, GOV-097 | Already NN Needs Discussion; free-pin model in IA — no re-mint |
| IX-3 Kill List clause | GOV-074 | Kill List consult already NN — reduce-decisions elevated separately |
| IX-25 compression craft anchor | GOV-034, GOV-060 | ~5 interactions craft + economy as performance — continuous delta elevated separately |
| Capture / AI structure anchors | GOV-028, GOV-047, GOV-052, GOV-059, GOV-008 | Capture-first / NL intent / structure later / speed / anti-form-builder |
| Command palette / intents | GOV-099, GOV-095, GOV-027 | Palette first-class IA + intents + intent-over-interface — still open ND on 099/095 |
| Settings / context | GOV-100 | Settings penalty box supports context-before-controls |

## Governance Recommendations (NOT CANON)

| REC ID | Title | Priority | Status | Related GOV |
|--------|-------|----------|--------|-------------|
| REC-048 | Ratify Approved Interaction GOVs (122–126, 128–134) as citeable interaction canon | P0 | Pending Founder | GOV-122, GOV-123, GOV-124, GOV-125, GOV-126… |
| REC-049 | Publish Chip UX Spec — correction patterns + anti-fatigue limits | P0 | Pending Founder | GOV-126, GOV-123, GOV-035 |
| REC-050 | Teach desktop shortcuts; document chord map; keep visible primary paths | P1 | Pending Founder | GOV-129, GOV-099, GOV-066 |
| REC-051 | Founder align GOV-127 capture-beats-nav with GOV-099 palette scope + GOV-095 intents | P0 | Pending Founder | GOV-127, GOV-099, GOV-095, GOV-075 |
| REC-052 | Add Interaction QA gates: primary action, context-before-controls, undo/confirm class, latency honesty, gesture platform-fit | P0 | Pending Founder | GOV-122, GOV-124, GOV-125, GOV-128, GOV-132… |
| REC-053 | Founder resolve GOV-135 × GOV-060 — interaction delta accounting as performance/economy | P0 | Pending Founder | GOV-135, GOV-060, GOV-034 |
| REC-054 | Next P7 artifact: 11_ACCESSIBILITY_PRINCIPLES or 13_NAMING_LANGUAGE or 10_COMPONENT_PRINCIPLES | P0 | Pending Founder | GOV-131, GOV-133, GOV-134, GOV-073 |

## Quick filters

### Needs Discussion

- GOV-127 — Capture beats navigation — Palette/Logger outrank deep-link tourism
- GOV-135 — Compression is continuous — estimate interaction delta; net-positive count fails

### High cost

- GOV-123 — Reduce decisions — defer choice; infer with correction before asking
- GOV-126 — Infer then chip — correction chips are first-class UI
- GOV-127 — Capture beats navigation — Palette/Logger outrank deep-link tourism
- GOV-128 — Undo over fear — recoverable mistakes get undo; unrecoverable get confirm
- GOV-130 — Forms are a last resort — NL + chips + progressive fields default
- GOV-133 — Accessibility is interaction quality — not a later audit
- GOV-135 — Compression is continuous — estimate interaction delta; net-positive count fails

### Conflicts

- CF-IX-001 — Known risk — chip fatigue
- CF-IX-002 — Known risk — over-compression removes safety asks
- CF-IX-003 — Known risk — shortcuts never taught
- CF-IX-004 — Dependency on open ND — navigation primacy
- CF-IX-005 — Complementary ND — notifications
- CF-IX-006 — Extract gap — selection / multi-select / search detail / focus management
- CF-IX-007 — Complementary ND — compression economy
