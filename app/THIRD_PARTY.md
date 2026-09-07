# Third-party assets bundled in the app

## Fonts

`core/designsystem/src/main/res/font/` holds three families, all under the
**SIL Open Font License 1.1**, taken from the Google Fonts repository
(`github.com/google/fonts`) on 2026-08-03:

| Files | Family | Upstream |
|---|---|---|
| `core_designsystem_barlow_*.ttf` | Barlow (Regular · Medium · SemiBold) | `ofl/barlow` |
| `core_designsystem_barlow_condensed_*.ttf` | Barlow Condensed (Medium · SemiBold · Bold) | `ofl/barlowcondensed` |
| `core_designsystem_jetbrains_mono_variable.ttf` | JetBrains Mono (variable `wght`) | `ofl/jetbrainsmono` |

They are bundled rather than fetched so the type is identical offline, on first
run, and on a phone with no Google Play services. The OFL requires the licence
to travel with the fonts: full text at <https://openfontlicense.org>.

Barlow © 2017 The Barlow Project Authors. JetBrains Mono © 2020 The JetBrains
Mono Project Authors.
