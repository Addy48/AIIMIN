# AIIMIN Report Prototypes

Standalone visual selection gallery for the three report products.

## Open

```bash
cd prototypes/reports
python3 -m http.server 8765
```

Visit http://localhost:8765

## Contents

| Type | Tier | Prototypes |
|------|------|------------|
| Snapshot | Core+ | Spec Light, App Night, Ivory Pulse, Signal Brutal, Clinical Ledger, Soft Coach |
| Standard | Pro+ | Spec Ivory Strip, Consulting Navy, Quant Terminal, Academic Folio, Swiss Grid, Atelier Print |
| Deep | Elite | Spec+Tabs, Bound Quarterly, Lab Field Notes, Annual Letter, Systems Atlas, Quiet Authority |

## Data

`js/persona.js` — synthetic Quantified-Self composite (Kabir Mehta). Shapes inspired by public QS / r/dataisbeautiful patterns. Not live user data. Not scraped PII.

## Selection next step

Pick 1–2 winners per type. Lock tokens into vault ADR + product CSS. Then implement `/reports/generate`.
