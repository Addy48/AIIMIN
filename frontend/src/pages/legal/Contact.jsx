import React from 'react';
import LegalLayout, {
    LegalSection as Section,
    LegalPara as Para,
    LegalTable as Table,
} from './LegalLayout';
import { LEGAL, ADDRESS_FALLBACK } from '../../constants/legal';

const link = { color: 'var(--accent)' };

const mailto = (address) => <a href={`mailto:${address}`} style={link}>{address}</a>;

const Contact = () => {
    return (
        <LegalLayout
            title="Contact"
            lastUpdated={LEGAL.effectiveDate}
            description="How to reach AIIMIN for support, privacy, security and data-protection grievances, including the Grievance Officer and our response targets."
            canonicalPath="/contact"
        >
            <Section title="Who you are contacting">
                <Para>{LEGAL.entityNote}</Para>
                <Para>{ADDRESS_FALLBACK}</Para>
                {/* TODO(founder): publish registered address — DPDP Rules 2025 requirement */}
            </Section>

            <Section title="Where to write">
                <Table
                    caption="Contact addresses by topic"
                    head={['Topic', 'Email']}
                    rows={[
                        ['Product support, billing, refunds', mailto(LEGAL.emails.support)],
                        ['Privacy questions, export and deletion requests', mailto(LEGAL.emails.privacy)],
                        ['Security vulnerability reports', mailto(LEGAL.emails.security)],
                        ['Data-protection grievances and nominations', mailto(LEGAL.emails.grievance)],
                        ['Legal notices', mailto(LEGAL.emails.legal)],
                    ]}
                />
            </Section>

            <Section title="Grievance Officer">
                <Para>
                    <strong>{LEGAL.grievanceOfficer}</strong> · {mailto(LEGAL.emails.grievance)}
                </Para>
                <Para>
                    This is the named person responsible for answering questions about how we process your personal data,
                    published under the DPDP Act 2023 and DPDP Rules 2025. Full process at{' '}
                    <a href="/grievance" style={link}>Grievance Redressal</a>.
                </Para>
            </Section>

            <Section title="Response targets">
                <Table
                    caption="How quickly we respond"
                    head={['Stage', 'Timeline']}
                    rows={[
                        ['Acknowledgement', '3 working days'],
                        ['Substantive response', '7 working days target'],
                        ['Statutory maximum', '90 days, as required by the DPDP Rules'],
                    ]}
                />
            </Section>
        </LegalLayout>
    );
};

export default Contact;
