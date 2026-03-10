import React from 'react';
import LegalLayout, { LegalSection as Section, LegalPara as Para } from './LegalLayout';

const Terms = () => {
    return (
        <LegalLayout title="Terms of Service" lastUpdated="March 5, 2026">
            <Section title="1. Service Description">
                <Para>AIIMIN is a productivity dashboard and behavioral tracking application designed to help users manage their daily routines, calendar events, and digital consumption habits.</Para>
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
                <Para>AIIMIN utilizes third-party APIs (such as Google Calendar and YouTube). We are not responsible for the availability, accuracy, or reliability of these third-party services. Your relationship with those services is governed by their respective terms and privacy policies.</Para>
            </Section>
            <Section title="5. Account Suspension and Termination">
                <Para>We reserve the right to suspend or terminate your access to the Service at any time, without notice or liability, for any reason, including if you breach these Terms.</Para>
            </Section>
            <Section title="6. Limitation of Liability">
                <Para>To the maximum extent permitted by law, AIIMIN shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, resulting from your use of the Service.</Para>
            </Section>
        </LegalLayout>
    );
};

export default Terms;
