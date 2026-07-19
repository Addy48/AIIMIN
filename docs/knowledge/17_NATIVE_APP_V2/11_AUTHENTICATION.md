# 11 — Authentication Design

> **Depends:** [[09_BACKEND]] [[10_DATABASE]] [[14_SECURITY]]  
> **Status:** Complete draft · 2026-07-19  
> **Base:** Better Auth + Google (web). Native extends carefully — **no silent auth rewrite in code without founder ask.**

---

## 1. Goals

Passwordless-friendly · OAuth · passkeys · biometrics for unlock · multi-device session visibility · waitlist gate preserved · Apple Sign In when iOS ships.

---

## 2. Methods

| Method | Platform | Notes |
|--------|----------|-------|
| Email + password / magic link | All | Prefer magic link for mobile friction |
| Google OAuth | All | **Custom Tabs / ASWebAuthenticationSession** — not broken WebView |
| Apple Sign In | iOS required if Google offered | |
| Passkeys (WebAuthn) | Android 9+ / iOS 16+ | Credential Manager |
| Biometric unlock | Native | Unlocks local session vault; not server auth replacement |

---

## 3. Sessions

- Server sessions via Better Auth  
- Mobile stores refresh/session secure: **EncryptedSharedPreferences / Keystore · Keychain**  
- Short access + refresh rotation  
- `devices` row per install  
- List sessions in You → Devices · revoke one/all  

---

## 4. Token refresh

Silent refresh on 401 once · fail → AuthHub · clock skew tolerance  

---

## 5. Waitlist / entitlements vs auth

Auth ≠ access. After auth, check allowlist/entitlement before Main.

---

## 6. Step-up

Sensitive: delete account, export, change email → re-auth or biometric + password.

---

## 7. Security events

Login success/fail · new device · revoke · password change · impossible travel heuristic (soft).

---

## 8. Account recovery

Email magic link · support playbook · no SMS initially (cost/SIM swap) unless required.

---

## 9. Guest

If enabled: local-only UUID · migrate merges into authenticated user once.

---

## 10. Native deep link auth returns

App Links / Universal Links to `aiimin.in/app/auth/callback` → exchange → Main.

---

*Next: [[12_SYNC]]*
