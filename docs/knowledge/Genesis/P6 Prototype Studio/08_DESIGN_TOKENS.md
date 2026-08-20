# 08 — Design Tokens

```css
/* Color — LOCKED */
--bg-dark: #1a1a1a;
--surface-dark: #2d2d2d;
--bg-light: #EDE4D3;      /* canvas; prototype may use #f4efe6 layered */
--surface-light: #ffffff;
--accent: #ff6b35;
--done: #10b981;
--muted: #6b7280;
--text-dark-1: #f4f4f2;
--text-light-1: #14171A;

/* Type */
--font-display: 'Familjen Grotesk', system-ui, sans-serif;
--font-body: 'Figtree', system-ui, sans-serif;

/* Radius */
--r-xs: 8px; --r-sm: 12px; --r-md: 16px; --r-lg: 22px; --r-full: 999px;

/* Space */
--s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px; --s5: 20px; --s6: 24px; --s7: 32px; --s8: 40px;

/* Motion */
--ease-out: cubic-bezier(.16, 1, .3, 1);
--t1: 120ms; --t2: 220ms; --t3: 340ms;

/* Touch */
--touch: 44px;
```

## Semantic mapping

| Semantic | Token |
|----------|-------|
| Canvas | `--bg` |
| Raised | `--surface` / `--elevated` |
| Action | `--accent` |
| Success | `--done` |
| Quiet | `--muted` / `--text-3` |
| Danger | support rose (not brand) |

## Android Compose mapping

See `09_ANDROID_MAPPING.md` — `Accent`, `Success`, FamiljenGrotesk already in `Theme.kt` / `Type.kt`.
