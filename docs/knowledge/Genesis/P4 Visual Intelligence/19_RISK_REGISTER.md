---
Purpose: Register visual identity risks — likelihood, impact, evidence, mitigation direction (not redesign).
Confidence: 0.89
Evidence Sources: Token conflicts; page identity; slop analysis; native gaps; product locks
Files Used: tokens.css; themes.js; 08_PAGE_IDENTITY.md; 14_AI_SLOP_ANALYSIS.md; Theme.kt; product locks
Reasoning: Risks prevent silent identity erosion as team/agents scale.
Dependencies: 14, 15, 17
Consumers: Founders, tech leads, design leads
Known Unknowns: Production FOUC frequency not measured
Last Updated: 2026-07-22
Pass: 4/6
---

# 19 — Risk Register

| ID | Risk | Likelihood | Impact | Evidence | Mitigation direction |
|----|------|------------|--------|----------|----------------------|
| V-01 | `:root` forest-green / Vercel tokens leak | High | Critical | tokens.css `:root` `#22C55E` | Make `:root` = aiimin tokens; demote vercel |
| V-02 | Inter remains body identity | High | High | `--font-sans: Inter` | Point sans to Figtree; remove Inter import |
| V-03 | Dark base hex drift (`#1a1a1a` vs `#14171A` vs `#0A0A0A`) | High | Medium | Palette vs themes vs :root | Single canonical + aliases |
| V-04 | Utility pages logo-off unrecognizable | High | High | Page scores ≤2 | Structural signatures per route |
| V-05 | Purple decorative accents spread | Medium | High | Settings/Finance/growth | Ban in consistency rules; lint |
| V-06 | Glass card sameness | High | Medium | ~45 backdrop-filter files | Prefer border cards on dense lists |
| V-07 | Native secondary = Material sample | High | Medium | Vault/Goals/Settings | Aiimin button/card enforcement |
| V-08 | Design Lab kits paste into prod | Medium | High | kokonutui purple | Quarantine + PR checklist |
| V-09 | Motion vocabulary fragmentation | Medium | Medium | 85 Framer vs 4 presets | Centralize presets |
| V-10 | BrandLockup unified by mistake | Low | Critical | Product lock | Rule + review |
| V-11 | `/m` gains analytics chrome | Low | Critical | Product lock | Rule + review |
| V-12 | Green logo concepts revived as brand | Low | Critical | logo-designs/ | Archive labeling |
| V-13 | Light mode cool-gray regression | Medium | Medium | DESIGN.md `#f9f9f9` vs ivory | Align DESIGN.md to Palette ivory |
| V-14 | Dead CSS/components confuse agents | Medium | Low | family.css unused; ArchBracketMark.kt unused | Delete or wire |
| V-15 | Illustration gap filled with mascots | Medium | Medium | No illo system | Editorial empty states |
| V-16 | Report visual quality never reaches product | Medium | Medium | prototypes/reports orphaned | Lineage plan P3 |
| V-17 | Accessibility long-tail (inline type) | Medium | Medium | Typography.md | Tokenize remaining |
| V-18 | Agents optimize for trends | High | High | Genesis future growth | This package + rules 17 |

## Top 3 to kill first

1. **V-01** token `:root`  
2. **V-02** Inter body  
3. **V-04** page chassis sameness (via structural cues, not decoration)

## Risk posture

Identity **intent** is strong. Identity **enforcement** is weak. Without P0 token/type hygiene, more screens will make AIIMIN *less* recognizable over time.
