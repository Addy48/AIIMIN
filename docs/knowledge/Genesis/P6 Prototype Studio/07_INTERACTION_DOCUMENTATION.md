# 07 — Interaction Documentation

## Global

| Input | Result |
|-------|--------|
| FAB | Open capture sheet |
| Scrim tap | Close sheet/drawer |
| Theme toggle | Flip `data-theme` |
| Sign out | Return Auth |
| Back on subscreen | Pop |

## Capture sheet actions

| Action | Feedback |
|--------|----------|
| Log habit | Toast + optional Today highlight |
| Journal line | Opens Knowledge Journal focused |
| Spend | Finance chip confirm mock |
| Note | Knowledge Notes |
| Event | Timeline entry toast |

## Today

| Action | Result |
|--------|--------|
| Toggle habit | Optimistic done state |
| Focus card CTA | Toast “Focus started” |
| AI nudge chip | Navigate AI with prompt seed |

## Knowledge

| Action | Result |
|--------|--------|
| Tab switch | Journal ↔ Notes |
| Search notes | Filter cards |
| Save journal | Toast + timeline seed |

## Finance

| Action | Result |
|--------|--------|
| Quick add | Prefills capture sheet money mode |

## Family / Documents

| Action | Result |
|--------|----------|
| Vault | PIN → unlock list |
| Member row | Toast detail (prototype) |

## AI

| Action | Result |
|--------|--------|
| Send | Append user + assistant bubbles |
| Suggestion chip | Insert as user prompt |

## Search

| Action | Result |
|--------|--------|
| Type | Filter result rows |
| Tap result | Route to owning surface |

## Compression target (doctrine)

Median daily interactions toward **5** — prototype teaches capture sheet as primary path.
