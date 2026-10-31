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
                    AIIMIN keeps your day, your money and your family&apos;s papers in one calm place. Tasks, focus and a
                    journal; money that fills itself from your bank SMS, read on your phone; documents, expiry reminders
                    and an emergency card for the people you look after. It only ever compares you with you.
                </Para>
                <Para>
                    It is an Android app (in closed testing now — status at <a href="/app" style={link}>/app</a>), with the
                    web at aiimin.in as its bigger screen. The same account and the same legal terms apply on both.
                </Para>
            </Section>

            <Section title="Who operates it">
                <Para>
                    {LEGAL.entityNote} Contact details, including the
                    Grievance Officer, are on the <a href="/contact" style={link}>Contact</a> page.
                </Para>
            </Section>

            <Section title="How it is priced">
                <Para>
                    <strong>Free</strong> is free for one person, for as long as you like. <strong>Plus</strong>,
                    {' '}<strong>Pro</strong> and <strong>Family</strong> are paid monthly or yearly subscriptions. In India they are priced in rupees;
                    elsewhere a local price applies, shown on the plans and charged in your own currency. Plan
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
