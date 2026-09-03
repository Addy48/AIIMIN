# Reports visual QA checkpoint

- The true mobile emulation probe reports viewport width 390, body scrollWidth 390, workspace width 390, and no horizontal document overflow.
- Explore mobile now wraps the hero title and demo banner correctly; the earlier apparent clipping was caused by Chrome headless's 500px minimum layout viewport when only `--window-size=390` was used.
- Explore desktop renders a full-width hero, coverage/context cards, descriptive observation, seven-day pulse, and metric content without visible document clipping.
- The latest screenshots still show orange ring/progress treatment even after the scoped Reports CSS declares steel `#749dc4`; computed-style inspection is required before claiming the palette change took effect.
- The latest Explore mobile screenshot has acceptable geometry but its hero body has low contrast in the center gradient; inspect computed styles and consider improving readable overlay contrast without changing unrelated global tokens.


Core desktop and mobile both render the same canonical weekly review: a steel score ring, coverage, week-over-week comparison, five-domain change cards, and the weekly loop. The mobile hero wraps correctly and the viewport remains bounded. The hero subtitle is still low contrast over the light-to-dark split at small widths, so it is being addressed with the scoped contrast rule and will be rechecked in the next capture.


Pro desktop presents the six window controls, canonical report version, steel score ring, five domain cards, and the ranked-findings section in a coherent hierarchy. Pro mobile wraps the window controls into two rows and keeps the workspace within the viewport. The lower part of the mobile screenshot ends inside the hero because the capture viewport is short; this is expected page scroll, not horizontal clipping. The subtitle remains readable enough after the contrast rule, though the split hero is intentionally low-key and will be validated against computed styles.


Elite desktop presents the dark intelligence-room treatment, six-chapter rail, coverage, five-domain system map, and method disclosure. Elite mobile correctly converts the rail into a horizontally scrollable chapter strip and stacks the room content, but the latest screenshot exposes a 16px right-side gap/clip caused by the mobile negative margins on `.report-workspace--elite`; that rule should be reset to zero margins because the workspace already owns the 100vw box. The orange active chapter treatment is intentionally retained as a small spark while the score/progress system uses steel.


The corrected Elite mobile capture now fills the 390px viewport with no document overflow; the DevTools probe confirms workspace width 390 and body scrollWidth 390. The chapter strip is intentionally horizontally scrollable, with the next chapter partially visible as a touch affordance. The score ring and coverage accents resolve to steel `#749dc4`, while the active chapter retains the orange spark treatment.


## Added theme pass — 2026-08-22

The attached-desktop probe captured `aiimin-dark` and `aiimin-light` on Explore and Elite at 1440px. Computed styles confirmed the Reports workspace uses the runtime theme variables: dark canvas `#14171A`, dark card `#1E2228`, light canvas `#EDE4D3`, light card `#FFFFFF`, with the theme’s burnt-orange accent. Elite no longer forces a dark interior in light mode; its room, rail, cards, footer, and typography all switch to the active light palette. Dark Elite remains an intentional dark control-room surface.

The light screenshot now reads as a coherent editorial light report rather than a light shell surrounding a black room. The dark screenshot retains the high-contrast intelligence-room treatment. The probe also shows the existing outer shell’s document width at 1436px inside a 1440px viewport; this is a small pre-existing shell scrollbar/containment condition, not a Reports-specific horizontal overflow. The new lower evidence-trail footer is visible and bounded in both themes.


## Theme mobile verification — 2026-08-22

The true 390px mobile probe passed all four tiers in both `aiimin-dark` and `aiimin-light`: document scroll width and body scroll width remained 390px, and each workspace remained bounded to the viewport. Dark Elite remains a coherent dark room; light Elite now follows the light canvas/card/ink palette rather than rendering a black panel inside the light shell. The light and dark score rings, coverage rails, chapter rail, and footer adapt from the same runtime theme variables. The Elite chapter strip remains intentionally horizontally scrollable with a partial next item as a touch affordance; it does not create document-level overflow.


## Lower-page and runtime verification — 2026-08-22

The bottom-of-page harness captured Explore, Pro, and Elite at 1440px in both `aiimin-dark` and `aiimin-light`. The footer is present in all six captures and carries the canonical model version (`lhs-v3.0.0-calibrated`), window (`Last 30 days · demo fixture`), observed days (`30 days`), and confidence (`strong`). Visual inspection of light and dark Elite confirms the footer, method card, domain cards, and chapter rail remain legible and coherent in both palettes.

The exact 390px Reports console probe covered all eight theme/tier combinations and found no console errors after demo mode was changed to skip the authenticated profile fetch. Each combination had a workspace, score, footer, bounded document/body width of 390px, and a valid Elite method section where applicable. The only earlier console error was the expected unauthorized profile request from the no-auth fixture; it is now removed without changing production authenticated loading.

The OS-ID computed-style probe used the compiled IvorySnapshot stylesheet and the actual `AADI0837` identifier form. The scoped class resolves to Familjen Grotesk/Figtree display sans, 750 weight, and `0.045em` tracking; ordinary `Aaditya` remains Georgia, 600 weight, and the existing negative tracking. The improvement is limited to the alphanumeric OS-ID pattern or the explicit `OS-ID:` fallback string.
