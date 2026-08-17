---
Purpose: Enforceable consistency rules for future designers and AI agents building AIIMIN UI.
Confidence: 0.92
Evidence Sources: Product locks; Palette; DESIGN.md; Brand DNA; AI slop findings
Files Used: .cursor/rules/aiimin-product-locks.mdc; Palette.md; DESIGN.md; 02_BRAND_DNA.md; 14_AI_SLOP_ANALYSIS.md
Reasoning: Rules must be checkable in PR review without taste debates.
Dependencies: 02, 12, 16
Consumers: PR review, agents, design QA
Known Unknowns: Automated lint for visual rules not yet built
Last Updated: 2026-07-22
Pass: 4/6
---

# 17 — Future Consistency Rules

## Hard locks (never break without founder ask)

1. **Palette lock** — no new brand colors  
2. **BrandLockup split** — mark → `/brand`; wordmark → `/overview`  
3. **`/m` capture-only** — no analytics/tools chrome  
4. **No purple AI OAuth/marketing chrome** as product identity  
5. **Auth/schema** unchanged without explicit ask (visual work must not sneak schema)

## Color rules

- CTAs/selection/focus use `#ff6b35` or calm `#E85A24`  
- Completion/done use `#10b981` (or documented light forest success)  
- Do not set primary accent to green, cyan, purple, or black  
- Do not add `--color-card-purple` usage in new product UI  
- New work targets `aiimin-dark` / `aiimin-light` only — no new `data-theme` brands

## Typography rules

- Body/UI: Figtree  
- Display/ritual: Familjen Grotesk  
- Wordmark: Bodoni Moda only  
- Scores/money/timers/IDs: JetBrains Mono  
- Do not introduce Inter/Playfair/Jost as new defaults  
- Journal prose serif only on read/write canvas measure ~62–70ch

## Layout rules

- Prefer 1px borders over heavy drop shadows on dense lists  
- Max 2–3 intentional motions per surface  
- No hover-lift carnivals on dense card grids  
- Each new primary route needs one structural signature (document in vault)  
- Phone web cannot gain desktop analytics density

## Component rules

- Chips/pills: 999 radius + 1px border  
- Touch: ≥44px / 48dp targets on touch tiers  
- Reuse Aiimin primary button patterns on native — avoid stock M3 buttons for primary CTA  
- Quarantine kokonutui / third-party visual kits from production routes

## Motion rules

- Prefer `motionPresets` / documented duration tokens  
- Honor `prefers-reduced-motion`  
- Celebrations rare; never every habit tick

## Icon rules

- Lucide (web) / Material Icons (native) for UI  
- Arch Bracket only for brand moments  
- Ember dot exclusive to mark

## Documentation rules

- Visual/behavior change → vault MOC/changelog same unit of work  
- Do not document secrets  
- Update Current-Context when focus shifts

## PR checklist (visual)

```
[ ] Logo-off: still reads AIIMIN via color/type/structure?
[ ] No new brand hex?
[ ] No purple decorative accent?
[ ] Figtree/Familjen/Bodoni/JetBrains roles respected?
[ ] /m still capture-only if touched?
[ ] BrandLockup split intact?
[ ] Motion ≤2–3 / surface; reduced-motion OK?
[ ] Vault note updated if behavior/visual contract changed?
```
