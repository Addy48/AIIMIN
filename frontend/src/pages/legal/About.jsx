import React from 'react';
import LegalLayout, {
    LegalSection as Section,
    LegalPara as Para,
    LegalList as List,
} from './LegalLayout';
import { LEGAL } from '../../constants/legal';

const link = { color: 'var(--accent)' };

const About = () => {
    return (
        <LegalLayout
            title="About AIIMIN"
            lastUpdated={LEGAL.effectiveDate}
            description="What AIIMIN is, who operates it, how it is priced, and the four data commitments that will not change."
            canonicalPath="/about"
        >
            <Section title="What AIIMIN is">
                <Para>
                    AIIMIN is a Personal Life OS. You put your life into it — days, habits, money, documents, people,
                    practice sessions — and it gives you back an honest picture. One screen replaces the scattered set of
                    habit trackers, spreadsheets, note apps and reminders most people juggle.
                </Para>
                <Para>
                    It runs on the web at aiimin.in, on phones as a capture surface at aiimin.in/m, and as a native
                    Android companion (closed device testing now — status at <a href="/app" style={link}>/app</a>).
                    The same account, the same data, and the same legal terms apply on every surface.
                </Para>
            </Section>

            <Section title="Who operates it">
                <Para>
                    {LEGAL.entityNote} It is built and maintained by {LEGAL.operator}. Contact details, including the
                    Grievance Officer, are on the <a href="/contact" style={link}>Contact</a> page.
                </Para>
            </Section>

            <Section title="How it is priced">
                <Para>
                    AIIMIN is a paid product with a free tier. <strong>Explore</strong> is free and stays free.
                    {' '}<strong>Core</strong>, <strong>Pro</strong> and <strong>Elite</strong> are paid monthly
                    subscriptions in Indian Rupees. Founding rates apply to waitlist members for the stated period. Plan
                    prices, renewal, cancellation and refunds are set out in{' '}
                    <a href="/refunds" style={link}>Refund, Billing &amp; Cancellation</a>.
                </Para>
            </Section>

            <Section title="Four commitments that will not change">
                <List
                    ordered
                    items={[
                        <><strong>Your data is yours.</strong> We are a steward, not an owner.</>,
                        <><strong>We do not sell, rent, or share your personal data</strong> with anyone for their own purposes, and we never use it for advertising.</>,
                        <><strong>You can export everything, and you can delete everything.</strong> Both are available inside the app, at any time, on every surface.</>,
                        <><strong>Your journal is treated as private reflection.</strong> It is excluded from analytics and from any automated processing you did not personally ask for, entry by entry.</>,
                    ]}
                />
            </Section>

            <Section title="Legal documents">
                <Para>
                    Every policy — privacy, terms, security, deletion, cookies, acceptable use, refunds, AI disclosure,
                    grievance redressal and subprocessors — is indexed at <a href="/legal" style={link}>/legal</a>.
                </Para>
            </Section>
        </LegalLayout>
    );
};

export default About;
