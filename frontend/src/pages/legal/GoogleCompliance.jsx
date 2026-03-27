import React from 'react';
import LegalLayout, { LegalSection as Section, LegalPara as Para } from './LegalLayout';

const GoogleCompliance = () => {
    return (
        <LegalLayout title="Google API Services Usage & Compliance" lastUpdated="March 5, 2026">
            <Section title="Google API Services Usage & Compliance">
                <Para>AIIMIN integrates with Google APIs to deliver a unified productivity experience. We recognize the profound responsibility of handling your data and are strictly committed to transparency and security.</Para>
            </Section>
            <Section title="1. How We Use Google User Data">
                <Para>AIIMIN utilizes Google OAuth for secure sign-in. Once authenticated, users may opt-in to connect specific Google services:</Para>
                <Para><strong>Google Calendar (calendar.readonly):</strong> Used exclusively to fetch and display your daily schedule securely within your AIIMIN dashboard.</Para>
                <Para><strong>YouTube (youtube.readonly):</strong> Used exclusively to track your personal video consumption habits, allowing you to monitor and adjust your digital behavior.</Para>
            </Section>
            <Section title="2. Limited Use Disclosure">
                <Para>AIIMIN's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google API Services User Data Policy</a>, including the Limited Use requirements.</Para>
            </Section>
            <Section title="3. Strict Data Prohibition">
                <Para>We guarantee that:</Para>
                <Para>— We do not sell your data.</Para>
                <Para>— We do not use your data for advertising purposes.</Para>
                <Para>— We do not read, transfer, or utilize your data for any purpose other than providing the core dashboard functionality you requested.</Para>
            </Section>
        </LegalLayout>
    );
};

export default GoogleCompliance;
