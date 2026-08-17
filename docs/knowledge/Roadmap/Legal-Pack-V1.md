---
authority: engineering
derived_from: Genesis P8 Ch15 · AIIMIN-V1-Blueprint §12 · DPDP Act 2023 + DPDP Rules 2025 · Google API Services User Data Policy · Google Play Developer Program Policy
status: active
owner: founder
lifecycle: living
last_reviewed: 2026-07-31
can_override_genesis: false
knowledge_layer: KL-BUILD
graph_role: hub
note_type: NT-LEGAL
program: Legal-Pack-V1
tags:
  - type/hub
  - domain/legal
  - status/living
---

# AIIMIN Legal & Trust Pack v1.0 — publishable source of truth

> [!warning] Counsel review gate
> This pack is written to be **publishable after two fills**: (1) the entity/contact placeholders in §0.2, and (2) an Indian counsel read-through. It is drafted to DPDP Act 2023 + **DPDP Rules 2025** (notified 14 Nov 2025), Google API Services User Data Policy (Limited Use), and Google Play Developer Program Policy as of July 2026. It is **not** legal advice.

> [!important] One-system rule
> These documents cover **all** AIIMIN surfaces: `aiimin.in` website, the web app, `aiimin.in/m`, the Android app, and `api.aiimin.in`. There is exactly one Privacy Policy and one Terms of Service across surfaces (Blueprint §12.7). The website pages under `frontend/src/pages/legal/` are the published rendering of this file. **Edit here first, then port.**

---

## 0. Control sheet

### 0.1 Document register

| # | Document | Route | Status | Why it exists |
|---|----------|-------|--------|---------------|
| L1 | Privacy Policy | `/privacy` | rewrite | DPDP Rule 3 notice + Google Limited Use + Play data safety |
| L2 | Terms of Service | `/terms` | rewrite | Contract, liability, eligibility, subscriptions |
| L3 | Security Statement | `/security` | rewrite | Trust surface; honest claim discipline |
| L4 | Data Deletion & Export | `/data-deletion` | rewrite | Google requirement + DPDP erasure right |
| L5 | Cookie & Local Storage Policy | `/cookies` | **new** | Cookie law + honesty about local storage |
| L6 | Acceptable Use Policy | `/acceptable-use` | **new** | Abuse control, account termination basis |
| L7 | Refund, Billing & Cancellation | `/refunds` | **new** | Payment-gateway and store requirement (India) |
| L8 | AI Disclosure | `/ai-disclosure` | **new** | Transparency; EU AI Act readiness; Genesis Ch07 |
| L9 | Grievance Redressal & Your Rights | `/grievance` | **new** | DPDP Rules 2025 mandatory publication |
| L10 | Subprocessors & Third Parties | `/subprocessors` | **new** | DPDP + GDPR transparency |
| L11 | Legal Hub | `/legal` | **new** | One index page; footer target |
| L12 | About | `/about` | rewrite | Currently claims "non-commercial, creator-only" — false once tiers sell |
| L13 | Contact | `/contact` | rewrite | Must carry grievance officer details |

### 0.2 Placeholder register — MUST be filled before publish

| Token | Meaning | Blocking |
|-------|---------|----------|
| `{{LEGAL_ENTITY}}` | Registered name (proprietorship / LLP / Pvt Ltd) | L1 L2 L7 L9 |
| `{{ENTITY_TYPE}}` | e.g. "sole proprietorship registered in India" | L2 |
| `{{REGISTERED_ADDRESS}}` | Full postal address (DPDP + Play + payment gateway) | L1 L2 L7 L9 |
| `{{GSTIN}}` | If registered | L7 |
| `{{GRIEVANCE_OFFICER_NAME}}` | Named human | L9 |
| `{{GRIEVANCE_EMAIL}}` | e.g. `grievance@aiimin.in` | L1 L9 |
| `{{PRIVACY_EMAIL}}` | `privacy@aiimin.in` | L1 L4 |
| `{{SUPPORT_EMAIL}}` | `support@aiimin.in` (already live) | all |
| `{{SECURITY_EMAIL}}` | `security@aiimin.in` | L3 |
| `{{JURISDICTION_CITY}}` | Courts city | L2 |
| `{{LIABILITY_CAP}}` | Recommended: greater of ₹5,000 or fees paid in prior 12 months | L2 |
| `{{EFFECTIVE_DATE}}` | Publish date | all |

**Rule:** no page may ship with `you@example.com`. That string currently appears in `Privacy.jsx`, `Terms.jsx`, `About.jsx` and is a live credibility bug.

### 0.3 Claim discipline (non-negotiable)

| Never say | Say instead | Why |
|-----------|-------------|-----|
| "End-to-end encrypted" | "Encrypted in transit and at rest" | E2E is not shipped (Blueprint §12.6) |
| "We can't read your data" | "Access is restricted, logged, and limited to support you request or law requires" | Server can decrypt in V1 |
| "We never use analytics" | "Analytics only after you consent, and never on journal content" | GA4/Sentry are planned |
| "Bank-grade security" | Name the actual controls | Unverifiable marketing claim |
| "100% private" | "Your data is yours; here is exactly what we hold" | Absolutes invite liability |
| "AI reads your journal to help you" | "AI touches a journal entry only when you ask, per entry" | Genesis P8-R-219 |
| "We read your SMS" | See §11 — AIIMIN does **not** use SMS permissions | Play policy |

### 0.4 Compliance matrix

| Obligation | Source | Where satisfied |
|------------|--------|-----------------|
| Standalone, plain-language notice with **itemised** data list + specific purposes | DPDP Rules 2025 r.3 | L1 §3 table |
| Link/means to withdraw consent, exercise rights, complain to the Board | DPDP Rules 2025 r.3 | L1 §9, L9, in-app Privacy tab |
| Withdrawal as easy as granting; no dark patterns | DPDP Act s.6(4) | In-app consent rows (Blueprint §12.3) |
| Grievance mechanism, response ≤ 90 days | DPDP Rules 2025 r.13 | L9 |
| Publish contact of person answering data questions | DPDP Rules 2025 | L9, L13 |
| Breach: notify affected users without delay; Board within 72h | DPDP Rules 2025 | L1 §12, internal runbook |
| Processing logs retained ≥ 1 year | DPDP Rules 2025 | `data_access_log` (Blueprint §9.3) |
| Children: verifiable parental consent under 18 | DPDP Act s.9 | **18+ age gate** — L2 §3, closes Blueprint OD-10 |
| No tracking/behavioural ads to children | DPDP Act s.9(3) | No ads at all |
| Google Limited Use for Calendar/Drive/People data | Google API Services User Data Policy | L1 §5 |
| Play Data safety form matches policy | Play Developer Program Policy | §10 mapping table |
| Health Connect declaration + limited use | Play health apps policy | §11.3 |
| No SMS/Call-Log permissions unless default handler | Play restricted permissions | §11.2 — **design changed** |
| Refund/cancellation terms published | RBI/PA-PG + Play billing | L7 |
| AI system transparency | EU AI Act Art. 50 readiness, Genesis Ch07 | L8 |

---

## L1 — Privacy Policy

**Effective:** `{{EFFECTIVE_DATE}}` · **Applies to:** aiimin.in, the AIIMIN web app, aiimin.in/m, the AIIMIN Android app, api.aiimin.in

### 1. Summary in plain language

AIIMIN is a Personal Life OS. You put your life into it — days, habits, money, documents, people, practice sessions — and it gives you back an honest picture.

Four commitments that will not change:

1. **Your data is yours.** We are a steward, not an owner.
2. **We do not sell, rent, or share your personal data** with anyone for their own purposes, and we never use it for advertising.
3. **You can export everything, and you can delete everything.** Both are available inside the app, at any time, on every surface.
4. **Your journal is treated as private reflection.** It is excluded from analytics and from any automated processing you did not personally ask for, entry by entry.

### 2. Who we are

`{{LEGAL_ENTITY}}`, `{{ENTITY_TYPE}}`, at `{{REGISTERED_ADDRESS}}`, operates AIIMIN. Under India's Digital Personal Data Protection Act, 2023 (DPDP Act), we are the **Data Fiduciary** for your personal data, and you are the **Data Principal**. For users in the EEA/UK we act as **controller** under the GDPR/UK GDPR.

Contact: `{{PRIVACY_EMAIL}}` · Grievance Officer: see §11 and `/grievance`.

### 3. Exactly what we collect — itemised

We list this per DPDP Rules 2025, Rule 3. Anything marked **optional** is collected only if you switch it on; you can switch it off later and ask us to delete what was collected.

#### 3.1 Account and identity

| Data | Purpose | Basis | Where it lives |
|------|---------|-------|----------------|
| Email address | Sign-in, verification, security and billing notices | Contract | Server |
| Name (or what you choose to be called) | Address you correctly in the product | Contract |
| OS-ID (your 8-character handle) | Public identifier for sign-in | Contract | Server |
| 6-digit PIN | Sign-in credential — stored only as a salted hash, never in plain text, never in logs or analytics | Contract | Server |
| Timezone | Correct day boundaries | Contract | Server |
| Google account name, email, profile picture (only if you sign in with Google) | Create and identify your account | Consent | Server |
| Session and device records (device model, app version, platform, last-seen) | Keep you signed in, show you your active devices, detect abuse | Legitimate use / contract | Server |
| IP address and coarse request logs | Security, abuse prevention, debugging | Legitimate use | Server, ≤ 90 days |

#### 3.2 What you create in AIIMIN (your life data)

| Data | Purpose | Basis |
|------|---------|-------|
| Daily logs, habits and completions, goals, tasks, focus sessions, discipline records | Run the product features you use | Contract |
| **Journal entries** | Your private writing space | Contract, with special handling (§6) |
| Notes and their attachments | Your notes | Contract |
| Calendar events you create in AIIMIN | Your calendar | Contract |
| Money records: transactions, accounts, budgets, assets, lending and borrowing records | Your money features | Contract |
| People records: name, relationship, optional phone number and email, optional photo | Link your records to real people | Consent (see §3.4) |
| Documents you upload, and the metadata and expiry dates you add | Your document vault | Contract |
| Practice sessions (English/voice): transcript, scores, word bank | Your learning progress | Contract |
| Feedback and support messages you send us | Answer you, fix bugs | Contract |

#### 3.3 Derived data we compute

Life Score and its per-domain components; Depth state; streaks; AIIMIN English Index (AEI) and skill levels; correlations and weekly/monthly insight text; suggested structure from your own text. Derived data is produced from the data above and is deleted with it.

#### 3.4 Optional connections — off unless you turn them on

| Connection | Exactly what we read | What we never read | What we store on our servers |
|------------|----------------------|--------------------|------------------------------|
| **Google Calendar** | Events on calendars you authorise; Google Tasks that have a due date | Gmail, Drive files (unless you separately connect Drive), contacts | Event time, title, calendar id, Google event id — or times only if you choose Busy-only mode |
| **Google Drive** (optional) | Only the folder you nominate for note sync | Your whole Drive | File name, id, extracted text of files you sync |
| **Google People / phone contacts** | Only the individual contacts **you select** in the picker | Your whole address book, call logs, message logs | Display name, optional email, a one-way hash of the phone number for matching, and the phone number itself only if you keep it visible |
| **Health Connect** (Android) | Daily totals: steps, distance, active minutes, sleep duration | Workout GPS routes, heart-rate streams, medical records | Daily totals only, per day |
| **Device usage / screen time** (Android) | Daily total screen time; app **categories** only if you opt in | Per-app minute-by-minute history, app contents | Daily total (and category totals if opted in) |
| **Payment alert reading** (Android, opt-in) | Amount, direction, counterparty text and reference from payment alerts, matched on-device against a bank/UPI template list | OTPs, personal messages, message bodies | **Nothing raw.** Only the transaction draft you approve |
| **Microphone** | Audio only while a practice session is running and you started it | Any background audio | Nothing by default — audio stays on your device and is discarded after scoring, unless you turn on cloud replay |
| **Camera** | Frames while you are scanning a receipt or document | Anything outside a scan you started | The resulting file, if you save it |
| **Notifications** | — | — | Push token per device |

**We do not request location. We do not request call logs. We do not request SMS permissions.** See §11.2 for why.

#### 3.5 Analytics and error reporting — consent first

Until you consent, no product analytics or error-reporting SDK is initialised. If you consent, we collect **event counts and technical context only**: which screens were opened, which actions succeeded or failed, error codes, app version, device class, and an opaque per-account identifier.

Never included in analytics or error reports: journal content, note content, document contents or numbers, message or contact contents, transcripts, amounts, PIN, or any Google user data. You can withdraw consent at any time in **Account → Privacy**; withdrawal stops future collection and we delete the associated analytics records on request.

### 4. How we use your data — and how we do not

**We use it to:** operate the features you use; compute your scores and insights; sync across your devices; send you the notifications you chose; take payment and manage your plan; keep the service secure; answer support requests; and meet legal obligations.

**We do not:** sell, rent or licence your personal data; share it for anyone else's marketing; use it to build advertising profiles; train, fine-tune or improve any general-purpose AI model on your content; publish anything on your behalf; read your journal in order to profile you; or use your contacts to invite, market to, or grow through the people you know.

### 5. Google user data — Limited Use

AIIMIN's use of information received from Google APIs adheres to the **Google API Services User Data Policy**, including the **Limited Use** requirements. Specifically:

1. Google user data is used **only** to provide or improve the user-facing features that you authorised and that are prominently described in the product.
2. We **do not transfer** Google user data to third parties, except (a) infrastructure providers strictly processing it on our behalf under contract, (b) where you explicitly direct it, or (c) where required by law.
3. We **do not use** Google user data for advertising.
4. We **do not use** Google user data to train, fine-tune, or otherwise develop generalised AI/ML models.
5. **No human reads** your Google user data unless you specifically ask us to for support, we need to for security or to comply with law, or the data has been aggregated and anonymised.

**Scopes we request, and why:**

| Scope | Why we need it | Consequence of refusing |
|-------|----------------|-------------------------|
| `openid`, `email`, `profile` | Create and identify your account when you choose Google sign-in | Use email + PIN sign-in instead |
| `calendar.events` (read/write) | Show your real day, and write back only events you create in AIIMIN — by default into a separate calendar named "AIIMIN" | Use AIIMIN-only manual events |
| `tasks.readonly` | Show Google Tasks that have a due date on your day | Tasks are not shown |
| `drive.readonly` (optional) | Sync notes from a single folder you nominate | No Drive note sync |
| `contacts.readonly` / People (optional) | Let you pick specific people to link to your records | Add people manually |

You can disconnect any Google connection at any time in **Account → Connections**, and revoke AIIMIN at [myaccount.google.com/permissions](https://myaccount.google.com/permissions). On disconnect we ask whether to keep or delete the data already imported, and we honour your choice.

### 6. Special handling: journal and other high-sensitivity content

Your journal is treated as **private reflection**:

- It is **excluded from analytics and telemetry** entirely.
- It is **not** used to compute profiles, and it is **not** sent to any AI provider unless you press the AI action on a specific entry — and then only that entry's text goes, with no identifiers.
- It is **never** included in notification text.
- You can exclude it from in-app search.
- It is encrypted at rest.

We also **never infer** high-sensitivity facts about you. Medications, allergies, diagnoses, and similar are only ever what you typed yourself; AIIMIN's AI is explicitly prohibited from guessing them, and will always ask instead. AIIMIN is not a medical device and provides no diagnosis (see L8).

### 7. Where your data is processed

Primary processing is in **India (AWS ap-south-1 / Mumbai)** together with our managed database provider. Some subprocessors (listed at `/subprocessors`) process data outside India, which may include the United States and the EU. Where such transfers involve EEA/UK personal data, we rely on the European Commission's Standard Contractual Clauses.

### 8. How long we keep it

| Data | Retention |
|------|-----------|
| Account data | While your account exists |
| Your life data | While your account exists, or until you delete it — whichever is first |
| Journal, notes, documents, people, transactions you delete | 30-day recycle bin, then permanent deletion |
| Practice audio | Deleted immediately after scoring, unless you enabled cloud replay (then 30 days, or until you delete it) |
| Health and screen-time daily totals | While the connection is on; deleted on request when you disconnect |
| Payment-alert drafts you did not approve | Discarded on device; never sent to us |
| Request/security logs | 90 days |
| Consent records and the content-free activity log | While your account exists, then per §8 deletion — kept because the law requires us to be able to show what you consented to |
| Processing logs required by DPDP Rules | At least 1 year |
| Billing records | As required by Indian tax law (currently 8 years) — invoices only, not your life data |
| After account deletion | Access revoked immediately; deletion from live systems within 7 days; from backups within 30 days |

### 9. Your rights and how to use them

Under the DPDP Act (and the GDPR/UK GDPR where it applies) you can:

| Right | How |
|-------|-----|
| **Access** a copy of your data | Account → Privacy → **Export**; machine-readable JSON, plus your files |
| **Correct** or complete it | Edit in the app; anything you cannot edit, email `{{PRIVACY_EMAIL}}` |
| **Erase** it | Account → Privacy → **Wipe life data** (keeps login) or **Delete account** (removes everything) |
| **Withdraw consent** | Account → Privacy toggles — as easy as switching it on. We stop collecting immediately and offer to delete what was collected |
| **Nominate** someone to exercise your rights if you die or become incapable (DPDP s.14) | Email `{{GRIEVANCE_EMAIL}}` — we will record your nominee |
| **Grievance redressal** | `/grievance` — we respond within 90 days, and target 7 days |
| **Complain to the Data Protection Board of India** | If we do not resolve it, you may complain to the Board. EEA/UK users may complain to their supervisory authority |
| **Object / restrict / portability** (GDPR) | Email `{{PRIVACY_EMAIL}}` |

We do not charge for these, and using them never degrades your service.

### 10. Children

AIIMIN is for adults. You must be **18 or older** to create an account. We do not knowingly collect data from children. If we learn that a child has created an account, we will delete it and its data. We never serve behavioural advertising and never track children — there is no advertising in AIIMIN at all.

### 11. Security, and what to do if something goes wrong

See `/security` for controls. If a personal data breach affects you, we will inform you **without undue delay**, in plain language, with what happened, what data was involved, what we have done, and what you should do — and we will notify the Data Protection Board of India within **72 hours**.

Report a suspected vulnerability to `{{SECURITY_EMAIL}}`. We will not pursue legal action against good-faith security research that respects user privacy and does not degrade the service.

### 12. Automated decision-making

AIIMIN suggests; you decide. No feature makes a legally significant or irreversible decision about you automatically. AI may pre-fill a field or propose a structure, always with a way to correct or dismiss it, and never for permissions, billing, or deletion. See L8.

### 13. Changes

If we change this policy materially, we will tell you in the app before the change takes effect and, where required, ask for fresh consent. Old versions are archived and linked at `/legal`.

### 14. Contact

`{{LEGAL_ENTITY}}`, `{{REGISTERED_ADDRESS}}` · Privacy: `{{PRIVACY_EMAIL}}` · Grievance Officer: `{{GRIEVANCE_OFFICER_NAME}}`, `{{GRIEVANCE_EMAIL}}` · Support: `{{SUPPORT_EMAIL}}`

---

## L2 — Terms of Service

**Effective:** `{{EFFECTIVE_DATE}}`

### 1. Agreement

By creating an account or using AIIMIN, you agree to these Terms and to the Privacy Policy. If you do not agree, do not use AIIMIN.

### 2. What AIIMIN is

AIIMIN is a personal productivity and life-management application: capture, habits, goals, calendar, money tracking, documents, practice tools, and AI-assisted summaries. AIIMIN is **not**: a medical, psychological, or diagnostic service; a financial, investment, tax, or legal adviser; a bank, payment system, or account aggregator; a records system you should rely on as your only copy; an emergency service.

### 3. Eligibility

You must be **18 or older** and legally able to enter a contract. One account per person. You are responsible for what happens under your account.

### 4. Your account

Keep your PIN and OS-ID private. Tell us promptly at `{{SUPPORT_EMAIL}}` if you suspect unauthorised access. We may require email verification, and we may throttle or block requests that look automated or abusive. During the founding period, access may be gated by a waitlist or invitation.

### 5. Your content

**You own what you put in.** You grant us only the limited, revocable licence needed to host, back up, transmit, and display your content to you, and to process it to provide the features you use. We claim no ownership, and we will not publish your content. This licence ends when you delete the content or your account, subject to backup cycles described in the Privacy Policy.

**You are responsible** for having the right to upload what you upload, including documents about other people. Where you store data about family members or other people, you confirm you have a lawful basis to do so.

### 6. Acceptable use

See `/acceptable-use`. In short: do not break the law, do not abuse the service or other people, do not attack the infrastructure, and do not try to extract other users' data.

### 7. Subscriptions and payment

Plans, prices, renewals, refunds and cancellation are described in `/refunds`, which forms part of these Terms. Prices are in Indian Rupees and are shown inclusive or exclusive of taxes as displayed at checkout. Founding rates apply for the stated period and are honoured for as long as the subscription remains continuously active, unless the description says otherwise. We may change prices for future billing periods with at least 30 days' notice; you may cancel before the change takes effect.

### 8. AI features

AI output may be wrong. See `/ai-disclosure`. You are responsible for decisions you make. Quotas apply per plan and are stated in-app; we do not promise unlimited AI.

### 9. Third-party services

Google, payment processors, AI providers and hosting providers have their own terms. We are not responsible for their outages or acts. If a third-party API changes or is withdrawn, an affected feature may change or stop; we will tell you and, where a paid feature is materially lost, offer a fair remedy under §12.

### 10. Availability

We target high availability but do not guarantee uninterrupted service. We may perform maintenance, and we may change or discontinue features. If we discontinue a paid feature you are actively using, we will give notice and a pro-rata credit or refund for the unused portion.

### 11. Disclaimers

To the extent permitted by law, AIIMIN is provided "as is" and "as available", without warranties of merchantability, fitness for a particular purpose, or non-infringement. **Keep your own copies of documents that matter.** Export is always available; use it.

### 12. Limitation of liability

To the extent permitted by law, we are not liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, revenue, goodwill, or data. Our total aggregate liability arising out of or related to AIIMIN is limited to `{{LIABILITY_CAP}}`. Nothing here limits liability that cannot be limited by law, including for gross negligence, wilful misconduct, or death or personal injury caused by negligence.

### 13. Indemnity

You will indemnify us against third-party claims arising from your unlawful use of AIIMIN or your breach of these Terms.

### 14. Suspension and termination

You may stop and delete your account at any time. We may suspend or terminate access for a material breach of these Terms or `/acceptable-use`, for legal reasons, or to protect the service or other users — with notice where practical, and immediately where necessary. On termination you keep your export right for 30 days unless the law requires otherwise.

### 15. Governing law and disputes

These Terms are governed by the laws of India. Courts at `{{JURISDICTION_CITY}}` have exclusive jurisdiction, subject to any non-waivable consumer rights you have where you live. Before filing, please contact `{{GRIEVANCE_EMAIL}}` — most issues are resolved in days.

### 16. Changes

We will post changes here and notify you in-app for material changes at least 14 days before they take effect. Continuing to use AIIMIN after that means you accept them.

### 17. Contact

`{{LEGAL_ENTITY}}`, `{{REGISTERED_ADDRESS}}` · `{{SUPPORT_EMAIL}}`

---

## L3 — Security Statement

**Effective:** `{{EFFECTIVE_DATE}}` · Written to be verifiable. If a control is not live yet, it is marked **planned** and dated.

### What is in place

| Area | Control |
|------|---------|
| Transport | TLS 1.2+ everywhere; HSTS on `aiimin.in`; certificate pinning in the Android app |
| Authentication | Session tokens with short-lived caching; PIN stored as a salted hash; rate limiting on sign-in; optional biometric unlock on Android |
| Authorisation | Every database table carries row-level security keyed to your account; the server derives your identity from the session and never trusts a client-supplied user id |
| Secrets | Held in a managed secrets store, never in source control |
| Data at rest | Managed database encryption; additional column-level encryption for OAuth tokens, document identification numbers, and journal content |
| Files | Private object storage; every download uses a short-lived, single-use signed link; no public buckets |
| Third-party tokens | Encrypted; deleted when you disconnect or delete your account |
| Isolation | Production data is never copied into development or testing; test data is synthetic |
| Logging | Requests, security events, and a content-free activity log you can read yourself in Account → Privacy |
| Dependencies | Automated dependency and container scanning in CI |
| Backups | Encrypted, with a documented restore procedure that we rehearse |
| Vault | The Family area can be locked behind PIN or biometrics and re-locks automatically |

### Planned, with dates

| Control | Target |
|---------|--------|
| Web application firewall in front of the API | with the cloud migration wave (Blueprint §14.5 phase 5) |
| CloudWatch alarms + on-call notification for API errors, latency, queue age | Blueprint W0 |
| SSH access limited to session-manager only | Blueprint W0 |
| Independent penetration test before public launch | Blueprint W13 |
| Client-side (end-to-end) encryption for journal and vault, with a recovery kit | V1.1 — deliberately not shipped without recovery, because a lost key means lost data |

### What we do not claim

We do not claim end-to-end encryption today. Our systems can technically read the content we store, which is why access is restricted, logged, and limited to support you request or law requires.

Report a vulnerability: `{{SECURITY_EMAIL}}`. Please do not test against other people's accounts.

---

## L4 — Data Deletion & Export

**Effective:** `{{EFFECTIVE_DATE}}`

### Export — always available

**Account → Privacy → Export.** You get a JSON file containing every record we hold about you, plus your uploaded files. Large accounts are prepared in the background and delivered as a download link that expires in 7 days. There is no charge and no limit on how often you export.

### Three levels of deletion

| Level | What it does | Where | Reversible? |
|-------|--------------|-------|-------------|
| **Delete a record** | Removes a single entry | Anywhere in the app | 30-day recycle bin for journal, notes, documents, people, transactions; import batches can be undone in one tap |
| **Delete a domain** | Removes everything in one area — money, English, health, contacts, documents, or journal — while keeping the rest | Account → Privacy | No |
| **Delete your account** | Removes your account and all life data | Account → Privacy → Delete account, confirmed by typing `DELETE` | No |

There is also **Wipe life data**, which clears your life records but keeps your login — useful if you want to start clean. It is confirmed by typing `WIPE ALL DATA`.

### Timeline

Access revoked and third-party tokens (including Google) revoked **immediately**; removal from live systems within **7 days**; removal from encrypted backups within **30 days**. We keep only what the law obliges us to keep — billing invoices and consent/processing records — and never your life content.

### Deleting via Google

Revoking AIIMIN at [myaccount.google.com/permissions](https://myaccount.google.com/permissions) stops all Google access immediately. It does not delete your AIIMIN account; use the in-app option or email `{{PRIVACY_EMAIL}}` with the subject "Account Deletion Request" from your registered address.

### If you cannot sign in

Email `{{PRIVACY_EMAIL}}` from your registered email. We will verify you and complete the deletion within 7 days, and confirm in writing.

---

## L5 — Cookie & Local Storage Policy

**Effective:** `{{EFFECTIVE_DATE}}`

AIIMIN uses very little. There is no advertising network, no third-party tracking pixel, and no cross-site tracking anywhere on our website or in our app.

| Name / kind | Type | Purpose | Consent needed | Lifetime |
|-------------|------|---------|----------------|----------|
| `aiimin_session`, `better-auth.session_token` | Cookie | Keep you signed in | No — strictly necessary | Session / 7 days |
| CSRF / state values used during sign-in | Cookie | Prevent request forgery and OAuth replay | No — strictly necessary | Minutes |
| Theme, font scale, density, navigation pins | Local storage | Remember how you like the interface | No — strictly necessary for your preference | Until you clear it |
| Offline queue and cached reads | IndexedDB / app database | Let you work offline and see your data quickly | No — strictly necessary | Until synced or cleared |
| `aiimin_waitlist`, referral code | Local / session storage | Remember that you joined the waitlist, and credit a referral | No | 90 days |
| Product analytics (Google Analytics 4) | Cookie + local storage | Understand which features are used, and where the product fails | **Yes — off until you consent** | Up to 14 months |
| Error reporting (Sentry) | Local storage | Diagnose crashes | **Yes — off until you consent** | Session |

**Controls.** Analytics and error reporting are off until you consent, and you can change your mind at any time in **Account → Privacy** or via the cookie banner on the website. Blocking strictly necessary cookies will stop sign-in from working. Your browser also lets you clear everything we stored locally.

---

## L6 — Acceptable Use Policy

**Effective:** `{{EFFECTIVE_DATE}}`

AIIMIN is a private tool for your own life. Nearly everything is allowed. These are the limits.

**Do not:**

1. Use AIIMIN for anything illegal, or to store material whose possession is illegal.
2. Store or process other people's personal data without a lawful basis — that includes documents, health information, and contact details.
3. Attempt to access another account, or any data that is not yours.
4. Probe, scan, or attack the service, or bypass rate limits, quotas, tier gates, or payment.
5. Automate the service in ways that degrade it for others, or resell access.
6. Reverse engineer to extract our source or credentials, except where the law expressly allows it.
7. Use AI features to generate content that is unlawful, that harasses or defames a person, or that impersonates someone.
8. Upload malware, or content designed to break the document viewer or the parser.
9. Misrepresent your identity or age.
10. Use AIIMIN as a system of record for anything safety-critical, or as a substitute for professional medical, legal, or financial advice.

**Enforcement.** Depending on severity we may warn you, restrict a feature, suspend the account, or terminate it. We will tell you why, and you can appeal to `{{GRIEVANCE_EMAIL}}`. Where we must act immediately to protect users or the service, we act first and explain after. Suspension does not remove your right to export your data.

---

## L7 — Refund, Billing & Cancellation Policy

**Effective:** `{{EFFECTIVE_DATE}}` · `{{LEGAL_ENTITY}}`, `{{REGISTERED_ADDRESS}}`, GSTIN `{{GSTIN}}`

### Plans

| Plan | List price | Founding price | Billing |
|------|-----------|----------------|---------|
| Explore | Free | — | — |
| Core | ₹29 / month | Complimentary for waitlist members at launch, for the stated period | Monthly |
| Pro | ₹59 / month | ₹49 / month | Monthly |
| Elite | ₹99 / month | ₹79 / month | Monthly |

Prices are in Indian Rupees. Taxes are applied as required and shown at checkout. AIIMIN is a digital service delivered immediately on payment; there is nothing to ship.

### Fulfilment

Access to the plan's features is enabled on your account **immediately** after a successful payment, on every surface you sign in to. If it is not, contact `{{SUPPORT_EMAIL}}` and we will fix or refund it.

### Renewal and cancellation

Subscriptions renew automatically each month until you cancel. **Cancel any time** in Account → Subscription (or, for purchases made through Google Play, in your Play subscriptions). Cancellation stops the next charge; your plan stays active until the end of the period you already paid for. Cancelling never deletes your data — features simply become read-only, and export stays available.

### Refunds

1. **7-day goodwill refund.** If you are unhappy within 7 days of your first paid charge on a plan, email `{{SUPPORT_EMAIL}}` and we will refund it in full. No argument.
2. **Service failure.** If a paid feature was unavailable or materially broken for a meaningful part of a billing period, we refund or credit that period pro rata.
3. **Accidental or duplicate charge.** Refunded in full.
4. **Mid-period cancellation.** Not refunded by default (you keep access to the period end), except under 1–3 above.
5. **Store purchases.** Purchases made through Google Play follow Google's refund process; we will also help directly.

Approved refunds are issued to the original payment method within **5–7 business days** of approval, subject to your bank's timelines. We do not charge a processing fee for refunds.

### Failed payments

If a charge fails we retry and tell you. You keep full access for a **7-day grace period** — we do not lock you out of your own life data. After that, paid features become read-only until payment succeeds. Your data is never deleted for non-payment.

### Price changes

At least 30 days' notice in-app and by email, effective from a future billing period. Founding rates are honoured as described at the time you subscribed, for as long as the subscription remains continuously active.

### Chargebacks

Please talk to us first at `{{SUPPORT_EMAIL}}` — it is faster. If a chargeback is raised, the plan reverts to Explore while we investigate; your data remains intact.

---

## L8 — AI Disclosure

**Effective:** `{{EFFECTIVE_DATE}}`

### What the AI does

AIIMIN uses AI in exactly five roles, and never more:

| Role | What it does | Example |
|------|--------------|---------|
| **Router** | Reads a sentence you typed and works out which part of the product it belongs to | "lent Rahul 500" → a lending record |
| **Inferencer** | Fills in fields when it is reasonably sure | amount ₹500, person Rahul |
| **Analyzer** | Enriches what you already saved | suggesting a category for a transaction, analysing your practice transcript |
| **Coach** | Writes summaries and suggestions | your weekly insight |
| **Composer** | Drafts text you asked for | goal milestones, a rewritten sentence in a practice scorecard |

### Rules the AI operates under

1. **Your writing is saved before the AI touches it.** If the AI fails, nothing is lost.
2. **It suggests; you commit.** Anything below high confidence is shown for confirmation. Below low confidence it asks a question instead of guessing.
3. **It never guesses safety-relevant facts** — medications, allergies, medical conditions, or anything legal. It asks.
4. **It never changes** your permissions, your plan, your payment details, or deletes anything.
5. **It never posts anything anywhere.** There is nowhere to post to.
6. **You can see where it came from.** Every suggestion and insight shows its source, and every AI-touched record is marked.
7. **You can turn it off.** One switch in Account → Personalization disables all AI calls. The product keeps working; features that would have used AI say so.

### Which providers, and what they get

We use third-party model providers (currently Google Gemini, Groq, and OpenRouter-routed models — the current list is at `/subprocessors`). We send the **minimum text needed** for the task, without your name, email, OS-ID, or phone number. Journal content is sent **only** when you press an AI action on that specific entry. We require our providers not to retain prompt content beyond what is needed to answer, and not to train models on it.

### Limits you should know

AI output can be wrong, incomplete, or confidently mistaken. It is **not** medical, psychological, legal, financial, or tax advice. It does not diagnose. If you are in distress, please contact a qualified professional or a local helpline — AIIMIN will show you resources but is not a crisis service.

Practice scoring (including the AIIMIN English Index) is an **estimate** produced by software, calibrated against published proficiency bands. It is not an official language certification and no institution is obliged to accept it.

### Human oversight

You are the human in the loop by design: every AI action is visible, correctable, and reversible. Nothing runs on a schedule without your having switched it on.

---

## L9 — Grievance Redressal & Your Rights

**Effective:** `{{EFFECTIVE_DATE}}` · Published under the DPDP Act 2023 and DPDP Rules 2025.

### Grievance Officer

`{{GRIEVANCE_OFFICER_NAME}}` · `{{GRIEVANCE_EMAIL}}` · `{{LEGAL_ENTITY}}`, `{{REGISTERED_ADDRESS}}`

This is the person who will answer questions about how we process your personal data.

### How to raise a grievance

Email `{{GRIEVANCE_EMAIL}}` from your registered address with: what happened, what you want us to do, and your OS-ID or account email. If you cannot email, write to the postal address above.

### What we promise

| Stage | Timeline |
|-------|----------|
| Acknowledgement | 3 working days |
| Substantive response | **7 working days target**; 90 days maximum as required by the DPDP Rules |
| Escalation if unresolved | We will tell you how to complain to the Data Protection Board of India |

### Exercising your rights directly

Most rights are self-service and instant, inside the app:

- **Access / portability** — Account → Privacy → Export
- **Correction** — edit the record; anything locked, email us
- **Erasure** — Account → Privacy → Delete a domain, Wipe life data, or Delete account
- **Withdraw consent** — Account → Privacy toggles
- **See what we hold and who touched it** — Account → Privacy dashboard and activity log

### Nomination

Under section 14 of the DPDP Act you may nominate a person to exercise your rights if you die or become incapable of exercising them. Email `{{GRIEVANCE_EMAIL}}` with the nominee's name and contact details and we will record it against your account.

### Complaining to the Board

If we do not resolve your grievance, you may complain to the **Data Protection Board of India**. Users in the EEA/UK may instead complain to their local supervisory authority.

---

## L10 — Subprocessors & Third Parties

**Effective:** `{{EFFECTIVE_DATE}}` · We will update this page before adding a subprocessor that processes personal data.

| Provider | Purpose | Data involved | Region |
|----------|---------|---------------|--------|
| Amazon Web Services | Application hosting, object storage, queues | All service data | India (ap-south-1) |
| Supabase (managed PostgreSQL) | Primary database | All service data | India region |
| Vercel | Website and web app hosting/CDN | Request metadata; static assets | Global edge |
| Google LLC | Sign-in (if you choose it); Calendar / Tasks / Drive / People APIs (if you connect them) | Google user data you authorised | Global |
| Google Gemini | AI tasks | Minimised prompt text | Global |
| Groq | AI tasks | Minimised prompt text | Global |
| OpenRouter | AI routing fallback | Minimised prompt text | Global |
| Resend | Transactional email | Email address, message content | Global |
| Upstash (Redis) | Rate limiting, caching | Technical identifiers | India / global |
| Stripe and/or Google Play Billing | Payments | Billing details handled by the processor; we never see your full card number | Global |
| Google Analytics 4 | Product analytics — **only with consent** | Event counts, pseudonymous id | Global |
| Sentry | Error reporting — **only with consent** | Error context, scrubbed | Global |

We require each provider by contract to process data only on our instructions, to keep it secure, and not to use it for their own purposes. Where transfers of EEA/UK data occur, Standard Contractual Clauses apply.

**Force majeure.** We are not liable for failures caused by events outside our reasonable control, including provider outages, network failures, government action, or natural disaster. We will communicate honestly and restore service as quickly as we can.

---

## L11 — Legal Hub (`/legal`)

A single index page listing all documents above with their effective dates, plus:
- a one-paragraph plain-language summary of each,
- links to the in-app Privacy dashboard and Export,
- the Grievance Officer block,
- an archive of superseded versions.

Footer on every public page links to: Privacy · Terms · Security · Data Deletion · Cookies · Acceptable Use · Refunds · AI Disclosure · Grievance · Contact · About. Currently the waitlist footer links only four of these — that is a compliance gap, not a design choice.

---

## L12 — About (rewrite brief)

The current page says AIIMIN is "a personal project, not commercial, access limited to the creator." That is now **false and legally risky**, because the same site sells four subscription tiers. Rewrite to state: what AIIMIN is, who builds it (`{{LEGAL_ENTITY}}`), that it is a paid product with a free tier, the four trust commitments from L1 §1, and links to the legal hub.

## L13 — Contact (rewrite brief)

Must carry: entity name, registered address, support email, privacy email, security email, Grievance Officer name and email, and response targets. Remove `you@example.com`.

---

## 10. Google Play Data safety mapping

The Data safety form must match L1 exactly. This table is the source for filling it.

| Data type | Collected | Shared | Purpose | Optional? | Encrypted in transit | Deletable |
|-----------|-----------|--------|---------|-----------|----------------------|-----------|
| Name, email | Yes | No | Account management, app functionality | No | Yes | Yes |
| User IDs (OS-ID) | Yes | No | Account management | No | Yes | Yes |
| Photos (profile, document scans) | Yes | No | App functionality | Yes | Yes | Yes |
| Files and docs | Yes | No | App functionality | Yes | Yes | Yes |
| Calendar events | Yes | No | App functionality | Yes | Yes | Yes |
| Contacts | Yes | No | App functionality | Yes | Yes | Yes |
| Health and fitness (steps, distance, sleep) | Yes | No | App functionality | Yes | Yes | Yes |
| App activity / interactions | Yes | No | Analytics — **only with consent** | Yes | Yes | Yes |
| Financial info (user-entered transactions) | Yes | No | App functionality | Yes | Yes | Yes |
| Audio (voice practice) | **Not collected by default** — processed on device | No | App functionality | Yes | Yes | Yes |
| Crash logs, diagnostics | Yes | No | Crash reporting — **only with consent** | Yes | Yes | Yes |
| Location | **No** | — | — | — | — | — |
| SMS / call logs | **No** | — | — | — | — | — |
| Contacts uploaded in bulk | **No** | — | — | — | — | — |

Also required: "Data is encrypted in transit" = Yes; "You can request that data be deleted" = Yes, with `/data-deletion` as the URL; Health apps declaration form completed; account-deletion URL provided for the Play listing.

---

## 11. Permission design corrections forced by policy

### 11.1 Why this section exists

Blueprint §8.6.2 as first drafted assumed reading UPI **SMS** on Android. Google Play's restricted-permission policy does not allow that for an app like AIIMIN. This section replaces that design. **The Blueprint has been amended accordingly (§27).**

### 11.2 SMS: not available — use these instead

**Policy fact:** the SMS permission group (`READ_SMS`, `RECEIVE_SMS`, and siblings) is only granted to apps that are **actively registered as the device's default SMS or Assistant handler**, and only for core functionality. Google also prohibits deriving the same data through alternative methods declared as a workaround. AIIMIN is not, and should not become, a default SMS handler.

**Therefore AIIMIN V1 must not declare any SMS permission.** Four compliant paths deliver the same product value:

| Path | How it works | Policy posture | Effort |
|------|--------------|----------------|--------|
| **A. Notification reading** (`NotificationListenerService`) opt-in | Reads payment alert notifications from bank/UPI apps, matched on-device against a template list; raw text never leaves the device; only the draft you approve is saved | Allowed, but is sensitive data: needs prominent in-app disclosure before the system settings hand-off, a core-functionality justification, no ads use, and Data safety declaration. Must be **off by default** and independently revocable | Medium |
| **B. Share-to-AIIMIN** | You share a payment confirmation (text or screenshot) from any app into AIIMIN; it parses and drafts | No sensitive permission at all; user-initiated every time | Low — **ship first** |
| **C. Statement import** | Upload bank CSV/PDF, parse, confirm queue, one-tap undo of the whole batch | No sensitive permission | Low — already partly built |
| **D. RBI Account Aggregator** | Consent-based, regulated bank data via a licensed AA (Finvu/Setu/OneMoney class) | The legitimate long-term path in India; requires an FIU relationship and consent-artefact handling | High — **V1.1+** |

**Recommended V1 shape:** ship **B + C** as the default experience for everyone, offer **A** as an explicitly opt-in accelerator with the full disclosure sheet, and put **D** on the V1.1 roadmap. Marketing must never claim "reads your SMS".

### 11.3 Health Connect

Declare only the read permissions actually used: steps, distance, active minutes, sleep duration. Do **not** request background read or 30-day history unless a feature genuinely needs it (V1 does not — daily foreground sync is enough). Complete the Play **Health apps declaration form**, and make sure the privacy policy names Health Connect data explicitly, which L1 §3.4 does. Health data must not be used for ads, and must not be shared.

### 11.4 Usage stats (screen time)

`PACKAGE_USAGE_STATS` is a special-access permission granted through system settings, not a runtime prompt. Requirements: explain in-app before sending the user to settings; store only the daily total (plus categories if opted in); never upload per-app minute histories; provide a one-switch off.

### 11.5 Permissions AIIMIN will not request in V1

Location (any precision) · call log · SMS group · reading other apps' storage broadly · accessibility service · device admin · full contact-book read without a picker.

### 11.6 Prominent-disclosure copy (reusable, required by Play)

> **Before you turn this on**
> AIIMIN reads *[exact data]* to *[exact feature]*.
> It never reads *[the excluded thing]*.
> *[Where it is stored, and for how long.]*
> You can turn this off any time in Account → Privacy, and delete what was collected.
> [Not now] [Continue]

Both buttons must be equally prominent. "Not now" must never be a dead end.

---

## 12. Website implementation checklist

| # | Change | File(s) |
|---|--------|---------|
| 1 | Rewrite Privacy with L1 text | `frontend/src/pages/legal/Privacy.jsx` |
| 2 | Rewrite Terms with L2 | `legal/Terms.jsx` |
| 3 | Rewrite Security with L3 | `legal/Security.jsx` |
| 4 | Rewrite Data Deletion with L4 | `legal/DataDeletion.jsx` |
| 5 | New Cookie Policy | `legal/Cookies.jsx` + route `/cookies` |
| 6 | New Acceptable Use | `legal/AcceptableUse.jsx` + `/acceptable-use` |
| 7 | New Refunds | `legal/Refunds.jsx` + `/refunds` |
| 8 | New AI Disclosure | `legal/AiDisclosure.jsx` + `/ai-disclosure` |
| 9 | New Grievance | `legal/Grievance.jsx` + `/grievance` |
| 10 | New Subprocessors | `legal/Subprocessors.jsx` + `/subprocessors` |
| 11 | New Legal hub | `legal/LegalHub.jsx` + `/legal` |
| 12 | Rewrite About (remove "non-commercial") | `legal/About.jsx` |
| 13 | Rewrite Contact (add grievance officer) | `legal/Contact.jsx` |
| 14 | Add `<Helmet>` per legal page (title, description, canonical, `robots: index,follow`) | all legal pages |
| 15 | Footer: link all legal pages | `components/waitlist/.../WaitlistFooter.jsx` |
| 16 | Consent checkbox on waitlist form linking Privacy + Terms | `WaitlistForm.jsx` |
| 17 | Cookie/analytics consent banner; GA4 and Sentry must not initialise before consent | new `components/system/ConsentBanner.jsx`, `usePageAnalytics.js` |
| 18 | Fix `robots.txt` and `sitemap.xml` domain `aiimin.app` → `aiimin.in`; add all legal routes | `frontend/public/` |
| 19 | Delete or redirect the stale standalone `frontend/public/privacy.html` (duplicate content, different styling, conflicting claims) | `frontend/public/privacy.html` |
| 20 | Account → Legal section: link the full set | `pages/account/sections/LegalSection.jsx` |
| 21 | Single `LEGAL_CONTACTS` constant so emails/entity appear once in code | new `frontend/src/constants/legal.js` |

---

## 13. Review cadence

| Trigger | Action |
|---------|--------|
| New data type, new permission, new subprocessor, new AI provider | Update L1 + L10 + Play Data safety **in the same unit of work** as the code |
| Price or plan change | Update L7 + waitlist data + in-app tier copy together |
| Any launch | Re-read §0.3 claim discipline against live copy |
| Quarterly | Confirm effective dates, subprocessor list, and retention table are still true |
| Before public launch | Counsel review; fill every `{{PLACEHOLDER}}`; Play declarations submitted; DPDP grievance channel live and tested end-to-end |
