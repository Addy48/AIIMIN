import React from 'react';
import LegalLayout, {
    LegalSection as Section,
    LegalPara as Para,
    LegalList as List,
    LegalTable as Table,
} from './LegalLayout';
import { LEGAL, ADDRESS_FALLBACK } from '../../constants/legal';

const link = { color: 'var(--accent)' };

const Grievance = () => {
    return (
        <LegalLayout
            title="Grievance Redressal & Your Rights"
            lastUpdated={LEGAL.effectiveDate}
            description="AIIMIN's Grievance Officer, how to raise a data-protection grievance, our response timelines, and how to exercise your DPDP rights directly in the app."
            canonicalPath="/grievance"
        >
            <Section title="Overview">
                <Para>
                    Effective {LEGAL.effectiveDate}. Published under the DPDP Act 2023 and DPDP Rules 2025.
                </Para>
            </Section>

            <Section title="Grievance Officer">
                <Para>
                    <strong>{LEGAL.grievanceOfficer}</strong> ·{' '}
                    <a href={`mailto:${LEGAL.emails.grievance}`} style={link}>{LEGAL.emails.grievance}</a> · {LEGAL.entity}
                </Para>
                <Para>{ADDRESS_FALLBACK}</Para>
                {/* TODO(founder): publish registered address — DPDP Rules 2025 requirement */}
                <Para>This is the person who will answer questions about how we process your personal data.</Para>
            </Section>

            <Section title="How to raise a grievance">
                <Para>
                    Email <a href={`mailto:${LEGAL.emails.grievance}`} style={link}>{LEGAL.emails.grievance}</a> from your
                    registered address with: what happened, what you want us to do, and your OS-ID or account email. If you
                    cannot email, write to the postal address above.
                </Para>
            </Section>

            <Section title="What we promise">
                <Table
                    caption="Grievance response timelines"
                    head={['Stage', 'Timeline']}
                    rows={[
                        ['Acknowledgement', '3 working days'],
                        ['Substantive response', <><strong>7 working days target</strong>; 90 days maximum as required by the DPDP Rules</>],
                        ['Escalation if unresolved', 'We will tell you how to complain to the Data Protection Board of India'],
                    ]}
                />
            </Section>

            <Section title="Exercising your rights directly">
                <Para>Most rights are self-service and instant, inside the app:</Para>
                <List
                    items={[
                        <><strong>Access / portability</strong> — Account → Privacy → Export</>,
                        <><strong>Correction</strong> — edit the record; anything locked, email us</>,
                        <><strong>Erasure</strong> — Account → Privacy → Delete a domain, Wipe life data, or Delete account</>,
                        <><strong>Withdraw consent</strong> — Account → Privacy toggles</>,
                        <><strong>See what we hold and who touched it</strong> — Account → Privacy dashboard and activity log</>,
                    ]}
                />
            </Section>

            <Section title="Nomination">
                <Para>
                    Under section 14 of the DPDP Act you may nominate a person to exercise your rights if you die or become
                    incapable of exercising them. Email{' '}
                    <a href={`mailto:${LEGAL.emails.grievance}`} style={link}>{LEGAL.emails.grievance}</a> with the
                    nominee&apos;s name and contact details and we will record it against your account.
                </Para>
            </Section>

            <Section title="Complaining to the Board">
                <Para>
                    If we do not resolve your grievance, you may complain to the <strong>Data Protection Board of India</strong>.
                    Users in the EEA/UK may instead complain to their local supervisory authority.
                </Para>
            </Section>
        </LegalLayout>
    );
};

export default Grievance;
