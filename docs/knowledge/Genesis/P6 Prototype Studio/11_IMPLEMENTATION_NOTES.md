# 11 — Implementation Notes

## Prototype stack

Static HTML + CSS + JS. No build step. Open `Prototype/index.html`.

## Files

| File | Role |
|------|------|
| `Prototype/index.html` | Shell + all screens |
| `Prototype/css/tokens.css` | Design tokens |
| `Prototype/css/shell.css` | Device frame, app chrome, nav |
| `Prototype/css/components.css` | Reusable UI |
| `Prototype/css/pages.css` | Per-surface layout |
| `Prototype/js/data.js` | Scenario content |
| `Prototype/js/app.js` | Navigation + interactions |

## Engineer handoff

1. Treat tokens as source for Compose + CSS variables.  
2. Do not copy Tasks/Projects from older prototypes.  
3. Capture sheet = Universal Logger conceptual sibling.  
4. No auth/schema changes implied — UI only.  
5. Vault docs update when porting behaviors to production.

## Quality bar

Handcrafted density, calm, trustworthy. If a screen could be a Material gallery sample after recolor, redesign it.
