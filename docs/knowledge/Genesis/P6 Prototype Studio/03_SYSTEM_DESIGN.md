# 03 — System Design

## Navigation

```text
[Splash] → [Onboarding ×3] → [Auth] → App Shell
                                      ├─ Today
                                      ├─ Knowledge
                                      ├─ Timeline
                                      ├─ More → Family | Finance | Documents | AI | Search | Settings | Profile
                                      └─ FAB Capture Sheet (global)
```

Android bottom bar: 4 destinations + center FAB. Drawer optional for power jump list.

## Page hierarchy

1. **System** — Splash, Onboarding, Auth  
2. **Day** — Today  
3. **Memory** — Knowledge, Timeline, Search  
4. **Pillars** — Family, Finance, Documents  
5. **Intelligence** — AI  
6. **Account** — Profile, Settings  

## Feature grouping

| Group | Features |
|-------|----------|
| Day ops | Habits, focus block, daily pulse, AI nudge |
| Memory | Journal entries, notes, tags (AI after) |
| Money | Quick spend, category chip, week pulse |
| Trust | Family members, shared tasks, vault PIN |
| Files | Documents list, upload affordance |
| Meta | Theme, notifications, export, sign out |

## Interaction language

| Verb | UI |
|------|----|
| Capture | FAB / capture field / Enter |
| Confirm | Chip or soft button |
| Complete | Check circle → done green |
| Open | Row press → push or expand |
| Escape | Scrim / back / swipe down sheet |
| Switch theme | Settings toggle + viewer toggle |

## Component behavior (system-level)

- **Rows:** 56–64px touch; leading glyph; title + meta; trailing chevron or value  
- **Cards:** Only when grouping interactive clusters or hero pulse  
- **Chips:** Pill; selected = accent soft fill + accent text  
- **FAB:** Accent fill; elevates sheet  
- **Sheets:** Grabber; springless ease-out; 40%–90% height  
- **Toasts:** Ephemeral confirmation above nav  

## Motion language

| Token | Value |
|-------|-------|
| `--t1` | 120ms micro |
| `--t2` | 220ms UI |
| `--t3` | 340ms sheet/nav |
| Ease | `cubic-bezier(.16,1,.3,1)` |
| Properties | opacity, transform only |
| Reduced motion | Instant / crossfade only |

## Typography system

| Role | Family | Size / weight |
|------|--------|---------------|
| Brand / hero | Familjen Grotesk | 28–34 / 700 |
| Page title | Familjen Grotesk | 26 / 700 |
| Section | Figtree | 13 / 700 uppercase tracking |
| Body | Figtree | 15 / 500 |
| Meta | Figtree | 12–13 / 500 muted |
| Data | Figtree / tabular | 15–22 / 600 |

## Spacing system

4px base: 4, 8, 12, 16, 20, 24, 32, 40. Screen padding 20px. Section gap 22–28px.

## Color semantics

| Token | Meaning |
|-------|---------|
| Accent orange | Action, selection, FAB |
| Done green | Completion, sync OK |
| Muted gray | Incomplete, secondary |
| Rose (support) | Destructive / alert (not brand) |
| Blue/violet/amber soft | Category tint only, ≤10% surface |

## Illustration / icon strategy

- Icons: consistent 24 viewBox stroke set  
- No illustration library dependency  
- Brand mark: rounded square gradient orange with “A” / arch metaphor  
- Empty states: one line + one CTA, no mascot circus
