---
Purpose: Scored visual health across dimensions with evidence-backed rationale.
Confidence: 0.87
Evidence Sources: Entire package synthesis; page identity scores; token conflicts; native/web gap
Files Used: 00–17 synthesis
Reasoning: Scores force honesty — high intent ≠ high shipped consistency.
Dependencies: All prior
Consumers: Leadership, sprint prioritization
Known Unknowns: Scores are expert judgment, not user research
Last Updated: 2026-07-22
Pass: 4/6
---

# 18 — Visual Scorecard

Scale: 1–10. **Intent** = documented/desired. **Shipped** = code/prod surfaces.

| Dimension | Intent | Shipped | Delta | Rationale |
|-----------|--------|---------|-------|-----------|
| Brand DNA clarity | 9 | 6 | -3 | Human Momentum clear in docs/brand; diluted in OS pages |
| Logo-off recognition | 8 | 5 | -3 | Strong on brand/auth/studios; weak on utility pages |
| Color semantics | 9 | 7 | -2 | Orange/green good when theme on; purple + :root green hurt |
| Token hygiene | 8 | 3 | -5 | Multiple conflicting sources |
| Typography system | 8 | 5 | -3 | Intent Figtree; ships Inter/Playfair mix |
| Spacing system | 7 | 5 | -2 | Tokens exist; inline magic common |
| Layout language | 8 | 6 | -2 | Device split strong; page chassis sameness |
| Component character | 7 | 5 | -2 | Few branded atoms; many generic |
| Page identity | 8 | 4 | -4 | Minority of pages distinctive |
| Iconography | 6 | 5 | -1 | Consistent Lucide; not distinctive |
| Illustration | 5 | 3 | -2 | Atmosphere yes; system no |
| Motion language | 8 | 6 | -2 | Good doctrine; fragmented implementation |
| Elevation discipline | 8 | 5 | -3 | DESIGN.md borders; glass cards common |
| Accessibility posture | 8 | 6 | -2 | Contrast locks exist; long-tail gaps |
| Native↔Web coherence | 8 | 6 | -2 | Palette aligned; type/radius diverge |
| Anti-slop resistance | 9 | 4 | -5 | Docs strong; code leaks |
| **Overall** | **8.0** | **5.2** | **-2.8** | Identity known; not yet enforced |

## Competitor distinctiveness (shipped)

| vs | Distinctiveness /10 |
|----|---------------------|
| Notion | 6 |
| Linear | 5 |
| Todoist/ClickUp | 6 |
| Vercel dashboard | 4 (legacy tokens) |
| Apple HIG | 5 |
| Generic Material | 5 |
| Purple AI SaaS | 7 (when canonical) |

## Target for “recognizable company”

Shipped overall **≥7.5** with token hygiene ≥8 and page identity ≥7.
