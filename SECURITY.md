# Security

AIIMIN holds people's money records and family documents, so security reports get priority.

## Reporting a vulnerability

Email **security@aiimin.in** with what you found, how to reproduce it, and what it could expose. Please don't open a public issue or test against other people's accounts or data.

We will reply within 3 working days, keep you updated while we fix it, and credit you when the fix ships if you'd like.

## Scope

- The Android app (`android/`)
- aiimin.in and the web app (`web/`)
- The API at api.aiimin.in (`server/`, `api/`)

## How data is handled

- Bank SMS are read on the phone and never uploaded.
- Health and screen-time data stay on the phone.
- Secrets live only in the hosting environments, never in this repository. Commits are scanned with gitleaks.
