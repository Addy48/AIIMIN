import React from 'react';
import LegalLayout, { LegalSection as Section, LegalPara as Para } from './LegalLayout';

const About = () => {
    return (
        <LegalLayout title="About AIIMIN">
            <Section title="What is AIIMIN?">
                <Para>AIIMIN is a personal life operating system built by a developer for their own use. It centralizes daily habits, productivity tracking, focus sessions, and personal goals into a single private dashboard — designed to bring clarity and accountability to daily life without distraction.</Para>
                <Para>This is not a commercial product or public SaaS platform. AIIMIN is a personal project built and maintained by one person, and access is limited to its creator.</Para>
            </Section>
            <Section title="Google Integrations">
                <Para>AIIMIN connects to Google Calendar and YouTube via read-only OAuth integrations. These connections display your own data — your upcoming events, your video activity — inside your personal dashboard. AIIMIN does not write to or modify any Google data.</Para>
                <Para>All Google API usage follows the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google API Services User Data Policy</a>, including the Limited Use requirements. Your Google data is used only within your personal dashboard and is never shared, exported, or transferred to any third party.</Para>
            </Section>
            <Section title="Privacy Commitment">
                <Para>Your data is not sold, monetized, or shared with anyone. It lives in a private database, encrypted at rest, and exists solely to power your own dashboard. There are no ads, no tracking pixels, and no analytics services running on this platform.</Para>
                <Para>For full details, see the <a href="/privacy" style={{ color: 'var(--accent)' }}>Privacy Policy</a>. For questions, reach out at <a href="mailto:aadityaupadhyay10@gmail.com" style={{ color: 'var(--accent)' }}>aadityaupadhyay10@gmail.com</a>.</Para>
            </Section>
        </LegalLayout>
    );
};

export default About;
