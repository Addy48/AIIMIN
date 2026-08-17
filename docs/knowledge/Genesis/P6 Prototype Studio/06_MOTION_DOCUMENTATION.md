# 06 — Motion Documentation

## Principles

1. Motion communicates state — never decoration loops.  
2. 150–250ms for UI; sheets ≤340ms.  
3. Ease-out exponential; no bounce.  
4. Honor `prefers-reduced-motion`.  
5. Max 2–3 intentional motions per surface.

## Catalog

| Moment | Motion |
|--------|--------|
| Splash → Onboarding | Fade crossfade 340ms |
| Screen change | Content fade + 8px rise |
| FAB press | Scale 0.94 → 1 |
| Sheet open | TranslateY 100% → 0 + scrim fade |
| Sheet close | Reverse |
| Drawer | TranslateX -100% → 0 |
| Habit complete | Check draw + green flash soft |
| Toast | Rise 20px + fade |
| Theme switch | Token color transition 340ms |
| AI chip appear | Stagger 40ms opacity |
| Skeleton → content | Crossfade |
| Celebration (rare) | Soft accent pulse on pulse ring only — no confetti |

## Navigation motion

Bottom nav active indicator: color + weight, no sliding pill carnival.

## Reduced motion

All transitions → 1ms or opacity-only instant.
