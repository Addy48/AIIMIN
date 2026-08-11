# 14 — Security Document

> **Depends:** [[09_BACKEND]]–[[13_OFFLINE]] [[11_AUTHENTICATION]]  
> **Status:** Complete draft · 2026-07-19  
> **Owner:** Security Engineer lens

---

## 1. Threat model (STRIDE lite)

| Threat | Example | Mitigation |
|--------|---------|------------|
| Spoofing | Stolen session | Secure storage, rotation, revoke devices |
| Tampering | Modified APK / API replay | Play Integrity, idempotency, HTTPS pinning optional |
| Repudiation | “I didn’t delete” | Audit log |
| Info disclosure | Backup journal in screenshots | FLAG_SECURE option, redact recents |
| DoS | AI abuse | Rate limits, auth |
| Elevation | IDOR | Ownership checks (LC-01) |

Assets: journal, finance, discipline, auth tokens, embeddings.

---

## 2. OWASP Mobile Top 10 (mapping)

| Risk | Control |
|------|---------|
| Improper credential usage | Keystore/Keychain; no tokens in logs |
| Inadequate supply chain | Lockfiles; Play App Signing |
| Insecure auth/session | Better Auth hardening; biometric step-up |
| Insufficient input validation | Server validation always |
| Insecure communication | TLS 1.2+; consider pinning on API host |
| Privacy controls | Consent; minimize; export/delete |
| Binary protections | R8/ProGuard; disable debug in release |
| Security misconfig | No cleartext release; Network Security Config |
| Insecure data storage | Encrypt sensitive; no secrets in APK |
| Insufficient cryptography | Platform libs only |

---

## 3. Encryption

In transit TLS · at rest Supabase · on device EncryptedSharedPreferences / SQLCipher optional for journal vault (V2).

---

## 4. Keychain / Keystore

Session material · biometric-bound keys where supported.

---

## 5. Certificate pinning

Pin `api.aiimin.in` leaf/intermediate with backup pin · disable carefully for debug builds.

---

## 6. Tokens

No JWT in WebView localStorage fantasy · memory + encrypted prefs · refresh rotation.

---

## 7. Replay / CSRF / XSS / SQLi

Idempotency keys · SameSite cookies web · parameterized SQL · mobile XSS N/A but WebView auth forbidden for primary.

---

## 8. Prompt injection / AI abuse

Treat model output untrusted · confirm before writes · sanitize tools · budget caps · block jailbreak-y system overrides.

---

## 9. Rate limiting / account recovery

Auth + AI + sync · recovery via email · support identity verification.

---

## 10. Play Integrity / Device trust

Standard API for sensitive; don’t brick rooted users for basic logs — tier policy.

---

## 11. Privacy engineering

Minimize analytics props · hash user ids · no raw journal in crash breadcrumbs.

---

*Next: [[15_AI_SYSTEM]]*
