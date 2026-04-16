import React from 'react';
import LegalLayout, { LegalSection as Section, LegalPara as Para } from './LegalLayout';

const Privacy = () => {
    return (
        <LegalLayout title="Privacy Policy" lastUpdated="March 5, 2026">
            <Section title="1. Information We Collect">
                <Para>We collect the following types of information to provide and operate our Service:</Para>
                <Para><strong>Account Data:</strong> When you sign in using Google OAuth, we collect your basic profile information (name, email address, and profile picture).</Para>
                <Para><strong>Dashboard Data:</strong> Daily log entries, goals, focus sessions, and other productivity data you manually enter into the dashboard are stored securely and used exclusively to power your personal dashboard experience.</Para>
                <Para>We do not use third-party analytics or tracking technologies.</Para>
            </Section>

            <Section title="2. Google OAuth and API Data">
                <Para>Our Service integrates with Google APIs to provide productivity features. All Google API access is read-only and used solely within your personal dashboard.</Para>
                <Para><strong>Google Calendar Data:</strong> AIIMIN uses the Google Calendar API (read-only) to display your calendar events inside your personal productivity dashboard. Calendar data is not permanently stored on our servers and is never shared with third parties.</Para>
                <Para><strong>YouTube Data:</strong> AIIMIN uses the YouTube Data API (read-only) to display your own YouTube activity within your personal dashboard. This data is not permanently stored and is never shared with third parties.</Para>
            </Section>

            <Section title="3. Google API Services Limited Use Policy">
                <Para>AIIMIN's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google API Services User Data Policy</a>, including the Limited Use requirements.</Para>
                <Para>Specifically: Google user data obtained via Google APIs is used solely to display information within your personal dashboard. It is not transferred to third parties, not used for advertising, and not used to train machine learning models. AIIMIN's use of information received from Google APIs does not exceed what is necessary to provide the features you have authorized.</Para>
            </Section>

            <Section title="4. How We Use Your Data">
                <Para>We use your data strictly to provide, maintain, and personalize the AIIMIN dashboard; synchronize your calendar and YouTube activity for display within your dashboard; and authenticate your identity securely.</Para>
                <Para><strong>We do not sell your personal data.</strong> We do not use your Google user data for advertising purposes, nor do we share it with third-party data brokers.</Para>
            </Section>

            <Section title="5. OAuth Token Storage">
                <Para>OAuth access tokens and refresh tokens obtained through Google sign-in are stored securely on the server using encryption at rest. Tokens are used only to fulfill API requests initiated by you within your dashboard session and are never exposed to other users or third parties.</Para>
                <Para>You can revoke AIIMIN's access to your Google account at any time via your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google Account Permissions</a> page. Revoking access will immediately disable all Google API features in the dashboard.</Para>
            </Section>

            <Section title="6. Data Retention">
                <Para>We retain your authentication tokens and basic profile data only for as long as your account is active. If you delete your account, or if your account is inactive for a prolonged period, we securely and permanently purge your data from our servers.</Para>
            </Section>

            <Section title="7. Data Deletion">
                <Para>You have the right to request the deletion of your data at any time. For detailed instructions, please visit our <a href="/data-deletion" style={{ color: 'var(--accent)' }}>Data Deletion Policy</a>.</Para>
            </Section>

            <Section title="8. Security Practices">
                <Para>We employ industry-standard security measures — including data encryption in transit via HTTPS and encryption at rest — to protect your information from unauthorized access or disclosure.</Para>
            </Section>

            <Section title="9. Third-Party Services">
                <Para>We integrate with Google APIs as described above. Our hosting and database infrastructure providers operate under their own data processing terms and are used solely to run this application. We do not share your private data with unrelated third-party services.</Para>
            </Section>

            <Section title="10. Your Rights">
                <Para>You have the right to access, correct, or delete your personal information at any time. To exercise these rights, contact us at <a href="mailto:aadityaupadhyay10@gmail.com" style={{ color: 'var(--accent)' }}>aadityaupadhyay10@gmail.com</a>.</Para>
            </Section>

            <Section title="11. Cookie Policy">
                <Para>AIIMIN uses minimal, strictly necessary cookies to keep your session active and maintain your authentication state. We do not use third-party tracking, advertising, or marketing cookies. By using the AIIMIN dashboard, you consent to the use of these essential functional cookies.</Para>
            </Section>
        </LegalLayout>
    );
};

export default Privacy;
