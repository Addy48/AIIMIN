# Changelog

Notable changes, newest first. Format based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Changed
- Repository layout: `android/` (was `app/`), `web/` (was `frontend/`), `server/`. New READMEs for each part, `SECURITY.md`, and a shorter `CONTRIBUTING.md`.
- Internal planning notes moved out of the public repository.
- The API reads the CricAPI key from `CRICAPI_KEY` instead of the source.

## [Android 4.0.0-beta01] — 2026-10-19

First public Android beta. [Download](https://github.com/Addy48/AIIMIN/releases/tag/android-v4.0.0-beta01).

### Added
- Past bank messages: import one by one, a month at a time, or the whole year in the background.
- Bank SMS filters: banks and accounts, money in or out, a minimum amount, words to skip.
- Merchant memory: name a place once and its next payments arrive named and sorted; custom categories; recent buys as one-tap chips.
- Layouts that adapt to small phones, large text, foldables and tablets.
- Plan cards show what each plan has today and what's coming.
- Me › Support › Tell a friend.

### Fixed
- Vault text reading in release builds (ML Kit components were removed by R8).
- Repeated SMS alerts for one payment are counted once.

## [2026-07-19] — Monorepo and native merge

- Capacitor capture shell (`/m`) merged into `main`.
- Build artifacts removed from the git index.
- API deploys to EC2 on push.
