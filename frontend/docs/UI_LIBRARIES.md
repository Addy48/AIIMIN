# UI Libraries — Bklit, Kokonut UI, Motion

## Dev setup (CRA + craco)

This project uses **Create React App** with **craco** for path aliases and Next.js shims.

```bash
cd frontend
npm install
npm start   # NOT react-scripts start
```

**craco** resolves:
- `@/` → `src/`
- `next/link`, `next/image` → React Router / `<img>` shims
- `next-themes` → AIIMIN `ThemeContext`

## Installed components

| Package | Path |
|---------|------|
| Bklit area / line / heatmap | `src/components/charts/` |
| Bklit shimmering text | `src/components/shimmering-text.jsx` |
| Kokonut UI (45 blocks) | `src/components/kokonutui/` |
| shadcn primitives | `src/components/ui/` |

## Design Lab showcase

**Account → Design → UI library**

- **Bklit charts** — area, line, heatmap (live + loading), shimmering text
- **Kokonut UI** — buttons, text FX, backgrounds, cards, nav, inputs, AI chrome
- **Free motion** — framer-motion patterns (stagger, hover, expand, spring, progress, fade)
- Vote **Approve / Maybe / Skip** per prototype (saved in browser localStorage)

### Skipped (registry missing or not installed)

`magnet-button`, `typing-text`, `shapes-hero`, `stack`, `liquid-glass`, `x-card`, `ai-input-selector`, `ai-state-loading`, other Bklit chart types (bar, pie, radar, sankey, funnel).

## Install more

```bash
npx shadcn@latest add @bklit/bar-chart
npx shadcn@latest add @kokonutui/gradient-button
```

## Taste skills (enable in Cursor before approving designs)

- `.agents/skills/design-taste-frontend/SKILL.md`
- `.agents/skills/animation-vocabulary/SKILL.md`
- `.agents/skills/emil-design-eng/SKILL.md`

**Do not use** Motion+ AI Kit (paid). Use `framer-motion` + skills above.

## Motion packages

- `framer-motion` — existing app animations + Design Lab motion section
- `motion` — Bklit/Kokonut dependency (same family, not Motion+ Studio)
