---
Purpose: Aggressively identify AI-slop and forgettable visual patterns that erase AIIMIN identity.
Confidence: 0.90
Evidence Sources: tokens.css legacy; Inter default; purple accents; glass usage; card grids; kokonutui; Material defaults; competitor adjacency
Files Used: tokens.css; globals.css; Settings.jsx; FinanceOverview.jsx; kokonutui/*; StatCard.jsx; index.css card classes; Theme.kt secondary screens; Knowledge Context anti-looks
Reasoning: Forgettable patterns are the enemy of logo-off recognition.
Dependencies: 01, 03, 04, 07, 08
Consumers: Design review, PR visual checks, agents
Known Unknowns: Some Design Lab kits may never ship — still risk as copy-paste source
Last Updated: 2026-07-22
Pass: 4/6
---

# 14 — AI Slop Analysis

## Mandate

Hunt anything that makes AIIMIN forgettable.

## Critical findings

### 1. Dual identity in tokens.css

`:root` still markets itself as **“Vercel-Style Nordic”** with forest green `#22C55E` and Inter/Playfair.  
Canonical orange lives only under `[data-theme="aiimin-*"]`.  
**This is the single highest identity risk.**

### 2. Inter as body identity

Despite Figtree load + Design Lab decision, `--font-sans: Inter` wins. Classic LLM/startup default.

### 3. Purple decorative accents

`#8B5CF6` in Settings Appearance, Finance wealth delta, growth correlation palettes, card-purple tokens. Explicitly rejected by Knowledge Context anti-looks — still present.

### 4. Glassmorphism repetition

~45 files with backdrop-filter. Tokenized glass is fine for nav/overlays; **metric card glass + hover lift** is 2024 SaaS sludge.

### 5. Rounded rectangle card sameness

20–24px radius cards repeating across Family, Settings, StatCard, Overview widgets — same elevation language → pages interchangeable.

### 6. Generic dashboard template

Auto-fit grids, Lucide row lists, PageHeader + sections — ClickUp/Linear-adjacent without brand geometry.

### 7. Material clichés (native)

Stock Card + OutlinedTextField + default Button on Vault/Goals/Settings/Focus. Accent color alone ≠ identity.

### 8. Serif-for-prestige product headers

Playfair `--font-serif` on PageHeader / hero text — common AI “premium” tell. DNA wants Familjen display, not magazine serif everywhere.

### 9. kokonutui purple/pink kits

Quarantined to Design Lab — **still a paste hazard**.

### 10. Productivity clichés

OS Online badges, sparkle AI affordances, identical “insight cards,” streak theater without structural honesty.

### 11. Identical layouts

Finance ≈ Settings ≈ Family chassis. Confirmed in page identity scores ≤2.

### 12. Logo exploration green brand

`logo-designs/` green-led gallery — archive only. Shipping would destroy action/completion split.

## What is NOT slop (protect)

- Arch Bracket + ember  
- Warm ivory light  
- Orange action / green done  
- Brand always-light manifesto  
- Journal/Notes studios  
- Report print skins  
- Restrained 1px border doctrine in DESIGN.md  
- Capture-only `/m`  

## Board challenge

- **Senior Visual Designer:** Removing glass does not make UI “ugly” — it makes hierarchy readable.
- **Color Scientist:** Domain metric tints (water/sleep) are OK if quiet; purple as “premium” is not domain — kill it.
- **Creative Director:** Prototypes that look like fashion lookbooks are R&D; shipping Glass Mesh proto as product chrome would be new slop.

## Forgetability index

| Layer | Forgettable? |
|-------|--------------|
| Brand / waitlist | No |
| Studios | Mostly no |
| Core dashboard pages | **Yes** |
| Native secondary | **Yes** |
| Token defaults | **Yes** (until :root fixed) |
