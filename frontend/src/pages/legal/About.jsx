import React from 'react';
import LegalLayout, { LegalSection as Section, LegalPara as Para } from './LegalLayout';

const About = () => {
    return (
        <LegalLayout title="About AIIMIN">
            <Section title="About AIIMIN">
                <Para>AIIMIN is a calm, privacy-first personal life operating system designed to elevate focus, accountability, and behavioral awareness.</Para>
            </Section>
            <Section title="Our Mission">
                <Para>In an era of digital noise, AIIMIN aims to restore clarity. Our mission is to build software that respects your attention, shapes positive habits, and centralizes your daily priorities without selling your data or bombarding you with advertisements.</Para>
            </Section>
            <Section title="Core Features">
                <Para><strong>Behavioral OS:</strong> Track digital consumption and map it against focused work sessions.</Para>
                <Para><strong>Seamless Integrations:</strong> Secure, read-only syncing with Google Calendar and YouTube to provide a unified overview of your day.</Para>
                <Para><strong>Privacy By Default:</strong> Your data is encrypted, strictly utilized for your own dashboard, and never monetized.</Para>
            </Section>
        </LegalLayout>
    );
};

export default About;
