# Changelog

All notable changes to this repository are documented here and in vault feature changelogs under `docs/knowledge/09_FEATURES/*/Changelog.md`.

Format based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- Monorepo documentation (`Monorepo.md`, `CONTRIBUTING.md`, overhauled `README.md`)
- Native Android V2 (`native-android/`) with mobile API routes
- Capacitor capture shell (`/m`) on `main`
- Skills registry and `scripts/verify-repo.sh`
- GitHub Actions: `verify-frontend.yml`, `native-android.yml`

### Changed
- Correlation engine and intelligence report services
- Frontend data layer (React Query hooks)
- Device tiers: phone web `/m` vs native companion clarified

## [2026-07-19] — Monorepo + native merge

- Merged `feat/mobile-capture-capacitor` into `main`
- Stripped ~3.4k native build artifacts from git index
- EC2 deploy on API push

## [2026-07-10] — Vault Brain OS

- Project documentation moved to `docs/knowledge/`

---

Older history: `docs/knowledge/99_ARCHIVE/` and git log before 2026-07-10.
