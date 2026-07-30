---
Purpose: High-impact visual opportunities — not redesigns; expected benefit, reason, priority, long-term value.
Confidence: 0.88
Evidence Sources: Cross-package findings; craft plan; Design Lab decisions; native gaps
Files Used: Synthesis of 00–14; Craft-Master-Plan-AJ.md; LogoTypographyPanel.jsx; UI-AUDIT.md
Reasoning: Opportunities must increase logo-off recognition or reduce identity drift — not chase trends.
Dependencies: 14, 17
Consumers: Sprint planning, design leads
Known Unknowns: Effort estimates rough; founder taste gates brand changes
Last Updated: 2026-07-22
Pass: 4/6
---

# 15 — Visual Opportunities

## Rules for this list

- Not mockups  
- Not “make it prettier”  
- Each item: benefit · reason · priority · long-term value  

---

### P0 — Make `:root` canonical AIIMIN

- **Benefit:** Eliminates forest-green flash / wrong accent without theme attr  
- **Reason:** Highest logo-off failure mode is legacy Vercel tokens  
- **Priority:** P0  
- **Long-term:** One source of truth for all agents  

### P0 — Enforce Figtree body / demote Inter

- **Benefit:** Aligns product type with brand and native  
- **Reason:** Design Lab already decided; code disagrees  
- **Priority:** P0  
- **Long-term:** Typography DNA survives scaling team  

### P0 — Reconcile dark base hex

- **Benefit:** Palette.md ↔ Theme.kt ↔ aiimin-dark agree  
- **Reason:** Three charcoal bases dilute recognition teaching  
- **Priority:** P0 (decision), P1 (apply)  
- **Long-term:** Lock documents stop conflicting  

### P1 — Kill decorative purple

- **Benefit:** Removes AI-SaaS tell  
- **Reason:** Anti-looks doctrine already forbids  
- **Priority:** P1  
- **Long-term:** Semantic color trust  

### P1 — One signature layout cue per primary route

- **Benefit:** Page identity scores rise without full redesign  
- **Reason:** Notes/Journal prove structure > decoration  
- **Priority:** P1 (Family, Finance, Settings first)  
- **Long-term:** 100 screens stay distinct  

### P1 — Wire motionPresets as sole vocabulary

- **Benefit:** Consistent calm motion; less jank  
- **Reason:** 85 Framer files vs 4 preset consumers  
- **Priority:** P1  
- **Long-term:** Motion DNA enforceable in review  

### P1 — Native: AiiminButtons on Focus/Discipline; Spacing/Radius tokens

- **Benefit:** Secondary screens stop looking like Material samples  
- **Reason:** UI audit + vault gaps  
- **Priority:** P1  
- **Long-term:** Companion feels same brand as Home/Auth  

### P2 — JetBrains Mono for scores on native

- **Benefit:** Measured number language matches web intent  
- **Reason:** Vault specifies; Type.kt missing  
- **Priority:** P2  
- **Long-term:** Cross-client ritual consistency  

### P2 — Activate or delete unused systems

- **Benefit:** Less false documentation (family.css, ArchBracketMark.kt)  
- **Reason:** Dead code implies false capability  
- **Priority:** P2  
- **Long-term:** Agents stop “using” ghosts  

### P2 — Empty states as editorial teaching

- **Benefit:** Sparse screens still feel AIIMIN without mascots  
- **Reason:** Illustration system absent — typography must carry  
- **Priority:** P2  
- **Long-term:** Avoid Storyset future  

### P3 — Report skins → product Reports visual lineage

- **Benefit:** Reports become recognizable artifacts  
- **Reason:** 18 skins already explore print DNA  
- **Priority:** P3  
- **Long-term:** Elite tier differentiation  

## Explicit non-opportunities

- New brand color  
- Purple OAuth chrome  
- Glass Mesh as default Today  
- Green-primary logo from logo-designs  
- Unifying BrandLockup click targets  

## Board challenge

- **Design Systems Lead:** P0 token hygiene beats any new page “redesign.”  
- **Creative Director:** Signature cues must be structural, not stickers.
