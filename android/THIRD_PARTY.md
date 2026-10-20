# Third-party assets bundled in the app

## Fonts

`core/designsystem/src/main/res/font/` holds four font families, all under the
**SIL Open Font License 1.1**, taken from the Google Fonts repository (`github.com/google/fonts`):

| File | Family | Used for | Upstream |
|---|---|---|---|
| `funnel_display.ttf` | Funnel Display (variable `wght`) | Display, headlines, numbers | `ofl/funneldisplay` |
| `bodoni_moda.ttf` | Bodoni Moda (variable `opsz`, `wght`), SIL OFL 1.1 | The AIIMIN wordmark only | `ofl/bodonimoda` |
| `golos_text.ttf` | Golos Text (variable `wght`) | Body text, controls and the journal | `ofl/golostext` |
| `jetbrains_mono.ttf` | JetBrains Mono Regular, © 2020 The JetBrains Mono Project Authors | Backup codes and raw bank-message text | `github.com/JetBrains/JetBrainsMono` |

They are bundled rather than fetched so the type is identical offline, on first run, and on a
phone with no Google Play services. The OFL requires the licence to travel with the fonts: full
text at <https://openfontlicense.org>.

## Icons

Phosphor Icons (MIT licence), drawn as Compose vectors in `core/designsystem/.../icon/AppIcons.kt`.

## Libraries

AndroidX (Compose, Room, Navigation, DataStore, WorkManager, Biometric), Hilt / Dagger, Retrofit and
OkHttp, kotlinx.serialization and coroutines, Vico, Google ML Kit (text recognition, document
scanner) and Google Play Billing: Apache License 2.0 or the Android SDK licence.
