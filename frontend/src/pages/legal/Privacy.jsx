import React from 'react';
import LegalLayout, { LegalSection as Section, LegalPara as Para } from './LegalLayout';

const Privacy = () => {
    return (
        <LegalLayout title="Privacy Policy" lastUpdated="May 25, 2026">
            <Section title="Overview">
                <Para>
                    This Privacy Policy describes how AIIMIN ("we," "our," or "the Application") collects, uses, and protects the personal information you provide when using our personal productivity dashboard at <a href="https://www.aiimin.in" style={{ color: 'var(--accent)' }}>www.aiimin.in</a>. We are committed to handling your data responsibly and transparently.
                </Para>
                <Para>
                    AIIMIN is a private, personal productivity dashboard. By using AIIMIN, you agree to the practices described in this policy.
                </Para>
            </Section>

            <Section title="1. Information We Collect">
                <Para><strong>Account Data:</strong> When you sign in using Google OAuth, we receive your basic Google profile information — your name, email address, and profile picture. This is used solely to create and maintain your account.</Para>
                <Para><strong>Dashboard Data:</strong> Daily log entries, goals, focus sessions, journal notes, habit records, finance data, and other productivity information you manually enter are stored securely and used exclusively to power your personal dashboard experience.</Para>
                <Para><strong>Google Calendar Data:</strong> If you connect Google Calendar, AIIMIN reads your calendar events using the Google Calendar API (read-only). This data is fetched in real time to display your schedule inside the dashboard. Calendar data is NOT permanently stored on our servers.</Para>
                <Para><strong>YouTube Data:</strong> If you connect YouTube, AIIMIN reads your public YouTube activity using the YouTube Data API (read-only). This data is displayed inside your dashboard and is NOT permanently stored on our servers.</Para>
                <Para><strong>OAuth Tokens:</strong> To maintain Google API connectivity, AIIMIN stores encrypted OAuth access tokens and refresh tokens on the server. These tokens are used only to fulfill API requests that you initiate within your dashboard session.</Para>
                <Para><strong>We do not collect</strong> advertising data, behavioral profiles, or any third-party analytics. There are no tracking pixels or marketing scripts on this platform.</Para>
            </Section>

            <Section title="2. Google API Services — Limited Use Policy">
                <Para>
                    <strong>AIIMIN's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google API Services User Data Policy</a>, including the Limited Use requirements.</strong>
                </Para>
                <Para>Specifically, AIIMIN complies with the following Limited Use requirements:</Para>
                <Para>
                    (a) <strong>Use is limited to providing the service:</strong> Google user data is used only to display your own data within your personal AIIMIN dashboard. It is not used for any other purpose.
                </Para>
                <Para>
                    (b) <strong>No transfer to third parties:</strong> We do not transfer, sell, share, license, or otherwise disclose Google user data to any third parties except as required to operate the service (e.g., our database hosting provider under strict confidentiality).
                </Para>
                <Para>
                    (c) <strong>No use for advertising:</strong> Google user data is never used to serve advertisements or for any advertising purpose.
                </Para>
                <Para>
                    (d) <strong>No use for unrelated purposes:</strong> Google user data is not used to train AI or machine learning models, build behavioral profiles, conduct research, or for any purpose other than displaying your data inside your own dashboard.
                </Para>
                <Para>
                    (e) <strong>Humans do not read your data:</strong> No human — including the developer — accesses your Google account data, except at your explicit request for support or as required by law.
                </Para>
            </Section>

            <Section title="3. Google OAuth Scopes We Request">
                <Para>AIIMIN requests the following Google OAuth scopes. We only request the minimum permissions necessary to provide each feature:</Para>
                <Para>
                    <strong>openid, email, profile</strong> — Required to authenticate your identity and create your account. We receive your name, email address, and profile picture.
                </Para>
                <Para>
                    <strong>https://www.googleapis.com/auth/calendar.readonly</strong> — Required to read (not modify) your Google Calendar events for display in the AIIMIN dashboard calendar view.
                </Para>
                <Para>
                    <strong>https://www.googleapis.com/auth/calendar.events</strong> — Used for displaying detailed event information within your personal calendar view. AIIMIN does not create, modify, or delete any calendar events.
                </Para>
                <Para>
                    <strong>https://www.googleapis.com/auth/youtube.readonly</strong> — Required to read (not modify) your YouTube activity for display in your personal AIIMIN dashboard.
                </Para>
                <Para>
                    You can revoke any or all of these permissions at any time via your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google Account Permissions</a> page. Revoking access immediately disables the corresponding features in your dashboard.
                </Para>
            </Section>

            <Section title="4. How We Use Your Data">
                <Para>We use your data exclusively for the following purposes:</Para>
                <Para>• To authenticate your identity and maintain your session securely.</Para>
                <Para>• To display your personal productivity data, calendar events, and YouTube activity inside your dashboard.</Para>
                <Para>• To save and retrieve your manually entered dashboard data (goals, habits, journal entries, etc.).</Para>
                <Para>• To generate personalized AI-powered insights and summaries from your own data.</Para>
                <Para><strong>We do not sell, rent, or otherwise transfer your personal data to any third party.</strong></Para>
                <Para>We do not use your data for advertising, behavioral targeting, or any commercial purpose.</Para>
            </Section>

            <Section title="5. OAuth Token Storage & Security">
                <Para>OAuth access and refresh tokens obtained through Google authorization are stored in our database with AES encryption at rest. Tokens are:</Para>
                <Para>• Used only to make API calls on your behalf when you are actively using the dashboard.</Para>
                <Para>• Never shared with, sold to, or transferred to any third party.</Para>
                <Para>• Automatically invalidated if you revoke AIIMIN's access via your Google Account.</Para>
                <Para>• Permanently deleted when you delete your account or request data deletion.</Para>
            </Section>

            <Section title="6. Data Retention">
                <Para>We retain your data only for as long as your account is active and as needed to provide the Service.</Para>
                <Para>• <strong>Account data</strong> (name, email): Retained while your account is active.</Para>
                <Para>• <strong>Dashboard data</strong> (goals, logs, habits): Retained while your account is active and deleted upon account deletion.</Para>
                <Para>• <strong>Google API data</strong> (Calendar events, YouTube data): Fetched in real time; not permanently stored. Access tokens are deleted when you revoke access or delete your account.</Para>
                <Para>If you delete your account or request data deletion, all your personal data is permanently purged from our systems within 30 days.</Para>
            </Section>

            <Section title="7. Data Deletion">
                <Para>You have the right to request deletion of your data at any time. To request deletion:</Para>
                <Para>1. Email us at <a href="mailto:you@example.com" style={{ color: 'var(--accent)' }}>you@example.com</a> with the subject "Data Deletion Request".</Para>
                <Para>2. Or visit our <a href="/data-deletion" style={{ color: 'var(--accent)' }}>Data Deletion</a> page for self-service options.</Para>
                <Para>All data will be permanently deleted within 30 days of a verified deletion request.</Para>
                <Para>Additionally, you can revoke AIIMIN's Google OAuth access at any time from your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google Account Permissions</a> page, which will immediately cut off all Google data access.</Para>
            </Section>

            <Section title="8. Security Practices">
                <Para>AIIMIN employs the following security measures to protect your data:</Para>
                <Para>• <strong>HTTPS / TLS:</strong> All data in transit between your browser and our servers is encrypted using HTTPS.</Para>
                <Para>• <strong>Encrypted tokens:</strong> OAuth tokens are encrypted at rest using AES encryption.</Para>
                <Para>• <strong>Row-Level Security:</strong> Database access is restricted using row-level security policies ensuring users can only access their own data.</Para>
                <Para>• <strong>Minimal permissions:</strong> We request only the minimum OAuth scopes necessary for each feature.</Para>
                <Para>• <strong>No password storage:</strong> All authentication is handled through Supabase Auth and Google OAuth. We do not store passwords in plaintext.</Para>
            </Section>

            <Section title="9. Third-Party Service Providers">
                <Para>AIIMIN uses the following infrastructure providers, all under their own strict data protection policies:</Para>
                <Para>• <strong>Supabase</strong> — Database and authentication infrastructure. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Supabase Privacy Policy</a>.</Para>
                <Para>• <strong>Vercel</strong> — Application hosting and deployment. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Vercel Privacy Policy</a>.</Para>
                <Para>• <strong>Google APIs</strong> — Calendar and YouTube data access for features you explicitly connect. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google Privacy Policy</a>.</Para>
                <Para>We do not share your personal data with any other third parties beyond what is described above.</Para>
            </Section>

            <Section title="10. Cookies">
                <Para>AIIMIN uses only essential, functional cookies that are strictly necessary to operate the service:</Para>
                <Para>• <strong>Session cookie (aiimin_session):</strong> Maintains your authenticated session. This cookie is essential for you to remain logged in.</Para>
                <Para>We do not use advertising cookies, third-party tracking cookies, or any non-essential cookies. There is no cookie consent banner because we do not use non-essential cookies.</Para>
            </Section>

            <Section title="11. Your Rights">
                <Para>You have the following rights regarding your personal data:</Para>
                <Para>• <strong>Right to access:</strong> You can request a copy of the personal data we hold about you.</Para>
                <Para>• <strong>Right to correction:</strong> You can update your profile information directly in your dashboard settings.</Para>
                <Para>• <strong>Right to deletion:</strong> You can request permanent deletion of all your data at any time.</Para>
                <Para>• <strong>Right to revoke Google access:</strong> You can disconnect AIIMIN from your Google account at any time.</Para>
                <Para>To exercise any of these rights, contact us at <a href="mailto:you@example.com" style={{ color: 'var(--accent)' }}>you@example.com</a>.</Para>
            </Section>

            <Section title="12. Contact">
                <Para>If you have any questions, concerns, or requests regarding this Privacy Policy or the data we hold about you, please contact:</Para>
                <Para><strong>Hasmatullah Kumar</strong><br />Developer and sole operator of AIIMIN<br />Email: <a href="mailto:you@example.com" style={{ color: 'var(--accent)' }}>you@example.com</a><br />Website: <a href="https://www.aiimin.in" style={{ color: 'var(--accent)' }}>www.aiimin.in</a></Para>
            </Section>
        </LegalLayout>
    );
};

export default Privacy;
