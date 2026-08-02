# AIIMIN Google OAuth Verification Review Guide

Hello Google API Trust & Safety Team,

Thank you for reviewing the AIIMIN application. AIIMIN is a productivity dashboard that helps users track their habits, schedule, and digital consumption to build better behavioral routines.

## 1. Application Details
- **Project Name:** AIIMIN
- **Homepage:** https://aiimin.in
- **Privacy Policy:** https://aiimin.in/privacy
- **Terms of Service:** https://aiimin.in/terms
- **Google API Compliance & Limited Use:** https://aiimin.in/google-api-compliance

## 2. Test Account Credentials
To review the integration, please use the following test credentials on our live production environment:
- **URL:** https://aiimin.in/login
- **Email:** tester@aiimin.in
- **Password:** [Insert Secure Test Password Here]

## 3. Scope Justification (Why we need these permissions)
We specifically ask for the following scopes and only use them as described below to power core dashboard widgets:

### `calendar.readonly`
**Usage:** To display the user's daily agenda directly inside the "Focus Schedule" widget. We do not edit, delete, or create calendar events. The data is kept exclusively on the client dashboard interface and is never shared, sold, or used for advertising.

### `youtube.readonly`
**Usage:** To allow the user to select and play their own focus music playlists within the built-in "Focus Session" Pomodoro timer. We only read playlist titles/thumbnails to populate the selection grid. We do not monitor watch history or analyze video consumption for marketing purposes.

## 4. Limited Use Compliance
All use of Google user data adheres strictly to the **Google API Services User Data Policy**, including the Limited Use requirements. You can verify our explicit disclosure of this policy both in the application authentication flow and at https://aiimin.in/privacy.

## 5. Screencast Walkthrough
We have recorded a walkthrough of the OAuth flow and application integration here:
**[Insert YouTube Link to Screencast Here]**

The video demonstrates:
1. The OAuth Consent Screen showing the client ID.
2. The user logging into AIIMIN.
3. The display of the calendar events inside the dashboard widget.
4. The YouTube integration fetching the user's playlists.

If you have any further questions or require additional details, please contact us at **support@aiimin.in**.
