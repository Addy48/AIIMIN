import React from 'react';
import LegalLayout, { LegalSection as Section, LegalPara as Para } from './LegalLayout';

const Privacy = () => {
    return (
        <LegalLayout title="Privacy Policy" lastUpdated="March 5, 2026">
            <Section title="1. Information We Collect">
                <Para>We collect the following types of information to provide and improve our Service:</Para>
                <Para><strong>Account Data:</strong> When you sign in using Google OAuth, we collect your basic profile information (name, email address, and profile picture).</Para>
                <Para><strong>Usage Data:</strong> We may collect anonymous analytics regarding how you interact with the dashboard to improve the user experience.</Para>
            </Section>

            <Section title="2. Google OAuth and API Data">
                <Para>Our Service integrates with Google APIs to provide productivity features such as calendar synchronization and media tracking.</Para>
                <Para><strong>Google Calendar Data:</strong> We request read-only access to your calendar events to display your schedule within the AIIMIN dashboard.</Para>
                <Para><strong>YouTube Data:</strong> We request read-only access to your YouTube activity to track and visualize video consumption for behavioral awareness.</Para>
            </Section>

            <Section title="3. Google API Services Limited Use Policy">
                <Para>AIIMIN's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google API Services User Data Policy</a>, including the Limited Use requirements.</Para>
            </Section>

            <Section title="4. How We Use Your Data">
                <Para>We use your data strictly to provide, maintain, and personalize the AIIMIN dashboard; synchronize your calendar and media tracking seamlessly; and authenticate your identity securely.</Para>
                <Para><strong>We do not sell your personal data.</strong> We do not use your Google user data for advertising purposes, nor do we share it with third-party data brokers.</Para>
            </Section>

            <Section title="5. Data Retention">
                <Para>We retain your authentication tokens and basic profile data only for as long as your account is active. If you delete your account, or if your account is inactive for a prolonged period, we securely permanently purge your data from our servers.</Para>
            </Section>

            <Section title="6. Data Deletion">
                <Para>You have the right to request the deletion of your data at any time. For detailed instructions, please visit our <a href="/data-deletion" style={{ color: 'var(--accent)' }}>Data Deletion Policy</a>.</Para>
            </Section>

            <Section title="7. Security Practices">
                <Para>We employ industry-standard security measures (including data encryption in transit via HTTPS and at rest) to protect your information from unauthorized access or disclosure.</Para>
            </Section>

            <Section title="8. Third-Party Services">
                <Para>While we integrate with Google APIs, we do not share your private data with unrelated third-party services. Our infrastructure providers (e.g., hosting, database) are strictly bound by confidentiality agreements and act solely as data processors.</Para>
            </Section>

            <Section title="9. Your Rights">
                <Para>Under applicable privacy laws, you have the right to access, correct, or delete your personal information. If you wish to exercise these rights, please contact us via our Contact Page.</Para>
            </Section>

            <Section title="10. Cookie Policy">
                <Para>AIIMIN uses minimal, strictly necessary cookies to keep your session active and maintain your authentication state. We do not use third-party tracking, advertising, or marketing cookies. By using the AIIMIN dashboard, you consent to the use of these essential functional cookies.</Para>
            </Section>
        </LegalLayout>
    );
};

export default Privacy;
