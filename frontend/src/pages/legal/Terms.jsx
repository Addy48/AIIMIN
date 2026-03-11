import React from 'react';
import LegalLayout, { LegalSection as Section, LegalPara as Para } from './LegalLayout';

const Terms = () => {
    return (
        <LegalLayout title="Terms of Service" lastUpdated="March 5, 2026">
            <Section title="1. Service Description">
                <Para>AIIMIN is a personal productivity dashboard developed and used by its creator. It is not a commercial service and does not offer public user registration. The Service is designed to support the creator's daily routines, goal tracking, and integration with personal digital tools.</Para>
            </Section>
            <Section title="2. Acceptable Use">
                <Para>You agree to use AIIMIN strictly for personal, non-commercial productivity purposes. You may not:</Para>
                <Para>- Interfere with or disrupt the integrity or performance of the Service.</Para>
                <Para>- Attempt to gain unauthorized access to the Service or its related systems.</Para>
                <Para>- Use the Service for any illegal activities or to violate any laws in your jurisdiction.</Para>
            </Section>
            <Section title="3. User Responsibilities">
                <Para>You are responsible for maintaining the confidentiality of your account credentials (handled via Google OAuth) and for all activities that occur under your account.</Para>
            </Section>
            <Section title="4. Third-Party Integrations">
                <Para>AIIMIN integrates with third-party APIs to provide certain features. We are not responsible for the availability, accuracy, or reliability of these third-party services. Your relationship with those services is governed by their respective terms and privacy policies.</Para>
                <Para>In particular, your use of Google services within AIIMIN is subject to the <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google Terms of Service</a>.</Para>
            </Section>
            <Section title="5. Account Suspension and Termination">
                <Para>We reserve the right to suspend or terminate your access to the Service at any time, without notice or liability, for any reason, including if you breach these Terms.</Para>
            </Section>
            <Section title="6. Limitation of Liability">
                <Para>To the maximum extent permitted by law, AIIMIN shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, resulting from your use of the Service.</Para>
            </Section>
            <Section title="7. Google Integrations">
                <Para><strong>Google Calendar:</strong> AIIMIN connects to the Google Calendar API with read-only access to display your calendar events within the dashboard. No calendar data is modified, exported, or shared with third parties.</Para>
                <Para><strong>YouTube:</strong> AIIMIN connects to the YouTube Data API with read-only access to display your YouTube activity within the dashboard. No YouTube data is modified, exported, or shared with third parties.</Para>
                <Para>All Google API usage complies with the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google API Services User Data Policy</a>, including the Limited Use requirements. You can revoke AIIMIN's Google access at any time via your Google Account settings.</Para>
            </Section>
            <Section title="8. Governing Law">
                <Para>These Terms are governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Uttar Pradesh, India.</Para>
            </Section>
            <Section title="9. Contact">
                <Para>If you have any questions about these Terms, please contact: <a href="mailto:aadityaupadhyay10@gmail.com" style={{ color: 'var(--accent)' }}>aadityaupadhyay10@gmail.com</a></Para>
            </Section>
        </LegalLayout>
    );
};

export default Terms;
