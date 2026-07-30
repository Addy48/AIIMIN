# 07 — Platform Applicability Matrix

```yaml
document: Platform Matrix
version: P7 Governance v1.0
legend: "Y = applies / P = partial / N = not applicable"
columns: domain (schema category)
```

Cells show counts of GOVs in that domain rated Y/P/N for the platform.

| Platform | product | ux | visual | technical | ai | motion | accessibility | performance | governance |
|----------|---------|----|--------|-----------|----|--------|---------------|-------------|------------|
| Android | Y33/P0/N0 | Y58/P0/N0 | Y15/P0/N0 | Y2/P12/N0 | Y16/P0/N0 | Y14/P0/N0 | Y8/P0/N0 | Y3/P0/N0 | Y0/P9/N0 |
| Web | Y33/P0/N0 | Y58/P0/N0 | Y15/P0/N0 | Y2/P12/N0 | Y16/P0/N0 | Y14/P0/N0 | Y8/P0/N0 | Y3/P0/N0 | Y0/P9/N0 |
| Desktop | Y33/P0/N0 | Y58/P0/N0 | Y15/P0/N0 | Y0/P14/N0 | Y16/P0/N0 | Y14/P0/N0 | Y8/P0/N0 | Y3/P0/N0 | Y0/P9/N0 |
| Backend | Y0/P33/N0 | Y0/P0/N58 | Y0/P0/N15 | Y14/P0/N0 | Y16/P0/N0 | Y0/P0/N14 | Y0/P8/N0 | Y3/P0/N0 | Y0/P9/N0 |
| AI | Y0/P33/N0 | Y0/P58/N0 | Y0/P0/N15 | Y0/P14/N0 | Y16/P0/N0 | Y0/P0/N14 | Y0/P8/N0 | Y0/P3/N0 | Y0/P9/N0 |

## Domain counts (all GOV)

| Domain | Count |
|--------|-------|
| product | 33 |
| ux | 58 |
| visual | 15 |
| technical | 14 |
| ai | 16 |
| motion | 14 |
| accessibility | 8 |
| performance | 3 |
| governance | 9 |

## Notes

- **Web** includes desktop web and phone web `/m` (ceiling laws still bind).
- **Android** = native companion (not bound by `/m` capture ceiling — GOV-085).
- **Backend** primarily technical/ai/performance; UX/visual usually N.
- **AI** column = product AI systems (not Cursor agents — GOV-086).
- Per-GOV applicability lives as engineering judgment against this matrix; ADR if dispute.
