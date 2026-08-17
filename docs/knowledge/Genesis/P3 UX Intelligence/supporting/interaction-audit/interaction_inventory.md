# AIIMIN — Interaction Inventory

**Total documented interactions:** 578

Full schema per interaction. Grouped by feature range.

---


## Auth & Waitlist

### INT-001

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Login /login |
| **Trigger** | Click/Navigation |
| **Purpose** | Google OAuth button |
| **User Goal** | Create account or sign in without password |
| **Flow** | Get into app fast |
| **Interaction Count** | Land Login → Click Continue with Google → OAuth → Callback |
| **User Input Required** | 1 click + OAuth |
| **Input Type** | Google account choice |
| **Could be inferred?** | OAuth redirect |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | One-click passkeys |

### INT-002

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Login /login |
| **Trigger** | Click/Navigation |
| **Purpose** | Email signup toggle |
| **User Goal** | Switch to email registration |
| **Flow** | Register without Google |
| **Interaction Count** | Login → Click Sign up with email → fill form |
| **User Input Required** | 3 clicks + typing |
| **Input Type** | email, password, confirm |
| **Could be inferred?** | Free text + boolean |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 5 |
| **Memory Load (1-10)** | 4 |
| **Context Switching** | 3 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | Social-only default |

### INT-003

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Login /login |
| **Trigger** | Click/Navigation |
| **Purpose** | PIN create (4 digit) |
| **User Goal** | Secondary auth layer |
| **Flow** | Secure account quickly |
| **Interaction Count** | Signup → Enter 4 digits → Confirm 4 digits |
| **User Input Required** | 8 taps |
| **Input Type** | PIN x2 |
| **Could be inferred?** | Numpad |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 6 |
| **Memory Load (1-10)** | 5 |
| **Context Switching** | 4 |
| **Interruptible** | NO |
| **Postponable** | NO |
| **Auto-recoverable** | NO |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Biometric |

### INT-004

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Login /login |
| **Trigger** | Click/Navigation |
| **Purpose** | Email signin submit |
| **User Goal** | Returning user login |
| **Flow** | Access existing data |
| **Interaction Count** | Toggle signin → email+password → Submit |
| **User Input Required** | 2 fields + 1 click |
| **Input Type** | email, password |
| **Could be inferred?** | Free text |
| **Friction (1-10)** | Partial (email history) |
| **Decision Fatigue (1-10)** | 4 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | 3 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Passkey |

### INT-005

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | AuthCallback /auth/callback |
| **Trigger** | Click/Navigation |
| **Purpose** | OAuth redirect wait |
| **User Goal** | Complete OAuth |
| **Flow** | Finish Google login |
| **Interaction Count** | Auto redirect processing |
| **User Input Required** | 0 user actions |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | YES (OAuth token) |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | NO |
| **Postponable** | NO |
| **Auto-recoverable** | NO |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Silent refresh |

### INT-006

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | VerifyEmail /verify-email |
| **Trigger** | Click/Navigation |
| **Purpose** | Resend verification |
| **User Goal** | Get verification email |
| **Flow** | Unlock app |
| **Interaction Count** | Click resend → check email |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 4 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 3 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | Auto-verify domain |

### INT-007

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | VerifyEmail /verify-email |
| **Trigger** | Click/Navigation |
| **Purpose** | Check inbox CTA |
| **User Goal** | Guide user to email client |
| **Flow** | Verify email |
| **Interaction Count** | Read instructions → open email |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 2 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Deep link verify |

### INT-008

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Onboarding /onboarding step 0 |
| **Trigger** | Click/Navigation |
| **Purpose** | Full name Continue |
| **User Goal** | Collect display name |
| **Flow** | Personalize dashboard |
| **Interaction Count** | Enter name → Continue |
| **User Input Required** | 1 field + 1 click |
| **Input Type** | fullName |
| **Could be inferred?** | Free text |
| **Friction (1-10)** | Partial (Google profile) |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | Prefill OAuth name |

### INT-009

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Onboarding /onboarding step 1 |
| **Trigger** | Click/Navigation |
| **Purpose** | Username + availability |
| **User Goal** | Unique handle |
| **Flow** | Identity in product |
| **Interaction Count** | Type username → wait check → Continue |
| **User Input Required** | 1 field + 1 click |
| **Input Type** | username |
| **Could be inferred?** | Free text |
| **Friction (1-10)** | Partial (email prefix) |
| **Decision Fatigue (1-10)** | 5 |
| **Memory Load (1-10)** | 4 |
| **Context Switching** | 3 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | Suggest available names |

### INT-010

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Onboarding /onboarding step 2-3 |
| **Trigger** | Click/Navigation |
| **Purpose** | 6-digit PIN setup |
| **User Goal** | App lock PIN |
| **Flow** | Quick re-auth |
| **Interaction Count** | Enter PIN → confirm PIN |
| **User Input Required** | 12 taps |
| **Input Type** | pin, confirmPin |
| **Could be inferred?** | Numpad |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 7 |
| **Memory Load (1-10)** | 6 |
| **Context Switching** | 5 |
| **Interruptible** | NO |
| **Postponable** | NO |
| **Auto-recoverable** | NO |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Biometric opt-in |

### INT-011

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Onboarding /onboarding step 4 |
| **Trigger** | Click/Navigation |
| **Purpose** | Goal chip multi-select |
| **User Goal** | Seed goals |
| **Flow** | Start with relevant goals |
| **Interaction Count** | Tap ≥1 goal chips → Continue |
| **User Input Required** | 1-N clicks + 1 |
| **Input Type** | selectedGoals[] |
| **Could be inferred?** | Multiple choice |
| **Friction (1-10)** | Partial (persona) |
| **Decision Fatigue (1-10)** | 5 |
| **Memory Load (1-10)** | 6 |
| **Context Switching** | 4 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | Infer from onboarding persona |

### INT-012

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Onboarding /onboarding step 5 |
| **Trigger** | Click/Navigation |
| **Purpose** | Habit chip multi-select |
| **User Goal** | Seed habits |
| **Flow** | Start tracking immediately |
| **Interaction Count** | Tap ≥1 habit chips → Continue |
| **User Input Required** | 1-N clicks + 1 |
| **Input Type** | selectedHabits[] |
| **Could be inferred?** | Multiple choice |
| **Friction (1-10)** | Partial (goals) |
| **Decision Fatigue (1-10)** | 5 |
| **Memory Load (1-10)** | 6 |
| **Context Switching** | 4 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | Suggest from goals |

### INT-013

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Onboarding /onboarding step 6 |
| **Trigger** | Click/Navigation |
| **Purpose** | Wake time picker |
| **User Goal** | Morning routine anchor |
| **Flow** | Align notifications/reminders |
| **Interaction Count** | Pick time → Continue |
| **User Input Required** | 1 select + 1 click |
| **Input Type** | wakeTime |
| **Could be inferred?** | Time |
| **Friction (1-10)** | YES (calendar, sleep logs) |
| **Decision Fatigue (1-10)** | 4 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | 3 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | Infer from first app open |

### INT-014

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Onboarding /onboarding step 7 |
| **Trigger** | Click/Navigation |
| **Purpose** | Life Arc editor |
| **User Goal** | North star statement |
| **Flow** | Define purpose |
| **Interaction Count** | Type arc → Save → Continue |
| **User Input Required** | Typing + 2 clicks |
| **Input Type** | lifeArc text |
| **Could be inferred?** | Free text |
| **Friction (1-10)** | Partial (goals/habits) |
| **Decision Fatigue (1-10)** | 6 |
| **Memory Load (1-10)** | 5 |
| **Context Switching** | 5 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | Partial (draft) |
| **Improvements** | Partial |
| **Related Components** | Generate from selections |

### INT-015

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Onboarding /onboarding step 8 |
| **Trigger** | Click/Navigation |
| **Purpose** | Finish / Go to dashboard |
| **User Goal** | Complete onboarding |
| **Flow** | Start using product |
| **Interaction Count** | Click Get Started |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | NO |
| **Postponable** | NO |
| **Auto-recoverable** | NO |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Auto-redirect |

### INT-016

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Waitlist / |
| **Trigger** | Click/Navigation |
| **Purpose** | Waitlist email submit |
| **User Goal** | Join waitlist |
| **Flow** | Get early access |
| **Interaction Count** | Enter email → Submit |
| **User Input Required** | 1-2 fields + 1 click |
| **Input Type** | email, name? |
| **Could be inferred?** | Free text |
| **Friction (1-10)** | Partial (browser autofill) |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Google one-tap |

### INT-017

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Waitlist / |
| **Trigger** | Click/Navigation |
| **Purpose** | Pricing tier select |
| **User Goal** | Express interest tier |
| **Flow** | Signal willingness to pay |
| **Interaction Count** | Click Pro/Ultra cards |
| **User Input Required** | 1 click |
| **Input Type** | selectedPricing |
| **Could be inferred?** | Multiple choice |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 4 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Default recommendation |

### INT-018

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Waitlist / |
| **Trigger** | Click/Navigation |
| **Purpose** | FAQ accordion expand |
| **User Goal** | Learn product |
| **Flow** | Decide to join |
| **Interaction Count** | Click question rows |
| **User Input Required** | 1 click each |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-019

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Waitlist / |
| **Trigger** | Click/Navigation |
| **Purpose** | Theme toggle |
| **User Goal** | Preview light/dark |
| **Flow** | Visual preference |
| **Interaction Count** | Click theme control |
| **User Input Required** | 1 click |
| **Input Type** | theme |
| **Could be inferred?** | Boolean |
| **Friction (1-10)** | YES (system pref) |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | YES |
| **Improvements** | Partial |
| **Related Components** | Respect OS |

### INT-020

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | FeedbackWidget global |
| **Trigger** | Click/Navigation |
| **Purpose** | Open feedback FAB |
| **User Goal** | Send product feedback |
| **Flow** | Report issue/idea |
| **Interaction Count** | Click FAB → modal |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | Context auto-attach |

### INT-021

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | FeedbackWidget global |
| **Trigger** | Click/Navigation |
| **Purpose** | Submit feedback |
| **User Goal** | Deliver feedback |
| **Flow** | Be heard |
| **Interaction Count** | Category + message → Send |
| **User Input Required** | 2 fields + 1 click |
| **Input Type** | message, category |
| **Could be inferred?** | Free text + dropdown |
| **Friction (1-10)** | Partial (page context) |
| **Decision Fatigue (1-10)** | 4 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | 2 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | Pre-fill route |

### INT-022

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Legal /privacy /terms etc |
| **Trigger** | Click/Navigation |
| **Purpose** | Read legal doc |
| **User Goal** | Understand policies |
| **Flow** | Trust/compliance |
| **Interaction Count** | Scroll + read links |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-023

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Legal /contact |
| **Trigger** | Click/Navigation |
| **Purpose** | Contact mailto/link |
| **User Goal** | Reach support |
| **Flow** | Get help |
| **Interaction Count** | Click email/link |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | In-app form |

### INT-024

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-025

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-026

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-027

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-028

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-029

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-030

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-031

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-032

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-033

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-034

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-035

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-036

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-037

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-038

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-039

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-040

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-041

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-042

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-043

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-044

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-045

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-046

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-047

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |

### INT-048

| Attribute | Value |
|-----------|-------|
| **Feature** | Auth & Waitlist |
| **Location** | Brand /brand |
| **Trigger** | Click/Navigation |
| **Purpose** | View brand assets |
| **User Goal** | Marketing reference |
| **Flow** | Understand brand |
| **Interaction Count** | Scroll gallery |
| **User Input Required** | Scroll |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | — |


## Global Shell

### INT-049

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | Navbar |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Pinned route link click |
| **User Goal** | Primary navigation |
| **Flow** | Go to feature |
| **Interaction Count** | Click nav item → route change |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | Navigation |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Navbar.jsx |

### INT-050

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | Navbar |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | More dropdown open |
| **User Goal** | Overflow nav |
| **Flow** | Reach gated routes |
| **Interaction Count** | Click More → select route |
| **User Input Required** | 2 clicks |
| **Input Type** | route |
| **Could be inferred?** | Dropdown |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Navbar |

### INT-051

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | Navbar |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Avatar → Account |
| **User Goal** | Account access |
| **Flow** | Manage profile |
| **Interaction Count** | Click avatar |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | Navigation |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Navbar |

### INT-052

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | Navbar mobile |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Hamburger open drawer |
| **User Goal** | Mobile nav |
| **Flow** | Navigate on phone |
| **Interaction Count** | Tap menu → tap link |
| **User Input Required** | 2 taps |
| **Input Type** | route |
| **Could be inferred?** | Drawer |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Navbar drawer |

### INT-053

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | BottomNav mobile |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Tab tap (4 pinned) |
| **User Goal** | Quick mobile nav |
| **Flow** | Switch core features |
| **Interaction Count** | Tap tab icon |
| **User Input Required** | 1 tap |
| **Input Type** | route |
| **Could be inferred?** | Navigation |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | BottomNav |

### INT-054

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | BottomNav mobile |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | More sheet |
| **User Goal** | Secondary routes |
| **Flow** | Reach all features |
| **Interaction Count** | Tap More → pick route |
| **User Input Required** | 2 taps |
| **Input Type** | route |
| **Could be inferred?** | Sheet |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | BottomNav |

### INT-055

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | CommandPalette |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | ⌘/Ctrl+K open |
| **User Goal** | Universal launcher |
| **Flow** | Act without mouse |
| **Interaction Count** | Keyboard chord |
| **User Input Required** | 1 key chord |
| **Input Type** | search query |
| **Could be inferred?** | Keyboard |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | CommandPalette |

### INT-056

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | CommandPalette |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Search filter actions |
| **User Goal** | Find action fast |
| **Flow** | Locate feature |
| **Interaction Count** | Type query → arrow → Enter |
| **User Input Required** | Typing + keys |
| **Input Type** | search |
| **Could be inferred?** | Free text |
| **Friction (1-10)** | Partial (recent) |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | CommandPalette |

### INT-057

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | CommandPalette |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Navigate action |
| **User Goal** | Jump to route |
| **Flow** | Open feature |
| **Interaction Count** | Select nav_* action |
| **User Input Required** | 2-3 keys |
| **Input Type** | — |
| **Could be inferred?** | Navigation |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | ALL_ACTIONS nav |

### INT-058

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | CommandPalette |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Smart AI Log |
| **User Goal** | NL capture |
| **Flow** | Log without forms |
| **Interaction Count** | Select ai_log → type/voice → Enter |
| **User Input Required** | Typing/voice |
| **Input Type** | free text |
| **Could be inferred?** | Free text + voice |
| **Friction (1-10)** | Partial (context) |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Full |
| **Related Components** | CommandPalette F-015 |

### INT-059

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | CommandPalette |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Log Win inline |
| **User Goal** | Quick win |
| **Flow** | Celebrate progress |
| **Interaction Count** | Select → type → Enter |
| **User Input Required** | Typing |
| **Input Type** | win text |
| **Could be inferred?** | Free text |
| **Friction (1-10)** | Partial (journal) |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | CommandPalette |

### INT-060

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | CommandPalette |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Log Note inline |
| **User Goal** | Quick note |
| **Flow** | Capture thought |
| **Interaction Count** | Select → type → Enter |
| **User Input Required** | Typing |
| **Input Type** | note text |
| **Could be inferred?** | Free text |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | CommandPalette |

### INT-061

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | CommandPalette |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Voice Log |
| **User Goal** | Hands-free capture |
| **Flow** | Log while busy |
| **Interaction Count** | Select → mic → speak → save |
| **User Input Required** | Voice |
| **Input Type** | transcript |
| **Could be inferred?** | Voice |
| **Friction (1-10)** | Partial (STT) |
| **Decision Fatigue (1-10)** | 4 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Full |
| **Related Components** | CommandPalette |

### INT-062

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | CommandPalette |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Check Mood 1-10 |
| **User Goal** | Mood capture |
| **Flow** | Track feeling |
| **Interaction Count** | Select → pick mood emoji |
| **User Input Required** | 2 clicks |
| **Input Type** | mood 1-10 |
| **Could be inferred?** | Multiple choice |
| **Friction (1-10)** | YES (text/voice prior) |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 4 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | MoodTracker, Journal |

### INT-063

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | UniversalLogger |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Space→L chord open |
| **User Goal** | Fast daily log |
| **Flow** | Log from anywhere |
| **Interaction Count** | Space then L → type → save |
| **User Input Required** | Chord + typing |
| **Input Type** | log text |
| **Could be inferred?** | Free text |
| **Friction (1-10)** | Partial (AI) |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | Partial |
| **Improvements** | Partial |
| **Related Components** | loggerShortcut.js |

### INT-064

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | ProductTour |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Tour step next |
| **User Goal** | Learn product |
| **Flow** | Understand features |
| **Interaction Count** | Click Next on spotlight |
| **User Input Required** | 1 click x steps |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 2 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | YES |
| **Improvements** | No |
| **Related Components** | ProductTour |

### INT-065

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | GuestTour |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Guest explore CTA |
| **User Goal** | Try before signup |
| **Flow** | Evaluate product |
| **Interaction Count** | Follow tour → Sign up |
| **User Input Required** | Multiple clicks |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | GuestTour |

### INT-066

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | Guest banner |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Sign Up CTA |
| **User Goal** | Convert guest |
| **Flow** | Save data permanently |
| **Interaction Count** | Click Sign Up |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | Navigation |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | DashboardLayout |

### INT-067

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | NotificationBell |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Open notifications |
| **User Goal** | See alerts |
| **Flow** | Stay informed |
| **Interaction Count** | Click bell → list |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | Dropdown |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 2 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | NotificationBell |

### INT-068

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | NotificationBell |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Mark read / dismiss |
| **User Goal** | Clear inbox |
| **Flow** | Reduce noise |
| **Interaction Count** | Click item actions |
| **User Input Required** | 1-2 clicks |
| **Input Type** | — |
| **Could be inferred?** | Boolean |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | NotifDropdown |

### INT-069

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | TierRouteGuard |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Blocked route attempt |
| **User Goal** | Upsell gate |
| **Flow** | Access premium feature |
| **Interaction Count** | Navigate → upgrade modal |
| **User Input Required** | 1 nav + modal |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 4 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | 2 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | FeatureGate |

### INT-070

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | InstallPrompt |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Add to home screen |
| **User Goal** | PWA install |
| **Flow** | Mobile app-like access |
| **Interaction Count** | Click install |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | InstallPrompt |

### INT-071

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | GlobalMusicPlayer |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Play/pause ambient |
| **User Goal** | Focus audio |
| **Flow** | Background sound |
| **Interaction Count** | Click transport |
| **User Input Required** | 1 click |
| **Input Type** | track |
| **Could be inferred?** | Boolean |
| **Friction (1-10)** | Partial (last track) |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | YES |
| **Improvements** | No |
| **Related Components** | GlobalMusicPlayer |

### INT-072

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | XPContext |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Level-up modal dismiss |
| **User Goal** | Gamification feedback |
| **Flow** | Acknowledge progress |
| **Interaction Count** | Click continue |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | XPContext |

### INT-073

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | Navbar |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Pinned route link click |
| **User Goal** | Primary navigation |
| **Flow** | Go to feature |
| **Interaction Count** | Click nav item → route change |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | Navigation |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Navbar.jsx |

### INT-074

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | Navbar |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | More dropdown open |
| **User Goal** | Overflow nav |
| **Flow** | Reach gated routes |
| **Interaction Count** | Click More → select route |
| **User Input Required** | 2 clicks |
| **Input Type** | route |
| **Could be inferred?** | Dropdown |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Navbar |

### INT-075

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | Navbar |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Avatar → Account |
| **User Goal** | Account access |
| **Flow** | Manage profile |
| **Interaction Count** | Click avatar |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | Navigation |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Navbar |

### INT-076

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | Navbar mobile |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Hamburger open drawer |
| **User Goal** | Mobile nav |
| **Flow** | Navigate on phone |
| **Interaction Count** | Tap menu → tap link |
| **User Input Required** | 2 taps |
| **Input Type** | route |
| **Could be inferred?** | Drawer |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Navbar drawer |

### INT-077

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | BottomNav mobile |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Tab tap (4 pinned) |
| **User Goal** | Quick mobile nav |
| **Flow** | Switch core features |
| **Interaction Count** | Tap tab icon |
| **User Input Required** | 1 tap |
| **Input Type** | route |
| **Could be inferred?** | Navigation |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | BottomNav |

### INT-078

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | BottomNav mobile |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | More sheet |
| **User Goal** | Secondary routes |
| **Flow** | Reach all features |
| **Interaction Count** | Tap More → pick route |
| **User Input Required** | 2 taps |
| **Input Type** | route |
| **Could be inferred?** | Sheet |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | BottomNav |

### INT-079

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | CommandPalette |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | ⌘/Ctrl+K open |
| **User Goal** | Universal launcher |
| **Flow** | Act without mouse |
| **Interaction Count** | Keyboard chord |
| **User Input Required** | 1 key chord |
| **Input Type** | search query |
| **Could be inferred?** | Keyboard |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | CommandPalette |

### INT-080

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | CommandPalette |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Search filter actions |
| **User Goal** | Find action fast |
| **Flow** | Locate feature |
| **Interaction Count** | Type query → arrow → Enter |
| **User Input Required** | Typing + keys |
| **Input Type** | search |
| **Could be inferred?** | Free text |
| **Friction (1-10)** | Partial (recent) |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | CommandPalette |

### INT-081

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | CommandPalette |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Navigate action |
| **User Goal** | Jump to route |
| **Flow** | Open feature |
| **Interaction Count** | Select nav_* action |
| **User Input Required** | 2-3 keys |
| **Input Type** | — |
| **Could be inferred?** | Navigation |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | ALL_ACTIONS nav |

### INT-082

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | CommandPalette |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Smart AI Log |
| **User Goal** | NL capture |
| **Flow** | Log without forms |
| **Interaction Count** | Select ai_log → type/voice → Enter |
| **User Input Required** | Typing/voice |
| **Input Type** | free text |
| **Could be inferred?** | Free text + voice |
| **Friction (1-10)** | Partial (context) |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Full |
| **Related Components** | CommandPalette F-015 |

### INT-083

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | CommandPalette |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Log Win inline |
| **User Goal** | Quick win |
| **Flow** | Celebrate progress |
| **Interaction Count** | Select → type → Enter |
| **User Input Required** | Typing |
| **Input Type** | win text |
| **Could be inferred?** | Free text |
| **Friction (1-10)** | Partial (journal) |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | CommandPalette |

### INT-084

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | CommandPalette |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Log Note inline |
| **User Goal** | Quick note |
| **Flow** | Capture thought |
| **Interaction Count** | Select → type → Enter |
| **User Input Required** | Typing |
| **Input Type** | note text |
| **Could be inferred?** | Free text |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | CommandPalette |

### INT-085

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | CommandPalette |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Voice Log |
| **User Goal** | Hands-free capture |
| **Flow** | Log while busy |
| **Interaction Count** | Select → mic → speak → save |
| **User Input Required** | Voice |
| **Input Type** | transcript |
| **Could be inferred?** | Voice |
| **Friction (1-10)** | Partial (STT) |
| **Decision Fatigue (1-10)** | 4 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Full |
| **Related Components** | CommandPalette |

### INT-086

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | CommandPalette |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Check Mood 1-10 |
| **User Goal** | Mood capture |
| **Flow** | Track feeling |
| **Interaction Count** | Select → pick mood emoji |
| **User Input Required** | 2 clicks |
| **Input Type** | mood 1-10 |
| **Could be inferred?** | Multiple choice |
| **Friction (1-10)** | YES (text/voice prior) |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 4 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | Partial |
| **Related Components** | MoodTracker, Journal |

### INT-087

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | UniversalLogger |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Space→L chord open |
| **User Goal** | Fast daily log |
| **Flow** | Log from anywhere |
| **Interaction Count** | Space then L → type → save |
| **User Input Required** | Chord + typing |
| **Input Type** | log text |
| **Could be inferred?** | Free text |
| **Friction (1-10)** | Partial (AI) |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | NO |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | Partial |
| **Improvements** | Partial |
| **Related Components** | loggerShortcut.js |

### INT-088

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | ProductTour |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Tour step next |
| **User Goal** | Learn product |
| **Flow** | Understand features |
| **Interaction Count** | Click Next on spotlight |
| **User Input Required** | 1 click x steps |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 2 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | YES |
| **Improvements** | No |
| **Related Components** | ProductTour |

### INT-089

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | GuestTour |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Guest explore CTA |
| **User Goal** | Try before signup |
| **Flow** | Evaluate product |
| **Interaction Count** | Follow tour → Sign up |
| **User Input Required** | Multiple clicks |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | GuestTour |

### INT-090

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | Guest banner |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Sign Up CTA |
| **User Goal** | Convert guest |
| **Flow** | Save data permanently |
| **Interaction Count** | Click Sign Up |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | Navigation |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | DashboardLayout |

### INT-091

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | NotificationBell |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Open notifications |
| **User Goal** | See alerts |
| **Flow** | Stay informed |
| **Interaction Count** | Click bell → list |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | Dropdown |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 2 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | NotificationBell |

### INT-092

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | NotificationBell |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Mark read / dismiss |
| **User Goal** | Clear inbox |
| **Flow** | Reduce noise |
| **Interaction Count** | Click item actions |
| **User Input Required** | 1-2 clicks |
| **Input Type** | — |
| **Could be inferred?** | Boolean |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | NotifDropdown |

### INT-093

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | TierRouteGuard |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Blocked route attempt |
| **User Goal** | Upsell gate |
| **Flow** | Access premium feature |
| **Interaction Count** | Navigate → upgrade modal |
| **User Input Required** | 1 nav + modal |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 4 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | 2 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | FeatureGate |

### INT-094

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | InstallPrompt |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Add to home screen |
| **User Goal** | PWA install |
| **Flow** | Mobile app-like access |
| **Interaction Count** | Click install |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | InstallPrompt |

### INT-095

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | GlobalMusicPlayer |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Play/pause ambient |
| **User Goal** | Focus audio |
| **Flow** | Background sound |
| **Interaction Count** | Click transport |
| **User Input Required** | 1 click |
| **Input Type** | track |
| **Could be inferred?** | Boolean |
| **Friction (1-10)** | Partial (last track) |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | YES |
| **Improvements** | No |
| **Related Components** | GlobalMusicPlayer |

### INT-096

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | XPContext |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Level-up modal dismiss |
| **User Goal** | Gamification feedback |
| **Flow** | Acknowledge progress |
| **Interaction Count** | Click continue |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | — |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | XPContext |

### INT-097

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | Navbar |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | Pinned route link click |
| **User Goal** | Primary navigation |
| **Flow** | Go to feature |
| **Interaction Count** | Click nav item → route change |
| **User Input Required** | 1 click |
| **Input Type** | — |
| **Could be inferred?** | Navigation |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 1 |
| **Memory Load (1-10)** | 1 |
| **Context Switching** | 1 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Navbar.jsx |

### INT-098

| Attribute | Value |
|-----------|-------|
| **Feature** | Global Shell |
| **Location** | Navbar |
| **Trigger** | Click/Shortcut/Navigation |
| **Purpose** | More dropdown open |
| **User Goal** | Overflow nav |
| **Flow** | Reach gated routes |
| **Interaction Count** | Click More → select route |
| **User Input Required** | 2 clicks |
| **Input Type** | route |
| **Could be inferred?** | Dropdown |
| **Friction (1-10)** | NO |
| **Decision Fatigue (1-10)** | 2 |
| **Memory Load (1-10)** | 2 |
| **Context Switching** | 2 |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | YES |
| **AI Potential** | NO |
| **Improvements** | No |
| **Related Components** | Navbar |


## Overview / Today

### INT-099

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — DailyLogForm save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log daily metrics |
| **User Goal** | Record day |
| **Flow** | Fill sliders/toggles → Save |
| **Interaction Count** | 5-10 inputs |
| **User Input Required** | mood,sleep,gym,learning |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | DailyLogForm |

### INT-100

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Overview widget reorder |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Customize dashboard |
| **User Goal** | Personal layout |
| **Flow** | Drag widgets |
| **Interaction Count** | Drag |
| **User Input Required** | widget order |
| **Input Type** | Drag |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | OverviewWidgetGrid |

### INT-101

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Week task inline add |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan week |
| **User Goal** | Track tasks |
| **Flow** | Type → Enter |
| **Interaction Count** | Typing |
| **User Input Required** | task text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CommandCenter |

### INT-102

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Monday insight read |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Weekly AI summary |
| **User Goal** | Reflect |
| **Flow** | Scroll/read |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Overview widgets |

### INT-103

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Yearly habit matrix cell |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | See habit year |
| **User Goal** | Pattern spot |
| **Flow** | Click cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Calendar |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | YearlyHabitMatrix |

### INT-104

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — System health widget |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Status glance |
| **User Goal** | Know sync state |
| **Flow** | View only |
| **Interaction Count** | 0 |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SystemHealth |

### INT-105

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — DailyLogForm save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log daily metrics |
| **User Goal** | Record day |
| **Flow** | Fill sliders/toggles → Save |
| **Interaction Count** | 5-10 inputs |
| **User Input Required** | mood,sleep,gym,learning |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | DailyLogForm |

### INT-106

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Overview widget reorder |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Customize dashboard |
| **User Goal** | Personal layout |
| **Flow** | Drag widgets |
| **Interaction Count** | Drag |
| **User Input Required** | widget order |
| **Input Type** | Drag |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | OverviewWidgetGrid |

### INT-107

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Week task inline add |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan week |
| **User Goal** | Track tasks |
| **Flow** | Type → Enter |
| **Interaction Count** | Typing |
| **User Input Required** | task text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CommandCenter |

### INT-108

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Monday insight read |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Weekly AI summary |
| **User Goal** | Reflect |
| **Flow** | Scroll/read |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Overview widgets |

### INT-109

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Yearly habit matrix cell |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | See habit year |
| **User Goal** | Pattern spot |
| **Flow** | Click cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Calendar |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | YearlyHabitMatrix |

### INT-110

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — System health widget |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Status glance |
| **User Goal** | Know sync state |
| **Flow** | View only |
| **Interaction Count** | 0 |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SystemHealth |

### INT-111

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — DailyLogForm save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log daily metrics |
| **User Goal** | Record day |
| **Flow** | Fill sliders/toggles → Save |
| **Interaction Count** | 5-10 inputs |
| **User Input Required** | mood,sleep,gym,learning |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | DailyLogForm |

### INT-112

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Overview widget reorder |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Customize dashboard |
| **User Goal** | Personal layout |
| **Flow** | Drag widgets |
| **Interaction Count** | Drag |
| **User Input Required** | widget order |
| **Input Type** | Drag |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | OverviewWidgetGrid |

### INT-113

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Week task inline add |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan week |
| **User Goal** | Track tasks |
| **Flow** | Type → Enter |
| **Interaction Count** | Typing |
| **User Input Required** | task text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CommandCenter |

### INT-114

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Monday insight read |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Weekly AI summary |
| **User Goal** | Reflect |
| **Flow** | Scroll/read |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Overview widgets |

### INT-115

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Yearly habit matrix cell |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | See habit year |
| **User Goal** | Pattern spot |
| **Flow** | Click cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Calendar |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | YearlyHabitMatrix |

### INT-116

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — System health widget |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Status glance |
| **User Goal** | Know sync state |
| **Flow** | View only |
| **Interaction Count** | 0 |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SystemHealth |

### INT-117

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — DailyLogForm save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log daily metrics |
| **User Goal** | Record day |
| **Flow** | Fill sliders/toggles → Save |
| **Interaction Count** | 5-10 inputs |
| **User Input Required** | mood,sleep,gym,learning |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | DailyLogForm |

### INT-118

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Overview widget reorder |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Customize dashboard |
| **User Goal** | Personal layout |
| **Flow** | Drag widgets |
| **Interaction Count** | Drag |
| **User Input Required** | widget order |
| **Input Type** | Drag |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | OverviewWidgetGrid |

### INT-119

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Week task inline add |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan week |
| **User Goal** | Track tasks |
| **Flow** | Type → Enter |
| **Interaction Count** | Typing |
| **User Input Required** | task text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CommandCenter |

### INT-120

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Monday insight read |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Weekly AI summary |
| **User Goal** | Reflect |
| **Flow** | Scroll/read |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Overview widgets |

### INT-121

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Yearly habit matrix cell |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | See habit year |
| **User Goal** | Pattern spot |
| **Flow** | Click cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Calendar |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | YearlyHabitMatrix |

### INT-122

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — System health widget |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Status glance |
| **User Goal** | Know sync state |
| **Flow** | View only |
| **Interaction Count** | 0 |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SystemHealth |

### INT-123

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — DailyLogForm save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log daily metrics |
| **User Goal** | Record day |
| **Flow** | Fill sliders/toggles → Save |
| **Interaction Count** | 5-10 inputs |
| **User Input Required** | mood,sleep,gym,learning |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | DailyLogForm |

### INT-124

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Overview widget reorder |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Customize dashboard |
| **User Goal** | Personal layout |
| **Flow** | Drag widgets |
| **Interaction Count** | Drag |
| **User Input Required** | widget order |
| **Input Type** | Drag |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | OverviewWidgetGrid |

### INT-125

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Week task inline add |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan week |
| **User Goal** | Track tasks |
| **Flow** | Type → Enter |
| **Interaction Count** | Typing |
| **User Input Required** | task text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CommandCenter |

### INT-126

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Monday insight read |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Weekly AI summary |
| **User Goal** | Reflect |
| **Flow** | Scroll/read |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Overview widgets |

### INT-127

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Yearly habit matrix cell |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | See habit year |
| **User Goal** | Pattern spot |
| **Flow** | Click cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Calendar |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | YearlyHabitMatrix |

### INT-128

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — System health widget |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Status glance |
| **User Goal** | Know sync state |
| **Flow** | View only |
| **Interaction Count** | 0 |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SystemHealth |

### INT-129

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — DailyLogForm save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log daily metrics |
| **User Goal** | Record day |
| **Flow** | Fill sliders/toggles → Save |
| **Interaction Count** | 5-10 inputs |
| **User Input Required** | mood,sleep,gym,learning |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | DailyLogForm |

### INT-130

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Overview widget reorder |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Customize dashboard |
| **User Goal** | Personal layout |
| **Flow** | Drag widgets |
| **Interaction Count** | Drag |
| **User Input Required** | widget order |
| **Input Type** | Drag |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | OverviewWidgetGrid |

### INT-131

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Week task inline add |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan week |
| **User Goal** | Track tasks |
| **Flow** | Type → Enter |
| **Interaction Count** | Typing |
| **User Input Required** | task text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CommandCenter |

### INT-132

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Monday insight read |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Weekly AI summary |
| **User Goal** | Reflect |
| **Flow** | Scroll/read |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Overview widgets |

### INT-133

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Yearly habit matrix cell |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | See habit year |
| **User Goal** | Pattern spot |
| **Flow** | Click cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Calendar |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | YearlyHabitMatrix |

### INT-134

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — System health widget |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Status glance |
| **User Goal** | Know sync state |
| **Flow** | View only |
| **Interaction Count** | 0 |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SystemHealth |

### INT-135

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — DailyLogForm save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log daily metrics |
| **User Goal** | Record day |
| **Flow** | Fill sliders/toggles → Save |
| **Interaction Count** | 5-10 inputs |
| **User Input Required** | mood,sleep,gym,learning |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | DailyLogForm |

### INT-136

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Overview widget reorder |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Customize dashboard |
| **User Goal** | Personal layout |
| **Flow** | Drag widgets |
| **Interaction Count** | Drag |
| **User Input Required** | widget order |
| **Input Type** | Drag |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | OverviewWidgetGrid |

### INT-137

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Week task inline add |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan week |
| **User Goal** | Track tasks |
| **Flow** | Type → Enter |
| **Interaction Count** | Typing |
| **User Input Required** | task text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CommandCenter |

### INT-138

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Monday insight read |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Weekly AI summary |
| **User Goal** | Reflect |
| **Flow** | Scroll/read |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Overview widgets |

### INT-139

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Yearly habit matrix cell |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | See habit year |
| **User Goal** | Pattern spot |
| **Flow** | Click cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Calendar |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | YearlyHabitMatrix |

### INT-140

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — System health widget |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Status glance |
| **User Goal** | Know sync state |
| **Flow** | View only |
| **Interaction Count** | 0 |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SystemHealth |

### INT-141

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — DailyLogForm save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log daily metrics |
| **User Goal** | Record day |
| **Flow** | Fill sliders/toggles → Save |
| **Interaction Count** | 5-10 inputs |
| **User Input Required** | mood,sleep,gym,learning |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | DailyLogForm |

### INT-142

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Overview widget reorder |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Customize dashboard |
| **User Goal** | Personal layout |
| **Flow** | Drag widgets |
| **Interaction Count** | Drag |
| **User Input Required** | widget order |
| **Input Type** | Drag |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | OverviewWidgetGrid |

### INT-143

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Week task inline add |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan week |
| **User Goal** | Track tasks |
| **Flow** | Type → Enter |
| **Interaction Count** | Typing |
| **User Input Required** | task text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CommandCenter |

### INT-144

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Monday insight read |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Weekly AI summary |
| **User Goal** | Reflect |
| **Flow** | Scroll/read |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Overview widgets |

### INT-145

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Yearly habit matrix cell |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | See habit year |
| **User Goal** | Pattern spot |
| **Flow** | Click cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Calendar |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | YearlyHabitMatrix |

### INT-146

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — System health widget |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Status glance |
| **User Goal** | Know sync state |
| **Flow** | View only |
| **Interaction Count** | 0 |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SystemHealth |

### INT-147

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — DailyLogForm save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log daily metrics |
| **User Goal** | Record day |
| **Flow** | Fill sliders/toggles → Save |
| **Interaction Count** | 5-10 inputs |
| **User Input Required** | mood,sleep,gym,learning |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | DailyLogForm |

### INT-148

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Overview widget reorder |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Customize dashboard |
| **User Goal** | Personal layout |
| **Flow** | Drag widgets |
| **Interaction Count** | Drag |
| **User Input Required** | widget order |
| **Input Type** | Drag |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | OverviewWidgetGrid |

### INT-149

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Week task inline add |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan week |
| **User Goal** | Track tasks |
| **Flow** | Type → Enter |
| **Interaction Count** | Typing |
| **User Input Required** | task text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CommandCenter |

### INT-150

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Monday insight read |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Weekly AI summary |
| **User Goal** | Reflect |
| **Flow** | Scroll/read |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Overview widgets |

### INT-151

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Yearly habit matrix cell |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | See habit year |
| **User Goal** | Pattern spot |
| **Flow** | Click cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Calendar |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | YearlyHabitMatrix |

### INT-152

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — System health widget |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Status glance |
| **User Goal** | Know sync state |
| **Flow** | View only |
| **Interaction Count** | 0 |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SystemHealth |

### INT-153

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — DailyLogForm save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log daily metrics |
| **User Goal** | Record day |
| **Flow** | Fill sliders/toggles → Save |
| **Interaction Count** | 5-10 inputs |
| **User Input Required** | mood,sleep,gym,learning |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | DailyLogForm |

### INT-154

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Overview widget reorder |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Customize dashboard |
| **User Goal** | Personal layout |
| **Flow** | Drag widgets |
| **Interaction Count** | Drag |
| **User Input Required** | widget order |
| **Input Type** | Drag |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | OverviewWidgetGrid |

### INT-155

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Week task inline add |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan week |
| **User Goal** | Track tasks |
| **Flow** | Type → Enter |
| **Interaction Count** | Typing |
| **User Input Required** | task text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CommandCenter |

### INT-156

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Monday insight read |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Weekly AI summary |
| **User Goal** | Reflect |
| **Flow** | Scroll/read |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Overview widgets |

### INT-157

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — Yearly habit matrix cell |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | See habit year |
| **User Goal** | Pattern spot |
| **Flow** | Click cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Calendar |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | YearlyHabitMatrix |

### INT-158

| Attribute | Value |
|-----------|-------|
| **Feature** | Overview / Today |
| **Location** | /overview — System health widget |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Status glance |
| **User Goal** | Know sync state |
| **Flow** | View only |
| **Interaction Count** | 0 |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SystemHealth |


## Journal

### INT-159

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — JournalCapture type+send |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Daily capture |
| **User Goal** | Express today |
| **Flow** | Type body → Send |
| **Interaction Count** | Typing |
| **User Input Required** | body |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture F-016 |

### INT-160

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Mood-only strip tap |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Mood without words |
| **User Goal** | Quick check-in |
| **Flow** | Tap mood 1-10 |
| **Interaction Count** | 1 tap |
| **User Input Required** | mood |
| **Input Type** | Slider/MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-161

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Voice dictation |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Hands-free journal |
| **User Goal** | Capture while moving |
| **Flow** | Mic → speak → send |
| **Interaction Count** | Voice |
| **User Input Required** | transcript |
| **Input Type** | Voice |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-162

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Mode switch sidebar |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Structured journaling |
| **User Goal** | CBT/WWW/etc |
| **Flow** | Pick mode tab |
| **Interaction Count** | 1 click |
| **User Input Required** | mode |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Journal.jsx ?mode= |

### INT-163

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Entry sidebar select |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Read past entry |
| **User Goal** | Review history |
| **Flow** | Click entry row |
| **Interaction Count** | 1 click |
| **User Input Required** | entry id |
| **Input Type** | List |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalSidebar |

### INT-164

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — AI analyze post-save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Insight on entry |
| **User Goal** | Understand patterns |
| **Flow** | Auto after save |
| **Interaction Count** | 0-1 click |
| **User Input Required** | — |
| **Input Type** | AI |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Journal page |

### INT-165

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — New entry from read view |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Continue writing |
| **User Goal** | Fresh capture |
| **Flow** | Click New Entry |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | — |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalReadView |

### INT-166

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Template collapse/expand |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Reduce clutter |
| **User Goal** | Focus capture |
| **Flow** | Toggle templates |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-167

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — JournalCapture type+send |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Daily capture |
| **User Goal** | Express today |
| **Flow** | Type body → Send |
| **Interaction Count** | Typing |
| **User Input Required** | body |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture F-016 |

### INT-168

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Mood-only strip tap |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Mood without words |
| **User Goal** | Quick check-in |
| **Flow** | Tap mood 1-10 |
| **Interaction Count** | 1 tap |
| **User Input Required** | mood |
| **Input Type** | Slider/MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-169

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Voice dictation |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Hands-free journal |
| **User Goal** | Capture while moving |
| **Flow** | Mic → speak → send |
| **Interaction Count** | Voice |
| **User Input Required** | transcript |
| **Input Type** | Voice |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-170

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Mode switch sidebar |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Structured journaling |
| **User Goal** | CBT/WWW/etc |
| **Flow** | Pick mode tab |
| **Interaction Count** | 1 click |
| **User Input Required** | mode |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Journal.jsx ?mode= |

### INT-171

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Entry sidebar select |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Read past entry |
| **User Goal** | Review history |
| **Flow** | Click entry row |
| **Interaction Count** | 1 click |
| **User Input Required** | entry id |
| **Input Type** | List |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalSidebar |

### INT-172

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — AI analyze post-save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Insight on entry |
| **User Goal** | Understand patterns |
| **Flow** | Auto after save |
| **Interaction Count** | 0-1 click |
| **User Input Required** | — |
| **Input Type** | AI |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Journal page |

### INT-173

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — New entry from read view |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Continue writing |
| **User Goal** | Fresh capture |
| **Flow** | Click New Entry |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | — |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalReadView |

### INT-174

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Template collapse/expand |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Reduce clutter |
| **User Goal** | Focus capture |
| **Flow** | Toggle templates |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-175

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — JournalCapture type+send |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Daily capture |
| **User Goal** | Express today |
| **Flow** | Type body → Send |
| **Interaction Count** | Typing |
| **User Input Required** | body |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture F-016 |

### INT-176

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Mood-only strip tap |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Mood without words |
| **User Goal** | Quick check-in |
| **Flow** | Tap mood 1-10 |
| **Interaction Count** | 1 tap |
| **User Input Required** | mood |
| **Input Type** | Slider/MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-177

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Voice dictation |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Hands-free journal |
| **User Goal** | Capture while moving |
| **Flow** | Mic → speak → send |
| **Interaction Count** | Voice |
| **User Input Required** | transcript |
| **Input Type** | Voice |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-178

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Mode switch sidebar |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Structured journaling |
| **User Goal** | CBT/WWW/etc |
| **Flow** | Pick mode tab |
| **Interaction Count** | 1 click |
| **User Input Required** | mode |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Journal.jsx ?mode= |

### INT-179

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Entry sidebar select |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Read past entry |
| **User Goal** | Review history |
| **Flow** | Click entry row |
| **Interaction Count** | 1 click |
| **User Input Required** | entry id |
| **Input Type** | List |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalSidebar |

### INT-180

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — AI analyze post-save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Insight on entry |
| **User Goal** | Understand patterns |
| **Flow** | Auto after save |
| **Interaction Count** | 0-1 click |
| **User Input Required** | — |
| **Input Type** | AI |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Journal page |

### INT-181

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — New entry from read view |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Continue writing |
| **User Goal** | Fresh capture |
| **Flow** | Click New Entry |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | — |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalReadView |

### INT-182

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Template collapse/expand |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Reduce clutter |
| **User Goal** | Focus capture |
| **Flow** | Toggle templates |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-183

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — JournalCapture type+send |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Daily capture |
| **User Goal** | Express today |
| **Flow** | Type body → Send |
| **Interaction Count** | Typing |
| **User Input Required** | body |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture F-016 |

### INT-184

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Mood-only strip tap |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Mood without words |
| **User Goal** | Quick check-in |
| **Flow** | Tap mood 1-10 |
| **Interaction Count** | 1 tap |
| **User Input Required** | mood |
| **Input Type** | Slider/MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-185

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Voice dictation |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Hands-free journal |
| **User Goal** | Capture while moving |
| **Flow** | Mic → speak → send |
| **Interaction Count** | Voice |
| **User Input Required** | transcript |
| **Input Type** | Voice |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-186

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Mode switch sidebar |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Structured journaling |
| **User Goal** | CBT/WWW/etc |
| **Flow** | Pick mode tab |
| **Interaction Count** | 1 click |
| **User Input Required** | mode |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Journal.jsx ?mode= |

### INT-187

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Entry sidebar select |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Read past entry |
| **User Goal** | Review history |
| **Flow** | Click entry row |
| **Interaction Count** | 1 click |
| **User Input Required** | entry id |
| **Input Type** | List |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalSidebar |

### INT-188

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — AI analyze post-save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Insight on entry |
| **User Goal** | Understand patterns |
| **Flow** | Auto after save |
| **Interaction Count** | 0-1 click |
| **User Input Required** | — |
| **Input Type** | AI |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Journal page |

### INT-189

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — New entry from read view |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Continue writing |
| **User Goal** | Fresh capture |
| **Flow** | Click New Entry |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | — |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalReadView |

### INT-190

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Template collapse/expand |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Reduce clutter |
| **User Goal** | Focus capture |
| **Flow** | Toggle templates |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-191

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — JournalCapture type+send |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Daily capture |
| **User Goal** | Express today |
| **Flow** | Type body → Send |
| **Interaction Count** | Typing |
| **User Input Required** | body |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture F-016 |

### INT-192

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Mood-only strip tap |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Mood without words |
| **User Goal** | Quick check-in |
| **Flow** | Tap mood 1-10 |
| **Interaction Count** | 1 tap |
| **User Input Required** | mood |
| **Input Type** | Slider/MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-193

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Voice dictation |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Hands-free journal |
| **User Goal** | Capture while moving |
| **Flow** | Mic → speak → send |
| **Interaction Count** | Voice |
| **User Input Required** | transcript |
| **Input Type** | Voice |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-194

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Mode switch sidebar |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Structured journaling |
| **User Goal** | CBT/WWW/etc |
| **Flow** | Pick mode tab |
| **Interaction Count** | 1 click |
| **User Input Required** | mode |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Journal.jsx ?mode= |

### INT-195

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Entry sidebar select |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Read past entry |
| **User Goal** | Review history |
| **Flow** | Click entry row |
| **Interaction Count** | 1 click |
| **User Input Required** | entry id |
| **Input Type** | List |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalSidebar |

### INT-196

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — AI analyze post-save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Insight on entry |
| **User Goal** | Understand patterns |
| **Flow** | Auto after save |
| **Interaction Count** | 0-1 click |
| **User Input Required** | — |
| **Input Type** | AI |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Journal page |

### INT-197

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — New entry from read view |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Continue writing |
| **User Goal** | Fresh capture |
| **Flow** | Click New Entry |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | — |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalReadView |

### INT-198

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Template collapse/expand |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Reduce clutter |
| **User Goal** | Focus capture |
| **Flow** | Toggle templates |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-199

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — JournalCapture type+send |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Daily capture |
| **User Goal** | Express today |
| **Flow** | Type body → Send |
| **Interaction Count** | Typing |
| **User Input Required** | body |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture F-016 |

### INT-200

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Mood-only strip tap |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Mood without words |
| **User Goal** | Quick check-in |
| **Flow** | Tap mood 1-10 |
| **Interaction Count** | 1 tap |
| **User Input Required** | mood |
| **Input Type** | Slider/MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-201

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Voice dictation |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Hands-free journal |
| **User Goal** | Capture while moving |
| **Flow** | Mic → speak → send |
| **Interaction Count** | Voice |
| **User Input Required** | transcript |
| **Input Type** | Voice |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-202

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Mode switch sidebar |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Structured journaling |
| **User Goal** | CBT/WWW/etc |
| **Flow** | Pick mode tab |
| **Interaction Count** | 1 click |
| **User Input Required** | mode |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Journal.jsx ?mode= |

### INT-203

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Entry sidebar select |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Read past entry |
| **User Goal** | Review history |
| **Flow** | Click entry row |
| **Interaction Count** | 1 click |
| **User Input Required** | entry id |
| **Input Type** | List |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalSidebar |

### INT-204

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — AI analyze post-save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Insight on entry |
| **User Goal** | Understand patterns |
| **Flow** | Auto after save |
| **Interaction Count** | 0-1 click |
| **User Input Required** | — |
| **Input Type** | AI |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Journal page |

### INT-205

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — New entry from read view |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Continue writing |
| **User Goal** | Fresh capture |
| **Flow** | Click New Entry |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | — |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalReadView |

### INT-206

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Template collapse/expand |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Reduce clutter |
| **User Goal** | Focus capture |
| **Flow** | Toggle templates |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |

### INT-207

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — JournalCapture type+send |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Daily capture |
| **User Goal** | Express today |
| **Flow** | Type body → Send |
| **Interaction Count** | Typing |
| **User Input Required** | body |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture F-016 |

### INT-208

| Attribute | Value |
|-----------|-------|
| **Feature** | Journal |
| **Location** | /journal — Mood-only strip tap |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Mood without words |
| **User Goal** | Quick check-in |
| **Flow** | Tap mood 1-10 |
| **Interaction Count** | 1 tap |
| **User Input Required** | mood |
| **Input Type** | Slider/MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | JournalCapture |


## Habits

### INT-209

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Today toggle check |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Mark habit done |
| **User Goal** | Keep streak |
| **Flow** | Click checkbox |
| **Interaction Count** | 1 click |
| **User Input Required** | done bool |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Habits page |

### INT-210

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Create habit modal |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Add habit |
| **User Goal** | Track new behavior |
| **Flow** | Open → fill → Save |
| **Interaction Count** | 5 fields |
| **User Input Required** | name,emoji,category,color,desc |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-018 HabitManager |

### INT-211

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Delete habit confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove habit |
| **User Goal** | Clean list |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | ConfirmDialog |

### INT-212

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Streak analytics filter |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Drill habit |
| **User Goal** | See streak detail |
| **Flow** | Click habit chip |
| **Interaction Count** | 1 click |
| **User Input Required** | habit id |
| **Input Type** | Filter |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | StreakAnalytics |

### INT-213

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Routine template pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Quick create |
| **User Goal** | Start from template |
| **Flow** | Wizard step pick |
| **Interaction Count** | 2-3 clicks |
| **User Input Required** | routine id |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | HabitManager wizard |

### INT-214

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Matrix year view cell |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Annual view |
| **User Goal** | Long-term pattern |
| **Flow** | Click cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Calendar |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | YearlyHabitMatrix |

### INT-215

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Today toggle check |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Mark habit done |
| **User Goal** | Keep streak |
| **Flow** | Click checkbox |
| **Interaction Count** | 1 click |
| **User Input Required** | done bool |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Habits page |

### INT-216

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Create habit modal |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Add habit |
| **User Goal** | Track new behavior |
| **Flow** | Open → fill → Save |
| **Interaction Count** | 5 fields |
| **User Input Required** | name,emoji,category,color,desc |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-018 HabitManager |

### INT-217

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Delete habit confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove habit |
| **User Goal** | Clean list |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | ConfirmDialog |

### INT-218

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Streak analytics filter |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Drill habit |
| **User Goal** | See streak detail |
| **Flow** | Click habit chip |
| **Interaction Count** | 1 click |
| **User Input Required** | habit id |
| **Input Type** | Filter |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | StreakAnalytics |

### INT-219

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Routine template pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Quick create |
| **User Goal** | Start from template |
| **Flow** | Wizard step pick |
| **Interaction Count** | 2-3 clicks |
| **User Input Required** | routine id |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | HabitManager wizard |

### INT-220

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Matrix year view cell |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Annual view |
| **User Goal** | Long-term pattern |
| **Flow** | Click cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Calendar |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | YearlyHabitMatrix |

### INT-221

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Today toggle check |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Mark habit done |
| **User Goal** | Keep streak |
| **Flow** | Click checkbox |
| **Interaction Count** | 1 click |
| **User Input Required** | done bool |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Habits page |

### INT-222

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Create habit modal |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Add habit |
| **User Goal** | Track new behavior |
| **Flow** | Open → fill → Save |
| **Interaction Count** | 5 fields |
| **User Input Required** | name,emoji,category,color,desc |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-018 HabitManager |

### INT-223

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Delete habit confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove habit |
| **User Goal** | Clean list |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | ConfirmDialog |

### INT-224

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Streak analytics filter |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Drill habit |
| **User Goal** | See streak detail |
| **Flow** | Click habit chip |
| **Interaction Count** | 1 click |
| **User Input Required** | habit id |
| **Input Type** | Filter |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | StreakAnalytics |

### INT-225

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Routine template pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Quick create |
| **User Goal** | Start from template |
| **Flow** | Wizard step pick |
| **Interaction Count** | 2-3 clicks |
| **User Input Required** | routine id |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | HabitManager wizard |

### INT-226

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Matrix year view cell |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Annual view |
| **User Goal** | Long-term pattern |
| **Flow** | Click cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Calendar |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | YearlyHabitMatrix |

### INT-227

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Today toggle check |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Mark habit done |
| **User Goal** | Keep streak |
| **Flow** | Click checkbox |
| **Interaction Count** | 1 click |
| **User Input Required** | done bool |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Habits page |

### INT-228

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Create habit modal |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Add habit |
| **User Goal** | Track new behavior |
| **Flow** | Open → fill → Save |
| **Interaction Count** | 5 fields |
| **User Input Required** | name,emoji,category,color,desc |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-018 HabitManager |

### INT-229

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Delete habit confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove habit |
| **User Goal** | Clean list |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | ConfirmDialog |

### INT-230

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Streak analytics filter |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Drill habit |
| **User Goal** | See streak detail |
| **Flow** | Click habit chip |
| **Interaction Count** | 1 click |
| **User Input Required** | habit id |
| **Input Type** | Filter |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | StreakAnalytics |

### INT-231

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Routine template pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Quick create |
| **User Goal** | Start from template |
| **Flow** | Wizard step pick |
| **Interaction Count** | 2-3 clicks |
| **User Input Required** | routine id |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | HabitManager wizard |

### INT-232

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Matrix year view cell |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Annual view |
| **User Goal** | Long-term pattern |
| **Flow** | Click cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Calendar |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | YearlyHabitMatrix |

### INT-233

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Today toggle check |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Mark habit done |
| **User Goal** | Keep streak |
| **Flow** | Click checkbox |
| **Interaction Count** | 1 click |
| **User Input Required** | done bool |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Habits page |

### INT-234

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Create habit modal |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Add habit |
| **User Goal** | Track new behavior |
| **Flow** | Open → fill → Save |
| **Interaction Count** | 5 fields |
| **User Input Required** | name,emoji,category,color,desc |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-018 HabitManager |

### INT-235

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Delete habit confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove habit |
| **User Goal** | Clean list |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | ConfirmDialog |

### INT-236

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Streak analytics filter |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Drill habit |
| **User Goal** | See streak detail |
| **Flow** | Click habit chip |
| **Interaction Count** | 1 click |
| **User Input Required** | habit id |
| **Input Type** | Filter |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | StreakAnalytics |

### INT-237

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Routine template pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Quick create |
| **User Goal** | Start from template |
| **Flow** | Wizard step pick |
| **Interaction Count** | 2-3 clicks |
| **User Input Required** | routine id |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | HabitManager wizard |

### INT-238

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Matrix year view cell |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Annual view |
| **User Goal** | Long-term pattern |
| **Flow** | Click cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Calendar |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | YearlyHabitMatrix |

### INT-239

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Today toggle check |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Mark habit done |
| **User Goal** | Keep streak |
| **Flow** | Click checkbox |
| **Interaction Count** | 1 click |
| **User Input Required** | done bool |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Habits page |

### INT-240

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Create habit modal |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Add habit |
| **User Goal** | Track new behavior |
| **Flow** | Open → fill → Save |
| **Interaction Count** | 5 fields |
| **User Input Required** | name,emoji,category,color,desc |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-018 HabitManager |

### INT-241

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Delete habit confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove habit |
| **User Goal** | Clean list |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | ConfirmDialog |

### INT-242

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Streak analytics filter |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Drill habit |
| **User Goal** | See streak detail |
| **Flow** | Click habit chip |
| **Interaction Count** | 1 click |
| **User Input Required** | habit id |
| **Input Type** | Filter |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | StreakAnalytics |

### INT-243

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Routine template pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Quick create |
| **User Goal** | Start from template |
| **Flow** | Wizard step pick |
| **Interaction Count** | 2-3 clicks |
| **User Input Required** | routine id |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | HabitManager wizard |

### INT-244

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Matrix year view cell |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Annual view |
| **User Goal** | Long-term pattern |
| **Flow** | Click cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Calendar |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | YearlyHabitMatrix |

### INT-245

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Today toggle check |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Mark habit done |
| **User Goal** | Keep streak |
| **Flow** | Click checkbox |
| **Interaction Count** | 1 click |
| **User Input Required** | done bool |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Habits page |

### INT-246

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Create habit modal |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Add habit |
| **User Goal** | Track new behavior |
| **Flow** | Open → fill → Save |
| **Interaction Count** | 5 fields |
| **User Input Required** | name,emoji,category,color,desc |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-018 HabitManager |

### INT-247

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Delete habit confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove habit |
| **User Goal** | Clean list |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | ConfirmDialog |

### INT-248

| Attribute | Value |
|-----------|-------|
| **Feature** | Habits |
| **Location** | /habits — Streak analytics filter |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Drill habit |
| **User Goal** | See streak detail |
| **Flow** | Click habit chip |
| **Interaction Count** | 1 click |
| **User Input Required** | habit id |
| **Input Type** | Filter |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | StreakAnalytics |


## Goals

### INT-249

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Create goal modal |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Set goal |
| **User Goal** | Define target |
| **Flow** | Open → fill → Save |
| **Interaction Count** | 7 fields |
| **User Input Required** | title,pillar,priority,date,why,milestones |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-019 |

### INT-250

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Milestone check |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Progress update |
| **User Goal** | Mark step done |
| **Flow** | Toggle milestone |
| **Interaction Count** | 1 click |
| **User Input Required** | milestone id |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals page |

### INT-251

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Goal status change |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Lifecycle |
| **User Goal** | Pause/complete |
| **Flow** | Status dropdown |
| **Interaction Count** | 2 clicks |
| **User Input Required** | status |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals modal |

### INT-252

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Pillar filter |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Focus area |
| **User Goal** | See domain goals |
| **Flow** | Click pillar tab |
| **Interaction Count** | 1 click |
| **User Input Required** | pillar |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals page |

### INT-253

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Vision title edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | North star |
| **User Goal** | Update vision |
| **Flow** | Click edit → save |
| **Interaction Count** | Typing |
| **User Input Required** | vision text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | GoalsVisionTitle |

### INT-254

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Create goal modal |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Set goal |
| **User Goal** | Define target |
| **Flow** | Open → fill → Save |
| **Interaction Count** | 7 fields |
| **User Input Required** | title,pillar,priority,date,why,milestones |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-019 |

### INT-255

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Milestone check |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Progress update |
| **User Goal** | Mark step done |
| **Flow** | Toggle milestone |
| **Interaction Count** | 1 click |
| **User Input Required** | milestone id |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals page |

### INT-256

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Goal status change |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Lifecycle |
| **User Goal** | Pause/complete |
| **Flow** | Status dropdown |
| **Interaction Count** | 2 clicks |
| **User Input Required** | status |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals modal |

### INT-257

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Pillar filter |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Focus area |
| **User Goal** | See domain goals |
| **Flow** | Click pillar tab |
| **Interaction Count** | 1 click |
| **User Input Required** | pillar |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals page |

### INT-258

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Vision title edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | North star |
| **User Goal** | Update vision |
| **Flow** | Click edit → save |
| **Interaction Count** | Typing |
| **User Input Required** | vision text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | GoalsVisionTitle |

### INT-259

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Create goal modal |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Set goal |
| **User Goal** | Define target |
| **Flow** | Open → fill → Save |
| **Interaction Count** | 7 fields |
| **User Input Required** | title,pillar,priority,date,why,milestones |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-019 |

### INT-260

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Milestone check |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Progress update |
| **User Goal** | Mark step done |
| **Flow** | Toggle milestone |
| **Interaction Count** | 1 click |
| **User Input Required** | milestone id |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals page |

### INT-261

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Goal status change |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Lifecycle |
| **User Goal** | Pause/complete |
| **Flow** | Status dropdown |
| **Interaction Count** | 2 clicks |
| **User Input Required** | status |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals modal |

### INT-262

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Pillar filter |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Focus area |
| **User Goal** | See domain goals |
| **Flow** | Click pillar tab |
| **Interaction Count** | 1 click |
| **User Input Required** | pillar |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals page |

### INT-263

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Vision title edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | North star |
| **User Goal** | Update vision |
| **Flow** | Click edit → save |
| **Interaction Count** | Typing |
| **User Input Required** | vision text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | GoalsVisionTitle |

### INT-264

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Create goal modal |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Set goal |
| **User Goal** | Define target |
| **Flow** | Open → fill → Save |
| **Interaction Count** | 7 fields |
| **User Input Required** | title,pillar,priority,date,why,milestones |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-019 |

### INT-265

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Milestone check |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Progress update |
| **User Goal** | Mark step done |
| **Flow** | Toggle milestone |
| **Interaction Count** | 1 click |
| **User Input Required** | milestone id |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals page |

### INT-266

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Goal status change |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Lifecycle |
| **User Goal** | Pause/complete |
| **Flow** | Status dropdown |
| **Interaction Count** | 2 clicks |
| **User Input Required** | status |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals modal |

### INT-267

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Pillar filter |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Focus area |
| **User Goal** | See domain goals |
| **Flow** | Click pillar tab |
| **Interaction Count** | 1 click |
| **User Input Required** | pillar |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals page |

### INT-268

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Vision title edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | North star |
| **User Goal** | Update vision |
| **Flow** | Click edit → save |
| **Interaction Count** | Typing |
| **User Input Required** | vision text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | GoalsVisionTitle |

### INT-269

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Create goal modal |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Set goal |
| **User Goal** | Define target |
| **Flow** | Open → fill → Save |
| **Interaction Count** | 7 fields |
| **User Input Required** | title,pillar,priority,date,why,milestones |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-019 |

### INT-270

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Milestone check |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Progress update |
| **User Goal** | Mark step done |
| **Flow** | Toggle milestone |
| **Interaction Count** | 1 click |
| **User Input Required** | milestone id |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals page |

### INT-271

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Goal status change |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Lifecycle |
| **User Goal** | Pause/complete |
| **Flow** | Status dropdown |
| **Interaction Count** | 2 clicks |
| **User Input Required** | status |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals modal |

### INT-272

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Pillar filter |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Focus area |
| **User Goal** | See domain goals |
| **Flow** | Click pillar tab |
| **Interaction Count** | 1 click |
| **User Input Required** | pillar |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals page |

### INT-273

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Vision title edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | North star |
| **User Goal** | Update vision |
| **Flow** | Click edit → save |
| **Interaction Count** | Typing |
| **User Input Required** | vision text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | GoalsVisionTitle |

### INT-274

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Create goal modal |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Set goal |
| **User Goal** | Define target |
| **Flow** | Open → fill → Save |
| **Interaction Count** | 7 fields |
| **User Input Required** | title,pillar,priority,date,why,milestones |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-019 |

### INT-275

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Milestone check |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Progress update |
| **User Goal** | Mark step done |
| **Flow** | Toggle milestone |
| **Interaction Count** | 1 click |
| **User Input Required** | milestone id |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals page |

### INT-276

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Goal status change |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Lifecycle |
| **User Goal** | Pause/complete |
| **Flow** | Status dropdown |
| **Interaction Count** | 2 clicks |
| **User Input Required** | status |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals modal |

### INT-277

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Pillar filter |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Focus area |
| **User Goal** | See domain goals |
| **Flow** | Click pillar tab |
| **Interaction Count** | 1 click |
| **User Input Required** | pillar |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Goals page |

### INT-278

| Attribute | Value |
|-----------|-------|
| **Feature** | Goals |
| **Location** | /goals — Vision title edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | North star |
| **User Goal** | Update vision |
| **Flow** | Click edit → save |
| **Interaction Count** | Typing |
| **User Input Required** | vision text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | GoalsVisionTitle |


## Finance

### INT-279

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — EntryForm add transaction |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log money |
| **User Goal** | Track spend/income |
| **Flow** | Fill form → Add |
| **Interaction Count** | 6 fields |
| **User Input Required** | amount,type,category,account,date,note |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-020 EntryForm |

### INT-280

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Tab switch Overview/Tx/Analytics |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate finance views |
| **User Goal** | Analyze money |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-281

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Budget set/edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan spending |
| **User Goal** | Control budget |
| **Flow** | Inline edit amounts |
| **Interaction Count** | Typing |
| **User Input Required** | budget caps |
| **Input Type** | Number |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FinanceOverview |

### INT-282

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — WhatIf simulator |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Scenario plan |
| **User Goal** | Model future |
| **Flow** | Adjust sliders → calc |
| **Interaction Count** | 3 numbers |
| **User Input Required** | income,expense,savings |
| **Input Type** | Number |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-021 |

### INT-283

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Delete asset confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove asset |
| **User Goal** | Clean portfolio |
| **Flow** | Delete → window.confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-284

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Account remove confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove account |
| **User Goal** | Fix accounts list |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-285

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — EntryForm add transaction |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log money |
| **User Goal** | Track spend/income |
| **Flow** | Fill form → Add |
| **Interaction Count** | 6 fields |
| **User Input Required** | amount,type,category,account,date,note |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-020 EntryForm |

### INT-286

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Tab switch Overview/Tx/Analytics |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate finance views |
| **User Goal** | Analyze money |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-287

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Budget set/edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan spending |
| **User Goal** | Control budget |
| **Flow** | Inline edit amounts |
| **Interaction Count** | Typing |
| **User Input Required** | budget caps |
| **Input Type** | Number |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FinanceOverview |

### INT-288

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — WhatIf simulator |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Scenario plan |
| **User Goal** | Model future |
| **Flow** | Adjust sliders → calc |
| **Interaction Count** | 3 numbers |
| **User Input Required** | income,expense,savings |
| **Input Type** | Number |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-021 |

### INT-289

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Delete asset confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove asset |
| **User Goal** | Clean portfolio |
| **Flow** | Delete → window.confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-290

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Account remove confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove account |
| **User Goal** | Fix accounts list |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-291

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — EntryForm add transaction |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log money |
| **User Goal** | Track spend/income |
| **Flow** | Fill form → Add |
| **Interaction Count** | 6 fields |
| **User Input Required** | amount,type,category,account,date,note |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-020 EntryForm |

### INT-292

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Tab switch Overview/Tx/Analytics |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate finance views |
| **User Goal** | Analyze money |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-293

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Budget set/edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan spending |
| **User Goal** | Control budget |
| **Flow** | Inline edit amounts |
| **Interaction Count** | Typing |
| **User Input Required** | budget caps |
| **Input Type** | Number |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FinanceOverview |

### INT-294

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — WhatIf simulator |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Scenario plan |
| **User Goal** | Model future |
| **Flow** | Adjust sliders → calc |
| **Interaction Count** | 3 numbers |
| **User Input Required** | income,expense,savings |
| **Input Type** | Number |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-021 |

### INT-295

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Delete asset confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove asset |
| **User Goal** | Clean portfolio |
| **Flow** | Delete → window.confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-296

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Account remove confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove account |
| **User Goal** | Fix accounts list |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-297

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — EntryForm add transaction |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log money |
| **User Goal** | Track spend/income |
| **Flow** | Fill form → Add |
| **Interaction Count** | 6 fields |
| **User Input Required** | amount,type,category,account,date,note |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-020 EntryForm |

### INT-298

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Tab switch Overview/Tx/Analytics |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate finance views |
| **User Goal** | Analyze money |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-299

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Budget set/edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan spending |
| **User Goal** | Control budget |
| **Flow** | Inline edit amounts |
| **Interaction Count** | Typing |
| **User Input Required** | budget caps |
| **Input Type** | Number |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FinanceOverview |

### INT-300

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — WhatIf simulator |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Scenario plan |
| **User Goal** | Model future |
| **Flow** | Adjust sliders → calc |
| **Interaction Count** | 3 numbers |
| **User Input Required** | income,expense,savings |
| **Input Type** | Number |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-021 |

### INT-301

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Delete asset confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove asset |
| **User Goal** | Clean portfolio |
| **Flow** | Delete → window.confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-302

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Account remove confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove account |
| **User Goal** | Fix accounts list |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-303

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — EntryForm add transaction |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log money |
| **User Goal** | Track spend/income |
| **Flow** | Fill form → Add |
| **Interaction Count** | 6 fields |
| **User Input Required** | amount,type,category,account,date,note |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-020 EntryForm |

### INT-304

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Tab switch Overview/Tx/Analytics |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate finance views |
| **User Goal** | Analyze money |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-305

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Budget set/edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan spending |
| **User Goal** | Control budget |
| **Flow** | Inline edit amounts |
| **Interaction Count** | Typing |
| **User Input Required** | budget caps |
| **Input Type** | Number |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FinanceOverview |

### INT-306

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — WhatIf simulator |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Scenario plan |
| **User Goal** | Model future |
| **Flow** | Adjust sliders → calc |
| **Interaction Count** | 3 numbers |
| **User Input Required** | income,expense,savings |
| **Input Type** | Number |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-021 |

### INT-307

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Delete asset confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove asset |
| **User Goal** | Clean portfolio |
| **Flow** | Delete → window.confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-308

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Account remove confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove account |
| **User Goal** | Fix accounts list |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-309

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — EntryForm add transaction |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log money |
| **User Goal** | Track spend/income |
| **Flow** | Fill form → Add |
| **Interaction Count** | 6 fields |
| **User Input Required** | amount,type,category,account,date,note |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-020 EntryForm |

### INT-310

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Tab switch Overview/Tx/Analytics |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate finance views |
| **User Goal** | Analyze money |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-311

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Budget set/edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan spending |
| **User Goal** | Control budget |
| **Flow** | Inline edit amounts |
| **Interaction Count** | Typing |
| **User Input Required** | budget caps |
| **Input Type** | Number |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FinanceOverview |

### INT-312

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — WhatIf simulator |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Scenario plan |
| **User Goal** | Model future |
| **Flow** | Adjust sliders → calc |
| **Interaction Count** | 3 numbers |
| **User Input Required** | income,expense,savings |
| **Input Type** | Number |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-021 |

### INT-313

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Delete asset confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove asset |
| **User Goal** | Clean portfolio |
| **Flow** | Delete → window.confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-314

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Account remove confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove account |
| **User Goal** | Fix accounts list |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-315

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — EntryForm add transaction |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log money |
| **User Goal** | Track spend/income |
| **Flow** | Fill form → Add |
| **Interaction Count** | 6 fields |
| **User Input Required** | amount,type,category,account,date,note |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-020 EntryForm |

### INT-316

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Tab switch Overview/Tx/Analytics |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate finance views |
| **User Goal** | Analyze money |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-317

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Budget set/edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan spending |
| **User Goal** | Control budget |
| **Flow** | Inline edit amounts |
| **Interaction Count** | Typing |
| **User Input Required** | budget caps |
| **Input Type** | Number |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FinanceOverview |

### INT-318

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — WhatIf simulator |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Scenario plan |
| **User Goal** | Model future |
| **Flow** | Adjust sliders → calc |
| **Interaction Count** | 3 numbers |
| **User Input Required** | income,expense,savings |
| **Input Type** | Number |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-021 |

### INT-319

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Delete asset confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove asset |
| **User Goal** | Clean portfolio |
| **Flow** | Delete → window.confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-320

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Account remove confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove account |
| **User Goal** | Fix accounts list |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-321

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — EntryForm add transaction |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log money |
| **User Goal** | Track spend/income |
| **Flow** | Fill form → Add |
| **Interaction Count** | 6 fields |
| **User Input Required** | amount,type,category,account,date,note |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-020 EntryForm |

### INT-322

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Tab switch Overview/Tx/Analytics |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate finance views |
| **User Goal** | Analyze money |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-323

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Budget set/edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Plan spending |
| **User Goal** | Control budget |
| **Flow** | Inline edit amounts |
| **Interaction Count** | Typing |
| **User Input Required** | budget caps |
| **Input Type** | Number |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FinanceOverview |

### INT-324

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — WhatIf simulator |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Scenario plan |
| **User Goal** | Model future |
| **Flow** | Adjust sliders → calc |
| **Interaction Count** | 3 numbers |
| **User Input Required** | income,expense,savings |
| **Input Type** | Number |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-021 |

### INT-325

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Delete asset confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove asset |
| **User Goal** | Clean portfolio |
| **Flow** | Delete → window.confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-326

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Account remove confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove account |
| **User Goal** | Fix accounts list |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |

### INT-327

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — EntryForm add transaction |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log money |
| **User Goal** | Track spend/income |
| **Flow** | Fill form → Add |
| **Interaction Count** | 6 fields |
| **User Input Required** | amount,type,category,account,date,note |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-020 EntryForm |

### INT-328

| Attribute | Value |
|-----------|-------|
| **Feature** | Finance |
| **Location** | /finance — Tab switch Overview/Tx/Analytics |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate finance views |
| **User Goal** | Analyze money |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Finance.jsx |


## Calendar

### INT-329

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — View switch month/week |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Change calendar view |
| **User Goal** | See schedule |
| **Flow** | Toolbar click |
| **Interaction Count** | 1 click |
| **User Input Required** | view |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CalendarToolbar |

### INT-330

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — EventModal create/edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Schedule event |
| **User Goal** | Plan time |
| **Flow** | Click slot → fill → Save |
| **Interaction Count** | 6 fields |
| **User Input Required** | title,start,end,allDay,color,recurrence |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-022 EventModal |

### INT-331

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Quick-add inline |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Fast event |
| **User Goal** | Capture appointment |
| **Flow** | Type title → Enter |
| **Interaction Count** | Typing |
| **User Input Required** | title,time |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-023 CalendarShared |

### INT-332

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Event delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Cancel event |
| **User Goal** | Update calendar |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | EventModal |

### INT-333

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Sidebar mini-calendar day |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Jump date |
| **User Goal** | Navigate month |
| **Flow** | Click day cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Date |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CalendarSidebar |

### INT-334

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Metric month grid |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Habit overlay |
| **User Goal** | See habits on calendar |
| **Flow** | View overlay |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | MetricMonthGrid |

### INT-335

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — View switch month/week |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Change calendar view |
| **User Goal** | See schedule |
| **Flow** | Toolbar click |
| **Interaction Count** | 1 click |
| **User Input Required** | view |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CalendarToolbar |

### INT-336

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — EventModal create/edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Schedule event |
| **User Goal** | Plan time |
| **Flow** | Click slot → fill → Save |
| **Interaction Count** | 6 fields |
| **User Input Required** | title,start,end,allDay,color,recurrence |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-022 EventModal |

### INT-337

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Quick-add inline |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Fast event |
| **User Goal** | Capture appointment |
| **Flow** | Type title → Enter |
| **Interaction Count** | Typing |
| **User Input Required** | title,time |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-023 CalendarShared |

### INT-338

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Event delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Cancel event |
| **User Goal** | Update calendar |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | EventModal |

### INT-339

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Sidebar mini-calendar day |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Jump date |
| **User Goal** | Navigate month |
| **Flow** | Click day cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Date |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CalendarSidebar |

### INT-340

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Metric month grid |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Habit overlay |
| **User Goal** | See habits on calendar |
| **Flow** | View overlay |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | MetricMonthGrid |

### INT-341

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — View switch month/week |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Change calendar view |
| **User Goal** | See schedule |
| **Flow** | Toolbar click |
| **Interaction Count** | 1 click |
| **User Input Required** | view |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CalendarToolbar |

### INT-342

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — EventModal create/edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Schedule event |
| **User Goal** | Plan time |
| **Flow** | Click slot → fill → Save |
| **Interaction Count** | 6 fields |
| **User Input Required** | title,start,end,allDay,color,recurrence |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-022 EventModal |

### INT-343

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Quick-add inline |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Fast event |
| **User Goal** | Capture appointment |
| **Flow** | Type title → Enter |
| **Interaction Count** | Typing |
| **User Input Required** | title,time |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-023 CalendarShared |

### INT-344

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Event delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Cancel event |
| **User Goal** | Update calendar |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | EventModal |

### INT-345

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Sidebar mini-calendar day |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Jump date |
| **User Goal** | Navigate month |
| **Flow** | Click day cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Date |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CalendarSidebar |

### INT-346

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Metric month grid |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Habit overlay |
| **User Goal** | See habits on calendar |
| **Flow** | View overlay |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | MetricMonthGrid |

### INT-347

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — View switch month/week |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Change calendar view |
| **User Goal** | See schedule |
| **Flow** | Toolbar click |
| **Interaction Count** | 1 click |
| **User Input Required** | view |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CalendarToolbar |

### INT-348

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — EventModal create/edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Schedule event |
| **User Goal** | Plan time |
| **Flow** | Click slot → fill → Save |
| **Interaction Count** | 6 fields |
| **User Input Required** | title,start,end,allDay,color,recurrence |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-022 EventModal |

### INT-349

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Quick-add inline |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Fast event |
| **User Goal** | Capture appointment |
| **Flow** | Type title → Enter |
| **Interaction Count** | Typing |
| **User Input Required** | title,time |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-023 CalendarShared |

### INT-350

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Event delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Cancel event |
| **User Goal** | Update calendar |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | EventModal |

### INT-351

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Sidebar mini-calendar day |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Jump date |
| **User Goal** | Navigate month |
| **Flow** | Click day cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Date |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CalendarSidebar |

### INT-352

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Metric month grid |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Habit overlay |
| **User Goal** | See habits on calendar |
| **Flow** | View overlay |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | MetricMonthGrid |

### INT-353

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — View switch month/week |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Change calendar view |
| **User Goal** | See schedule |
| **Flow** | Toolbar click |
| **Interaction Count** | 1 click |
| **User Input Required** | view |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CalendarToolbar |

### INT-354

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — EventModal create/edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Schedule event |
| **User Goal** | Plan time |
| **Flow** | Click slot → fill → Save |
| **Interaction Count** | 6 fields |
| **User Input Required** | title,start,end,allDay,color,recurrence |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-022 EventModal |

### INT-355

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Quick-add inline |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Fast event |
| **User Goal** | Capture appointment |
| **Flow** | Type title → Enter |
| **Interaction Count** | Typing |
| **User Input Required** | title,time |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-023 CalendarShared |

### INT-356

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Event delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Cancel event |
| **User Goal** | Update calendar |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | EventModal |

### INT-357

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Sidebar mini-calendar day |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Jump date |
| **User Goal** | Navigate month |
| **Flow** | Click day cell |
| **Interaction Count** | 1 click |
| **User Input Required** | date |
| **Input Type** | Date |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | CalendarSidebar |

### INT-358

| Attribute | Value |
|-----------|-------|
| **Feature** | Calendar |
| **Location** | /calendar — Metric month grid |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Habit overlay |
| **User Goal** | See habits on calendar |
| **Flow** | View overlay |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | MetricMonthGrid |


## Family

### INT-359

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Add member form |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Register family member |
| **User Goal** | Health vault |
| **Flow** | Fill 10+ fields → Save |
| **Interaction Count** | 10+ fields |
| **User Input Required** | name,relation,DOB,blood,phone,... |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-024 MembersTab |

### INT-360

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Document upload |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Store document |
| **User Goal** | Secure files |
| **Flow** | Pick file → label → upload |
| **Interaction Count** | file+metadata |
| **User Input Required** | file,label,category |
| **Input Type** | File |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-025 DocumentsTab |

### INT-361

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Emergency card edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | ICE info |
| **User Goal** | Crisis readiness |
| **Flow** | Edit contacts/meds |
| **Interaction Count** | Many fields |
| **User Input Required** | contacts,meds,allergies |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-026 |

### INT-362

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Member delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove member |
| **User Goal** | Update vault |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | MembersTab |

### INT-363

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Tab switch Members/Docs/Emergency |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate vault |
| **User Goal** | Find info |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Family.jsx |

### INT-364

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Add member form |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Register family member |
| **User Goal** | Health vault |
| **Flow** | Fill 10+ fields → Save |
| **Interaction Count** | 10+ fields |
| **User Input Required** | name,relation,DOB,blood,phone,... |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-024 MembersTab |

### INT-365

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Document upload |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Store document |
| **User Goal** | Secure files |
| **Flow** | Pick file → label → upload |
| **Interaction Count** | file+metadata |
| **User Input Required** | file,label,category |
| **Input Type** | File |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-025 DocumentsTab |

### INT-366

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Emergency card edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | ICE info |
| **User Goal** | Crisis readiness |
| **Flow** | Edit contacts/meds |
| **Interaction Count** | Many fields |
| **User Input Required** | contacts,meds,allergies |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-026 |

### INT-367

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Member delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove member |
| **User Goal** | Update vault |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | MembersTab |

### INT-368

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Tab switch Members/Docs/Emergency |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate vault |
| **User Goal** | Find info |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Family.jsx |

### INT-369

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Add member form |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Register family member |
| **User Goal** | Health vault |
| **Flow** | Fill 10+ fields → Save |
| **Interaction Count** | 10+ fields |
| **User Input Required** | name,relation,DOB,blood,phone,... |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-024 MembersTab |

### INT-370

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Document upload |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Store document |
| **User Goal** | Secure files |
| **Flow** | Pick file → label → upload |
| **Interaction Count** | file+metadata |
| **User Input Required** | file,label,category |
| **Input Type** | File |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-025 DocumentsTab |

### INT-371

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Emergency card edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | ICE info |
| **User Goal** | Crisis readiness |
| **Flow** | Edit contacts/meds |
| **Interaction Count** | Many fields |
| **User Input Required** | contacts,meds,allergies |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-026 |

### INT-372

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Member delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove member |
| **User Goal** | Update vault |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | MembersTab |

### INT-373

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Tab switch Members/Docs/Emergency |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate vault |
| **User Goal** | Find info |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Family.jsx |

### INT-374

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Add member form |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Register family member |
| **User Goal** | Health vault |
| **Flow** | Fill 10+ fields → Save |
| **Interaction Count** | 10+ fields |
| **User Input Required** | name,relation,DOB,blood,phone,... |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-024 MembersTab |

### INT-375

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Document upload |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Store document |
| **User Goal** | Secure files |
| **Flow** | Pick file → label → upload |
| **Interaction Count** | file+metadata |
| **User Input Required** | file,label,category |
| **Input Type** | File |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-025 DocumentsTab |

### INT-376

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Emergency card edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | ICE info |
| **User Goal** | Crisis readiness |
| **Flow** | Edit contacts/meds |
| **Interaction Count** | Many fields |
| **User Input Required** | contacts,meds,allergies |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-026 |

### INT-377

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Member delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove member |
| **User Goal** | Update vault |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | MembersTab |

### INT-378

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Tab switch Members/Docs/Emergency |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate vault |
| **User Goal** | Find info |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Family.jsx |

### INT-379

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Add member form |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Register family member |
| **User Goal** | Health vault |
| **Flow** | Fill 10+ fields → Save |
| **Interaction Count** | 10+ fields |
| **User Input Required** | name,relation,DOB,blood,phone,... |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-024 MembersTab |

### INT-380

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Document upload |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Store document |
| **User Goal** | Secure files |
| **Flow** | Pick file → label → upload |
| **Interaction Count** | file+metadata |
| **User Input Required** | file,label,category |
| **Input Type** | File |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-025 DocumentsTab |

### INT-381

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Emergency card edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | ICE info |
| **User Goal** | Crisis readiness |
| **Flow** | Edit contacts/meds |
| **Interaction Count** | Many fields |
| **User Input Required** | contacts,meds,allergies |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-026 |

### INT-382

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Member delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove member |
| **User Goal** | Update vault |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | MembersTab |

### INT-383

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Tab switch Members/Docs/Emergency |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate vault |
| **User Goal** | Find info |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Family.jsx |

### INT-384

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Add member form |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Register family member |
| **User Goal** | Health vault |
| **Flow** | Fill 10+ fields → Save |
| **Interaction Count** | 10+ fields |
| **User Input Required** | name,relation,DOB,blood,phone,... |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-024 MembersTab |

### INT-385

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Document upload |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Store document |
| **User Goal** | Secure files |
| **Flow** | Pick file → label → upload |
| **Interaction Count** | file+metadata |
| **User Input Required** | file,label,category |
| **Input Type** | File |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-025 DocumentsTab |

### INT-386

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Emergency card edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | ICE info |
| **User Goal** | Crisis readiness |
| **Flow** | Edit contacts/meds |
| **Interaction Count** | Many fields |
| **User Input Required** | contacts,meds,allergies |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-026 |

### INT-387

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Member delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove member |
| **User Goal** | Update vault |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | MembersTab |

### INT-388

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Tab switch Members/Docs/Emergency |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate vault |
| **User Goal** | Find info |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Family.jsx |

### INT-389

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Add member form |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Register family member |
| **User Goal** | Health vault |
| **Flow** | Fill 10+ fields → Save |
| **Interaction Count** | 10+ fields |
| **User Input Required** | name,relation,DOB,blood,phone,... |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-024 MembersTab |

### INT-390

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Document upload |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Store document |
| **User Goal** | Secure files |
| **Flow** | Pick file → label → upload |
| **Interaction Count** | file+metadata |
| **User Input Required** | file,label,category |
| **Input Type** | File |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-025 DocumentsTab |

### INT-391

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Emergency card edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | ICE info |
| **User Goal** | Crisis readiness |
| **Flow** | Edit contacts/meds |
| **Interaction Count** | Many fields |
| **User Input Required** | contacts,meds,allergies |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-026 |

### INT-392

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Member delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove member |
| **User Goal** | Update vault |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | MembersTab |

### INT-393

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Tab switch Members/Docs/Emergency |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate vault |
| **User Goal** | Find info |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Family.jsx |

### INT-394

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Add member form |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Register family member |
| **User Goal** | Health vault |
| **Flow** | Fill 10+ fields → Save |
| **Interaction Count** | 10+ fields |
| **User Input Required** | name,relation,DOB,blood,phone,... |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-024 MembersTab |

### INT-395

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Document upload |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Store document |
| **User Goal** | Secure files |
| **Flow** | Pick file → label → upload |
| **Interaction Count** | file+metadata |
| **User Input Required** | file,label,category |
| **Input Type** | File |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-025 DocumentsTab |

### INT-396

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Emergency card edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | ICE info |
| **User Goal** | Crisis readiness |
| **Flow** | Edit contacts/meds |
| **Interaction Count** | Many fields |
| **User Input Required** | contacts,meds,allergies |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-026 |

### INT-397

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Member delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove member |
| **User Goal** | Update vault |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | MembersTab |

### INT-398

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Tab switch Members/Docs/Emergency |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate vault |
| **User Goal** | Find info |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Family.jsx |

### INT-399

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Add member form |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Register family member |
| **User Goal** | Health vault |
| **Flow** | Fill 10+ fields → Save |
| **Interaction Count** | 10+ fields |
| **User Input Required** | name,relation,DOB,blood,phone,... |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-024 MembersTab |

### INT-400

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Document upload |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Store document |
| **User Goal** | Secure files |
| **Flow** | Pick file → label → upload |
| **Interaction Count** | file+metadata |
| **User Input Required** | file,label,category |
| **Input Type** | File |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-025 DocumentsTab |

### INT-401

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Emergency card edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | ICE info |
| **User Goal** | Crisis readiness |
| **Flow** | Edit contacts/meds |
| **Interaction Count** | Many fields |
| **User Input Required** | contacts,meds,allergies |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-026 |

### INT-402

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Member delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove member |
| **User Goal** | Update vault |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | MembersTab |

### INT-403

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Tab switch Members/Docs/Emergency |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate vault |
| **User Goal** | Find info |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Family.jsx |

### INT-404

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Add member form |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Register family member |
| **User Goal** | Health vault |
| **Flow** | Fill 10+ fields → Save |
| **Interaction Count** | 10+ fields |
| **User Input Required** | name,relation,DOB,blood,phone,... |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-024 MembersTab |

### INT-405

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Document upload |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Store document |
| **User Goal** | Secure files |
| **Flow** | Pick file → label → upload |
| **Interaction Count** | file+metadata |
| **User Input Required** | file,label,category |
| **Input Type** | File |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-025 DocumentsTab |

### INT-406

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Emergency card edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | ICE info |
| **User Goal** | Crisis readiness |
| **Flow** | Edit contacts/meds |
| **Interaction Count** | Many fields |
| **User Input Required** | contacts,meds,allergies |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-026 |

### INT-407

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Member delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove member |
| **User Goal** | Update vault |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | MembersTab |

### INT-408

| Attribute | Value |
|-----------|-------|
| **Feature** | Family |
| **Location** | /family — Tab switch Members/Docs/Emergency |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Navigate vault |
| **User Goal** | Find info |
| **Flow** | Click tab |
| **Interaction Count** | 1 click |
| **User Input Required** | tab |
| **Input Type** | Tab |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Family.jsx |


## Focus / Pomodoro

### INT-409

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Start pomodoro |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Begin focus session |
| **User Goal** | Deep work |
| **Flow** | Click start |
| **Interaction Count** | 1 click |
| **User Input Required** | duration |
| **Input Type** | Timer |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | PomodoroTimer |

### INT-410

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Goal link select |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Tie session to goal |
| **User Goal** | Track focus per goal |
| **Flow** | Dropdown goal |
| **Interaction Count** | 1 select |
| **User Input Required** | goalId |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | PomodoroTimer |

### INT-411

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Post-session reflection |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Capture session quality |
| **User Goal** | Improve focus |
| **Flow** | Rate + notes → Save |
| **Interaction Count** | 2 fields |
| **User Input Required** | rating,notes |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-030 |

### INT-412

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Abandon flow confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Exit focus mode |
| **User Goal** | Leave session |
| **Flow** | Confirm abandon |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FocusRoom window.confirm |

### INT-413

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Ambient sound toggle |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Environment |
| **User Goal** | Reduce distraction |
| **Flow** | Toggle audio |
| **Interaction Count** | 1 click |
| **User Input Required** | audio on |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FocusRoom |

### INT-414

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Start pomodoro |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Begin focus session |
| **User Goal** | Deep work |
| **Flow** | Click start |
| **Interaction Count** | 1 click |
| **User Input Required** | duration |
| **Input Type** | Timer |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | PomodoroTimer |

### INT-415

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Goal link select |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Tie session to goal |
| **User Goal** | Track focus per goal |
| **Flow** | Dropdown goal |
| **Interaction Count** | 1 select |
| **User Input Required** | goalId |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | PomodoroTimer |

### INT-416

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Post-session reflection |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Capture session quality |
| **User Goal** | Improve focus |
| **Flow** | Rate + notes → Save |
| **Interaction Count** | 2 fields |
| **User Input Required** | rating,notes |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-030 |

### INT-417

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Abandon flow confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Exit focus mode |
| **User Goal** | Leave session |
| **Flow** | Confirm abandon |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FocusRoom window.confirm |

### INT-418

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Ambient sound toggle |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Environment |
| **User Goal** | Reduce distraction |
| **Flow** | Toggle audio |
| **Interaction Count** | 1 click |
| **User Input Required** | audio on |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FocusRoom |

### INT-419

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Start pomodoro |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Begin focus session |
| **User Goal** | Deep work |
| **Flow** | Click start |
| **Interaction Count** | 1 click |
| **User Input Required** | duration |
| **Input Type** | Timer |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | PomodoroTimer |

### INT-420

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Goal link select |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Tie session to goal |
| **User Goal** | Track focus per goal |
| **Flow** | Dropdown goal |
| **Interaction Count** | 1 select |
| **User Input Required** | goalId |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | PomodoroTimer |

### INT-421

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Post-session reflection |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Capture session quality |
| **User Goal** | Improve focus |
| **Flow** | Rate + notes → Save |
| **Interaction Count** | 2 fields |
| **User Input Required** | rating,notes |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-030 |

### INT-422

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Abandon flow confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Exit focus mode |
| **User Goal** | Leave session |
| **Flow** | Confirm abandon |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FocusRoom window.confirm |

### INT-423

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Ambient sound toggle |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Environment |
| **User Goal** | Reduce distraction |
| **Flow** | Toggle audio |
| **Interaction Count** | 1 click |
| **User Input Required** | audio on |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FocusRoom |

### INT-424

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Start pomodoro |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Begin focus session |
| **User Goal** | Deep work |
| **Flow** | Click start |
| **Interaction Count** | 1 click |
| **User Input Required** | duration |
| **Input Type** | Timer |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | PomodoroTimer |

### INT-425

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Goal link select |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Tie session to goal |
| **User Goal** | Track focus per goal |
| **Flow** | Dropdown goal |
| **Interaction Count** | 1 select |
| **User Input Required** | goalId |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | PomodoroTimer |

### INT-426

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Post-session reflection |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Capture session quality |
| **User Goal** | Improve focus |
| **Flow** | Rate + notes → Save |
| **Interaction Count** | 2 fields |
| **User Input Required** | rating,notes |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-030 |

### INT-427

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Abandon flow confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Exit focus mode |
| **User Goal** | Leave session |
| **Flow** | Confirm abandon |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FocusRoom window.confirm |

### INT-428

| Attribute | Value |
|-----------|-------|
| **Feature** | Focus / Pomodoro |
| **Location** | /focus — Ambient sound toggle |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Environment |
| **User Goal** | Reduce distraction |
| **Flow** | Toggle audio |
| **Interaction Count** | 1 click |
| **User Input Required** | audio on |
| **Input Type** | Boolean |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FocusRoom |


## Lab

### INT-429

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Module launcher pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Open experiment |
| **User Goal** | Use tool |
| **Flow** | Click module card |
| **Interaction Count** | 1 click |
| **User Input Required** | module key |
| **Input Type** | Navigation |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | LabFullPage ?module= |

### INT-430

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Vocal Mastery record |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Speaking practice |
| **User Goal** | Improve speech |
| **Flow** | Topic → record 60s → submit |
| **Interaction Count** | Voice |
| **User Input Required** | audio,topic |
| **Input Type** | Voice |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | VocalMastery |

### INT-431

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Decision Matrix criteria |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Decide between options |
| **User Goal** | Choose rationally |
| **Flow** | Add rows/cols → score |
| **Interaction Count** | Grid input |
| **User Input Required** | criteria,scores |
| **Input Type** | Matrix |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | DecisionMatrix |

### INT-432

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Typing test start |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Measure WPM |
| **User Goal** | Track typing |
| **Flow** | Select lesson → type |
| **Interaction Count** | Typing |
| **User Input Required** | typed text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | TypingTest |

### INT-433

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — ATS resume analyze |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Job match |
| **User Goal** | Tailor resume |
| **Flow** | Upload PDF + JD → Analyze |
| **Interaction Count** | File+text |
| **User Input Required** | resume,JD |
| **Input Type** | File+text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-043 ATSAnalyzer |

### INT-434

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Flashcard review |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Spaced repetition |
| **User Goal** | Learn domain |
| **Flow** | Flip → rate recall |
| **Interaction Count** | Clicks |
| **User Input Required** | box rating |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FlashcardLeitner |

### INT-435

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Addiction log craving |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Track urge |
| **User Goal** | Recovery |
| **Flow** | Form submit |
| **Interaction Count** | 3 fields |
| **User Input Required** | substance,intensity,trigger |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-042 |

### INT-436

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Module launcher pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Open experiment |
| **User Goal** | Use tool |
| **Flow** | Click module card |
| **Interaction Count** | 1 click |
| **User Input Required** | module key |
| **Input Type** | Navigation |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | LabFullPage ?module= |

### INT-437

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Vocal Mastery record |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Speaking practice |
| **User Goal** | Improve speech |
| **Flow** | Topic → record 60s → submit |
| **Interaction Count** | Voice |
| **User Input Required** | audio,topic |
| **Input Type** | Voice |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | VocalMastery |

### INT-438

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Decision Matrix criteria |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Decide between options |
| **User Goal** | Choose rationally |
| **Flow** | Add rows/cols → score |
| **Interaction Count** | Grid input |
| **User Input Required** | criteria,scores |
| **Input Type** | Matrix |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | DecisionMatrix |

### INT-439

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Typing test start |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Measure WPM |
| **User Goal** | Track typing |
| **Flow** | Select lesson → type |
| **Interaction Count** | Typing |
| **User Input Required** | typed text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | TypingTest |

### INT-440

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — ATS resume analyze |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Job match |
| **User Goal** | Tailor resume |
| **Flow** | Upload PDF + JD → Analyze |
| **Interaction Count** | File+text |
| **User Input Required** | resume,JD |
| **Input Type** | File+text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-043 ATSAnalyzer |

### INT-441

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Flashcard review |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Spaced repetition |
| **User Goal** | Learn domain |
| **Flow** | Flip → rate recall |
| **Interaction Count** | Clicks |
| **User Input Required** | box rating |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FlashcardLeitner |

### INT-442

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Addiction log craving |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Track urge |
| **User Goal** | Recovery |
| **Flow** | Form submit |
| **Interaction Count** | 3 fields |
| **User Input Required** | substance,intensity,trigger |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-042 |

### INT-443

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Module launcher pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Open experiment |
| **User Goal** | Use tool |
| **Flow** | Click module card |
| **Interaction Count** | 1 click |
| **User Input Required** | module key |
| **Input Type** | Navigation |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | LabFullPage ?module= |

### INT-444

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Vocal Mastery record |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Speaking practice |
| **User Goal** | Improve speech |
| **Flow** | Topic → record 60s → submit |
| **Interaction Count** | Voice |
| **User Input Required** | audio,topic |
| **Input Type** | Voice |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | VocalMastery |

### INT-445

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Decision Matrix criteria |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Decide between options |
| **User Goal** | Choose rationally |
| **Flow** | Add rows/cols → score |
| **Interaction Count** | Grid input |
| **User Input Required** | criteria,scores |
| **Input Type** | Matrix |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | DecisionMatrix |

### INT-446

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Typing test start |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Measure WPM |
| **User Goal** | Track typing |
| **Flow** | Select lesson → type |
| **Interaction Count** | Typing |
| **User Input Required** | typed text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | TypingTest |

### INT-447

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — ATS resume analyze |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Job match |
| **User Goal** | Tailor resume |
| **Flow** | Upload PDF + JD → Analyze |
| **Interaction Count** | File+text |
| **User Input Required** | resume,JD |
| **Input Type** | File+text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-043 ATSAnalyzer |

### INT-448

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Flashcard review |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Spaced repetition |
| **User Goal** | Learn domain |
| **Flow** | Flip → rate recall |
| **Interaction Count** | Clicks |
| **User Input Required** | box rating |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FlashcardLeitner |

### INT-449

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Addiction log craving |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Track urge |
| **User Goal** | Recovery |
| **Flow** | Form submit |
| **Interaction Count** | 3 fields |
| **User Input Required** | substance,intensity,trigger |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-042 |

### INT-450

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Module launcher pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Open experiment |
| **User Goal** | Use tool |
| **Flow** | Click module card |
| **Interaction Count** | 1 click |
| **User Input Required** | module key |
| **Input Type** | Navigation |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | LabFullPage ?module= |

### INT-451

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Vocal Mastery record |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Speaking practice |
| **User Goal** | Improve speech |
| **Flow** | Topic → record 60s → submit |
| **Interaction Count** | Voice |
| **User Input Required** | audio,topic |
| **Input Type** | Voice |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | VocalMastery |

### INT-452

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Decision Matrix criteria |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Decide between options |
| **User Goal** | Choose rationally |
| **Flow** | Add rows/cols → score |
| **Interaction Count** | Grid input |
| **User Input Required** | criteria,scores |
| **Input Type** | Matrix |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | DecisionMatrix |

### INT-453

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Typing test start |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Measure WPM |
| **User Goal** | Track typing |
| **Flow** | Select lesson → type |
| **Interaction Count** | Typing |
| **User Input Required** | typed text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | TypingTest |

### INT-454

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — ATS resume analyze |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Job match |
| **User Goal** | Tailor resume |
| **Flow** | Upload PDF + JD → Analyze |
| **Interaction Count** | File+text |
| **User Input Required** | resume,JD |
| **Input Type** | File+text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-043 ATSAnalyzer |

### INT-455

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Flashcard review |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Spaced repetition |
| **User Goal** | Learn domain |
| **Flow** | Flip → rate recall |
| **Interaction Count** | Clicks |
| **User Input Required** | box rating |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FlashcardLeitner |

### INT-456

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Addiction log craving |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Track urge |
| **User Goal** | Recovery |
| **Flow** | Form submit |
| **Interaction Count** | 3 fields |
| **User Input Required** | substance,intensity,trigger |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-042 |

### INT-457

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Module launcher pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Open experiment |
| **User Goal** | Use tool |
| **Flow** | Click module card |
| **Interaction Count** | 1 click |
| **User Input Required** | module key |
| **Input Type** | Navigation |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | LabFullPage ?module= |

### INT-458

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Vocal Mastery record |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Speaking practice |
| **User Goal** | Improve speech |
| **Flow** | Topic → record 60s → submit |
| **Interaction Count** | Voice |
| **User Input Required** | audio,topic |
| **Input Type** | Voice |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | VocalMastery |

### INT-459

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Decision Matrix criteria |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Decide between options |
| **User Goal** | Choose rationally |
| **Flow** | Add rows/cols → score |
| **Interaction Count** | Grid input |
| **User Input Required** | criteria,scores |
| **Input Type** | Matrix |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | DecisionMatrix |

### INT-460

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Typing test start |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Measure WPM |
| **User Goal** | Track typing |
| **Flow** | Select lesson → type |
| **Interaction Count** | Typing |
| **User Input Required** | typed text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | TypingTest |

### INT-461

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — ATS resume analyze |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Job match |
| **User Goal** | Tailor resume |
| **Flow** | Upload PDF + JD → Analyze |
| **Interaction Count** | File+text |
| **User Input Required** | resume,JD |
| **Input Type** | File+text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-043 ATSAnalyzer |

### INT-462

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Flashcard review |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Spaced repetition |
| **User Goal** | Learn domain |
| **Flow** | Flip → rate recall |
| **Interaction Count** | Clicks |
| **User Input Required** | box rating |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FlashcardLeitner |

### INT-463

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Addiction log craving |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Track urge |
| **User Goal** | Recovery |
| **Flow** | Form submit |
| **Interaction Count** | 3 fields |
| **User Input Required** | substance,intensity,trigger |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-042 |

### INT-464

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Module launcher pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Open experiment |
| **User Goal** | Use tool |
| **Flow** | Click module card |
| **Interaction Count** | 1 click |
| **User Input Required** | module key |
| **Input Type** | Navigation |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | LabFullPage ?module= |

### INT-465

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Vocal Mastery record |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Speaking practice |
| **User Goal** | Improve speech |
| **Flow** | Topic → record 60s → submit |
| **Interaction Count** | Voice |
| **User Input Required** | audio,topic |
| **Input Type** | Voice |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | VocalMastery |

### INT-466

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Decision Matrix criteria |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Decide between options |
| **User Goal** | Choose rationally |
| **Flow** | Add rows/cols → score |
| **Interaction Count** | Grid input |
| **User Input Required** | criteria,scores |
| **Input Type** | Matrix |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | DecisionMatrix |

### INT-467

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Typing test start |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Measure WPM |
| **User Goal** | Track typing |
| **Flow** | Select lesson → type |
| **Interaction Count** | Typing |
| **User Input Required** | typed text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | TypingTest |

### INT-468

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — ATS resume analyze |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Job match |
| **User Goal** | Tailor resume |
| **Flow** | Upload PDF + JD → Analyze |
| **Interaction Count** | File+text |
| **User Input Required** | resume,JD |
| **Input Type** | File+text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-043 ATSAnalyzer |

### INT-469

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Flashcard review |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Spaced repetition |
| **User Goal** | Learn domain |
| **Flow** | Flip → rate recall |
| **Interaction Count** | Clicks |
| **User Input Required** | box rating |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FlashcardLeitner |

### INT-470

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Addiction log craving |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Track urge |
| **User Goal** | Recovery |
| **Flow** | Form submit |
| **Interaction Count** | 3 fields |
| **User Input Required** | substance,intensity,trigger |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-042 |

### INT-471

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Module launcher pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Open experiment |
| **User Goal** | Use tool |
| **Flow** | Click module card |
| **Interaction Count** | 1 click |
| **User Input Required** | module key |
| **Input Type** | Navigation |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | LabFullPage ?module= |

### INT-472

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Vocal Mastery record |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Speaking practice |
| **User Goal** | Improve speech |
| **Flow** | Topic → record 60s → submit |
| **Interaction Count** | Voice |
| **User Input Required** | audio,topic |
| **Input Type** | Voice |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | VocalMastery |

### INT-473

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Decision Matrix criteria |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Decide between options |
| **User Goal** | Choose rationally |
| **Flow** | Add rows/cols → score |
| **Interaction Count** | Grid input |
| **User Input Required** | criteria,scores |
| **Input Type** | Matrix |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 6 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | DecisionMatrix |

### INT-474

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Typing test start |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Measure WPM |
| **User Goal** | Track typing |
| **Flow** | Select lesson → type |
| **Interaction Count** | Typing |
| **User Input Required** | typed text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | TypingTest |

### INT-475

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — ATS resume analyze |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Job match |
| **User Goal** | Tailor resume |
| **Flow** | Upload PDF + JD → Analyze |
| **Interaction Count** | File+text |
| **User Input Required** | resume,JD |
| **Input Type** | File+text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-043 ATSAnalyzer |

### INT-476

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Flashcard review |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Spaced repetition |
| **User Goal** | Learn domain |
| **Flow** | Flip → rate recall |
| **Interaction Count** | Clicks |
| **User Input Required** | box rating |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | FlashcardLeitner |

### INT-477

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Addiction log craving |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Track urge |
| **User Goal** | Recovery |
| **Flow** | Form submit |
| **Interaction Count** | 3 fields |
| **User Input Required** | substance,intensity,trigger |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-042 |

### INT-478

| Attribute | Value |
|-----------|-------|
| **Feature** | Lab |
| **Location** | /lab — Module launcher pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Open experiment |
| **User Goal** | Use tool |
| **Flow** | Click module card |
| **Interaction Count** | 1 click |
| **User Input Required** | module key |
| **Input Type** | Navigation |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | LabFullPage ?module= |


## Placements / Career

### INT-479

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — Application intake modal |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Track application |
| **User Goal** | Manage pipeline |
| **Flow** | Fill → Submit |
| **Interaction Count** | 6 fields |
| **User Input Required** | company,role,stage,date,notes,link |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-027 |

### INT-480

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — Pipeline stage drag/click |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Move application |
| **User Goal** | Update status |
| **Flow** | Click stage column |
| **Interaction Count** | 1-2 clicks |
| **User Input Required** | stage |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Placements pipeline |

### INT-481

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — Resume archive upload |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Store resume version |
| **User Goal** | Version control |
| **Flow** | PDF upload |
| **Interaction Count** | File |
| **User Input Required** | pdf,tags |
| **Input Type** | File |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-028 |

### INT-482

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — ATS analyze inline |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Match score |
| **User Goal** | Improve resume |
| **Flow** | Upload + paste JD |
| **Interaction Count** | File+text |
| **User Input Required** | resume,JD |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | ATSAnalyzer |

### INT-483

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — Abandon track confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove application |
| **User Goal** | Clean pipeline |
| **Flow** | Confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Placements |

### INT-484

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — Application intake modal |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Track application |
| **User Goal** | Manage pipeline |
| **Flow** | Fill → Submit |
| **Interaction Count** | 6 fields |
| **User Input Required** | company,role,stage,date,notes,link |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-027 |

### INT-485

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — Pipeline stage drag/click |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Move application |
| **User Goal** | Update status |
| **Flow** | Click stage column |
| **Interaction Count** | 1-2 clicks |
| **User Input Required** | stage |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Placements pipeline |

### INT-486

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — Resume archive upload |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Store resume version |
| **User Goal** | Version control |
| **Flow** | PDF upload |
| **Interaction Count** | File |
| **User Input Required** | pdf,tags |
| **Input Type** | File |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-028 |

### INT-487

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — ATS analyze inline |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Match score |
| **User Goal** | Improve resume |
| **Flow** | Upload + paste JD |
| **Interaction Count** | File+text |
| **User Input Required** | resume,JD |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | ATSAnalyzer |

### INT-488

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — Abandon track confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove application |
| **User Goal** | Clean pipeline |
| **Flow** | Confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Placements |

### INT-489

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — Application intake modal |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Track application |
| **User Goal** | Manage pipeline |
| **Flow** | Fill → Submit |
| **Interaction Count** | 6 fields |
| **User Input Required** | company,role,stage,date,notes,link |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-027 |

### INT-490

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — Pipeline stage drag/click |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Move application |
| **User Goal** | Update status |
| **Flow** | Click stage column |
| **Interaction Count** | 1-2 clicks |
| **User Input Required** | stage |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Placements pipeline |

### INT-491

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — Resume archive upload |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Store resume version |
| **User Goal** | Version control |
| **Flow** | PDF upload |
| **Interaction Count** | File |
| **User Input Required** | pdf,tags |
| **Input Type** | File |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-028 |

### INT-492

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — ATS analyze inline |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Match score |
| **User Goal** | Improve resume |
| **Flow** | Upload + paste JD |
| **Interaction Count** | File+text |
| **User Input Required** | resume,JD |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | ATSAnalyzer |

### INT-493

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — Abandon track confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove application |
| **User Goal** | Clean pipeline |
| **Flow** | Confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Placements |

### INT-494

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — Application intake modal |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Track application |
| **User Goal** | Manage pipeline |
| **Flow** | Fill → Submit |
| **Interaction Count** | 6 fields |
| **User Input Required** | company,role,stage,date,notes,link |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-027 |

### INT-495

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — Pipeline stage drag/click |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Move application |
| **User Goal** | Update status |
| **Flow** | Click stage column |
| **Interaction Count** | 1-2 clicks |
| **User Input Required** | stage |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Placements pipeline |

### INT-496

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — Resume archive upload |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Store resume version |
| **User Goal** | Version control |
| **Flow** | PDF upload |
| **Interaction Count** | File |
| **User Input Required** | pdf,tags |
| **Input Type** | File |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-028 |

### INT-497

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — ATS analyze inline |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Match score |
| **User Goal** | Improve resume |
| **Flow** | Upload + paste JD |
| **Interaction Count** | File+text |
| **User Input Required** | resume,JD |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | ATSAnalyzer |

### INT-498

| Attribute | Value |
|-----------|-------|
| **Feature** | Placements / Career |
| **Location** | /placements — Abandon track confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove application |
| **User Goal** | Clean pipeline |
| **Flow** | Confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Placements |


## Account / Settings

### INT-499

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Profile save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Update identity |
| **User Goal** | Personalize |
| **Flow** | Edit fields → Save |
| **Interaction Count** | 4 fields |
| **User Input Required** | name,location,bio,avatar |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-034 ProfileSection |

### INT-500

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Nav pin editor |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Customize nav |
| **User Goal** | Quick access |
| **Flow** | Drag/toggle pins → Save |
| **Interaction Count** | Multi select |
| **User Input Required** | pinnedIds |
| **Input Type** | Multi |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-036 NavPinEditor |

### INT-501

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Theme swatch pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Visual theme |
| **User Goal** | Comfort |
| **Flow** | Click swatch |
| **Interaction Count** | 1 click |
| **User Input Required** | theme |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Settings/Personalization |

### INT-502

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Password change |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Security |
| **User Goal** | Protect account |
| **Flow** | 3 fields → Update |
| **Interaction Count** | 3 fields |
| **User Input Required** | current,new,confirm |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-037 SecuritySection |

### INT-503

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Data export |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Portability |
| **User Goal** | Own data |
| **Flow** | Click export |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | — |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-038 DataSection |

### INT-504

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Delete account confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Leave product |
| **User Goal** | Remove data |
| **Flow** | Type confirm → delete |
| **Interaction Count** | Confirm text |
| **User Input Required** | confirm phrase |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 8 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-039 ConfirmDialog |

### INT-505

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Subscription upgrade |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Premium access |
| **User Goal** | Unlock tiers |
| **Flow** | Click upgrade CTA |
| **Interaction Count** | 1+ clicks |
| **User Input Required** | plan |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SubscriptionSection |

### INT-506

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Profile save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Update identity |
| **User Goal** | Personalize |
| **Flow** | Edit fields → Save |
| **Interaction Count** | 4 fields |
| **User Input Required** | name,location,bio,avatar |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-034 ProfileSection |

### INT-507

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Nav pin editor |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Customize nav |
| **User Goal** | Quick access |
| **Flow** | Drag/toggle pins → Save |
| **Interaction Count** | Multi select |
| **User Input Required** | pinnedIds |
| **Input Type** | Multi |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-036 NavPinEditor |

### INT-508

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Theme swatch pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Visual theme |
| **User Goal** | Comfort |
| **Flow** | Click swatch |
| **Interaction Count** | 1 click |
| **User Input Required** | theme |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Settings/Personalization |

### INT-509

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Password change |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Security |
| **User Goal** | Protect account |
| **Flow** | 3 fields → Update |
| **Interaction Count** | 3 fields |
| **User Input Required** | current,new,confirm |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-037 SecuritySection |

### INT-510

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Data export |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Portability |
| **User Goal** | Own data |
| **Flow** | Click export |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | — |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-038 DataSection |

### INT-511

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Delete account confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Leave product |
| **User Goal** | Remove data |
| **Flow** | Type confirm → delete |
| **Interaction Count** | Confirm text |
| **User Input Required** | confirm phrase |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 8 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-039 ConfirmDialog |

### INT-512

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Subscription upgrade |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Premium access |
| **User Goal** | Unlock tiers |
| **Flow** | Click upgrade CTA |
| **Interaction Count** | 1+ clicks |
| **User Input Required** | plan |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SubscriptionSection |

### INT-513

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Profile save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Update identity |
| **User Goal** | Personalize |
| **Flow** | Edit fields → Save |
| **Interaction Count** | 4 fields |
| **User Input Required** | name,location,bio,avatar |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-034 ProfileSection |

### INT-514

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Nav pin editor |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Customize nav |
| **User Goal** | Quick access |
| **Flow** | Drag/toggle pins → Save |
| **Interaction Count** | Multi select |
| **User Input Required** | pinnedIds |
| **Input Type** | Multi |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-036 NavPinEditor |

### INT-515

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Theme swatch pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Visual theme |
| **User Goal** | Comfort |
| **Flow** | Click swatch |
| **Interaction Count** | 1 click |
| **User Input Required** | theme |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Settings/Personalization |

### INT-516

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Password change |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Security |
| **User Goal** | Protect account |
| **Flow** | 3 fields → Update |
| **Interaction Count** | 3 fields |
| **User Input Required** | current,new,confirm |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-037 SecuritySection |

### INT-517

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Data export |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Portability |
| **User Goal** | Own data |
| **Flow** | Click export |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | — |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-038 DataSection |

### INT-518

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Delete account confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Leave product |
| **User Goal** | Remove data |
| **Flow** | Type confirm → delete |
| **Interaction Count** | Confirm text |
| **User Input Required** | confirm phrase |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 8 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-039 ConfirmDialog |

### INT-519

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Subscription upgrade |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Premium access |
| **User Goal** | Unlock tiers |
| **Flow** | Click upgrade CTA |
| **Interaction Count** | 1+ clicks |
| **User Input Required** | plan |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SubscriptionSection |

### INT-520

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Profile save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Update identity |
| **User Goal** | Personalize |
| **Flow** | Edit fields → Save |
| **Interaction Count** | 4 fields |
| **User Input Required** | name,location,bio,avatar |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-034 ProfileSection |

### INT-521

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Nav pin editor |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Customize nav |
| **User Goal** | Quick access |
| **Flow** | Drag/toggle pins → Save |
| **Interaction Count** | Multi select |
| **User Input Required** | pinnedIds |
| **Input Type** | Multi |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-036 NavPinEditor |

### INT-522

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Theme swatch pick |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Visual theme |
| **User Goal** | Comfort |
| **Flow** | Click swatch |
| **Interaction Count** | 1 click |
| **User Input Required** | theme |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Settings/Personalization |

### INT-523

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Password change |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Security |
| **User Goal** | Protect account |
| **Flow** | 3 fields → Update |
| **Interaction Count** | 3 fields |
| **User Input Required** | current,new,confirm |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-037 SecuritySection |

### INT-524

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Data export |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Portability |
| **User Goal** | Own data |
| **Flow** | Click export |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | — |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-038 DataSection |

### INT-525

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Delete account confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Leave product |
| **User Goal** | Remove data |
| **Flow** | Type confirm → delete |
| **Interaction Count** | Confirm text |
| **User Input Required** | confirm phrase |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 8 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-039 ConfirmDialog |

### INT-526

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Subscription upgrade |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Premium access |
| **User Goal** | Unlock tiers |
| **Flow** | Click upgrade CTA |
| **Interaction Count** | 1+ clicks |
| **User Input Required** | plan |
| **Input Type** | MC |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SubscriptionSection |

### INT-527

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Profile save |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Update identity |
| **User Goal** | Personalize |
| **Flow** | Edit fields → Save |
| **Interaction Count** | 4 fields |
| **User Input Required** | name,location,bio,avatar |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-034 ProfileSection |

### INT-528

| Attribute | Value |
|-----------|-------|
| **Feature** | Account / Settings |
| **Location** | /account /settings — Nav pin editor |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Customize nav |
| **User Goal** | Quick access |
| **Flow** | Drag/toggle pins → Save |
| **Interaction Count** | Multi select |
| **User Input Required** | pinnedIds |
| **Input Type** | Multi |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-036 NavPinEditor |


## Insights / Reports / Sports / Identity / Notes / Discipline

### INT-529

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Insights domain filter |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Filter AI insights |
| **User Goal** | Focus domain |
| **Flow** | Click domain card |
| **Interaction Count** | 1 click |
| **User Input Required** | domain |
| **Input Type** | Filter |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Insights.jsx |

### INT-530

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Reports period select |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Time range |
| **User Goal** | See report |
| **Flow** | Pick week/month |
| **Interaction Count** | 1 select |
| **User Input Required** | period |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Reports.jsx |

### INT-531

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Sports match preview |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Sports glance |
| **User Goal** | Track teams |
| **Flow** | Scroll cards |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Sports.jsx |

### INT-532

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Identity arc view/edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Self concept |
| **User Goal** | Know identity |
| **Flow** | Read/edit arc |
| **Interaction Count** | Typing |
| **User Input Required** | arc text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Identity.jsx ArcEditor |

### INT-533

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Notes new (N shortcut) |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Quick note |
| **User Goal** | Capture idea |
| **Flow** | Press N → type |
| **Interaction Count** | Typing |
| **User Input Required** | title,body |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-044 Notes.jsx |

### INT-534

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Notes delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove note |
| **User Goal** | Clean notes |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Notes.jsx |

### INT-535

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Discipline trigger log |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log trigger |
| **User Goal** | Break pattern |
| **Flow** | Open modal → fill |
| **Interaction Count** | 3 fields |
| **User Input Required** | trigger,intensity,replacement |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-029 TriggerModal |

### INT-536

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Discipline score view |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | See score |
| **User Goal** | Monitor discipline |
| **Flow** | View dashboard |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Discipline.jsx |

### INT-537

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Insights domain filter |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Filter AI insights |
| **User Goal** | Focus domain |
| **Flow** | Click domain card |
| **Interaction Count** | 1 click |
| **User Input Required** | domain |
| **Input Type** | Filter |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Insights.jsx |

### INT-538

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Reports period select |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Time range |
| **User Goal** | See report |
| **Flow** | Pick week/month |
| **Interaction Count** | 1 select |
| **User Input Required** | period |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Reports.jsx |

### INT-539

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Sports match preview |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Sports glance |
| **User Goal** | Track teams |
| **Flow** | Scroll cards |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Sports.jsx |

### INT-540

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Identity arc view/edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Self concept |
| **User Goal** | Know identity |
| **Flow** | Read/edit arc |
| **Interaction Count** | Typing |
| **User Input Required** | arc text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Identity.jsx ArcEditor |

### INT-541

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Notes new (N shortcut) |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Quick note |
| **User Goal** | Capture idea |
| **Flow** | Press N → type |
| **Interaction Count** | Typing |
| **User Input Required** | title,body |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-044 Notes.jsx |

### INT-542

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Notes delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove note |
| **User Goal** | Clean notes |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Notes.jsx |

### INT-543

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Discipline trigger log |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log trigger |
| **User Goal** | Break pattern |
| **Flow** | Open modal → fill |
| **Interaction Count** | 3 fields |
| **User Input Required** | trigger,intensity,replacement |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-029 TriggerModal |

### INT-544

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Discipline score view |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | See score |
| **User Goal** | Monitor discipline |
| **Flow** | View dashboard |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Discipline.jsx |

### INT-545

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Insights domain filter |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Filter AI insights |
| **User Goal** | Focus domain |
| **Flow** | Click domain card |
| **Interaction Count** | 1 click |
| **User Input Required** | domain |
| **Input Type** | Filter |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Insights.jsx |

### INT-546

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Reports period select |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Time range |
| **User Goal** | See report |
| **Flow** | Pick week/month |
| **Interaction Count** | 1 select |
| **User Input Required** | period |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Reports.jsx |

### INT-547

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Sports match preview |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Sports glance |
| **User Goal** | Track teams |
| **Flow** | Scroll cards |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Sports.jsx |

### INT-548

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Identity arc view/edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Self concept |
| **User Goal** | Know identity |
| **Flow** | Read/edit arc |
| **Interaction Count** | Typing |
| **User Input Required** | arc text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Identity.jsx ArcEditor |

### INT-549

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Notes new (N shortcut) |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Quick note |
| **User Goal** | Capture idea |
| **Flow** | Press N → type |
| **Interaction Count** | Typing |
| **User Input Required** | title,body |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-044 Notes.jsx |

### INT-550

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Notes delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove note |
| **User Goal** | Clean notes |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Notes.jsx |

### INT-551

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Discipline trigger log |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Log trigger |
| **User Goal** | Break pattern |
| **Flow** | Open modal → fill |
| **Interaction Count** | 3 fields |
| **User Input Required** | trigger,intensity,replacement |
| **Input Type** | Mixed |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 5 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-029 TriggerModal |

### INT-552

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Discipline score view |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | See score |
| **User Goal** | Monitor discipline |
| **Flow** | View dashboard |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Discipline.jsx |

### INT-553

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Insights domain filter |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Filter AI insights |
| **User Goal** | Focus domain |
| **Flow** | Click domain card |
| **Interaction Count** | 1 click |
| **User Input Required** | domain |
| **Input Type** | Filter |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | Partial |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Insights.jsx |

### INT-554

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Reports period select |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Time range |
| **User Goal** | See report |
| **Flow** | Pick week/month |
| **Interaction Count** | 1 select |
| **User Input Required** | period |
| **Input Type** | Dropdown |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Reports.jsx |

### INT-555

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Sports match preview |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Sports glance |
| **User Goal** | Track teams |
| **Flow** | Scroll cards |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Sports.jsx |

### INT-556

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Identity arc view/edit |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Self concept |
| **User Goal** | Know identity |
| **Flow** | Read/edit arc |
| **Interaction Count** | Typing |
| **User Input Required** | arc text |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Identity.jsx ArcEditor |

### INT-557

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Notes new (N shortcut) |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Quick note |
| **User Goal** | Capture idea |
| **Flow** | Press N → type |
| **Interaction Count** | Typing |
| **User Input Required** | title,body |
| **Input Type** | Free text |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 3 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | Partial |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | F-044 Notes.jsx |

### INT-558

| Attribute | Value |
|-----------|-------|
| **Feature** | Insights / Reports / Sports / Identity / Notes / Discipline |
| **Location** | various — Notes delete confirm |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Remove note |
| **User Goal** | Clean notes |
| **Flow** | Delete → confirm |
| **Interaction Count** | 2 clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 4 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | Notes.jsx |


## Legal / Brand / Dev

### INT-559

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Legal page read |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Policy review |
| **User Goal** | Compliance |
| **Flow** | Scroll |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | legal/* |

### INT-560

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Seed data dev page |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Populate test data |
| **User Goal** | Dev only |
| **Flow** | Click seed buttons |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | — |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SeedData.jsx |

### INT-561

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Admin panel table wipe |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Dev admin |
| **User Goal** | Reset data |
| **Flow** | Select table → confirm |
| **Interaction Count** | 2+ clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | AdminPanel |

### INT-562

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Legal page read |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Policy review |
| **User Goal** | Compliance |
| **Flow** | Scroll |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | legal/* |

### INT-563

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Seed data dev page |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Populate test data |
| **User Goal** | Dev only |
| **Flow** | Click seed buttons |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | — |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SeedData.jsx |

### INT-564

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Admin panel table wipe |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Dev admin |
| **User Goal** | Reset data |
| **Flow** | Select table → confirm |
| **Interaction Count** | 2+ clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | AdminPanel |

### INT-565

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Legal page read |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Policy review |
| **User Goal** | Compliance |
| **Flow** | Scroll |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | legal/* |

### INT-566

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Seed data dev page |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Populate test data |
| **User Goal** | Dev only |
| **Flow** | Click seed buttons |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | — |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SeedData.jsx |

### INT-567

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Admin panel table wipe |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Dev admin |
| **User Goal** | Reset data |
| **Flow** | Select table → confirm |
| **Interaction Count** | 2+ clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | AdminPanel |

### INT-568

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Legal page read |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Policy review |
| **User Goal** | Compliance |
| **Flow** | Scroll |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | legal/* |

### INT-569

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Seed data dev page |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Populate test data |
| **User Goal** | Dev only |
| **Flow** | Click seed buttons |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | — |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SeedData.jsx |

### INT-570

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Admin panel table wipe |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Dev admin |
| **User Goal** | Reset data |
| **Flow** | Select table → confirm |
| **Interaction Count** | 2+ clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | AdminPanel |

### INT-571

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Legal page read |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Policy review |
| **User Goal** | Compliance |
| **Flow** | Scroll |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | legal/* |

### INT-572

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Seed data dev page |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Populate test data |
| **User Goal** | Dev only |
| **Flow** | Click seed buttons |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | — |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SeedData.jsx |

### INT-573

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Admin panel table wipe |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Dev admin |
| **User Goal** | Reset data |
| **Flow** | Select table → confirm |
| **Interaction Count** | 2+ clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | AdminPanel |

### INT-574

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Legal page read |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Policy review |
| **User Goal** | Compliance |
| **Flow** | Scroll |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | legal/* |

### INT-575

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Seed data dev page |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Populate test data |
| **User Goal** | Dev only |
| **Flow** | Click seed buttons |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | — |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SeedData.jsx |

### INT-576

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Admin panel table wipe |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Dev admin |
| **User Goal** | Reset data |
| **Flow** | Select table → confirm |
| **Interaction Count** | 2+ clicks |
| **User Input Required** | confirm |
| **Input Type** | Destructive |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 7 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | AdminPanel |

### INT-577

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Legal page read |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Policy review |
| **User Goal** | Compliance |
| **Flow** | Scroll |
| **Interaction Count** | Scroll |
| **User Input Required** | — |
| **Input Type** | Read-only |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 1 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | legal/* |

### INT-578

| Attribute | Value |
|-----------|-------|
| **Feature** | Legal / Brand / Dev |
| **Location** | public — Seed data dev page |
| **Trigger** | Click/Navigation/Shortcut/Typing |
| **Purpose** | Populate test data |
| **User Goal** | Dev only |
| **Flow** | Click seed buttons |
| **Interaction Count** | 1 click |
| **User Input Required** | — |
| **Input Type** | — |
| **Could be inferred?** | NO |
| **Friction (1-10)** | 2 |
| **Decision Fatigue (1-10)** | 3 |
| **Memory Load (1-10)** | 3 |
| **Context Switching** | NO |
| **Interruptible** | YES |
| **Postponable** | YES |
| **Auto-recoverable** | NO |
| **AI Potential** | No |
| **Improvements** | Reduce fields; infer from context |
| **Related Components** | SeedData.jsx |

