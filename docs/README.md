# Documentation

| Folder | What is in it |
|---|---|
| [`architecture/`](architecture/) | The unified architecture diagram (`aiimin_architecture.png`), its source data (`.json`) and a standalone interactive visualizer (`.html`). |
| [`diagrams/`](diagrams/) | Three workflow diagrams as `.svg` and `.png` (cross-platform sync, web request flow, Android app and local security) and `interactive-system-visualizer.html`. |
| [`reports/`](reports/) | August 2026 reports on the web Reports and Life Score work: the metric inventory (`.md` and `.json`), the production QA report and the Life Score overhaul. |
| [`brand/`](brand/) | The AIIMIN wordmark as SVG (`aiimin-wordmark-light.svg`, `-dark.svg`; Bodoni Moda Bold, outlined from the Android app's font file) and [`logo-designs/`](brand/logo-designs/), a single-page sheet of 20 logo concepts. |

HTML files render as source on GitHub. Clone the repository or download the file and open it in a browser.

The diagrams were drawn for the v3 design. The note in the [main README](../README.md#interactive-architecture-visualizer) lists what differs in v4. The reports are historical and use the old `frontend/` and `app/` folder names; they are now `web/` and `android/`.

Per-part documentation lives next to the code: [`android/README.md`](../android/README.md), [`web/README.md`](../web/README.md), [`server/README.md`](../server/README.md).
