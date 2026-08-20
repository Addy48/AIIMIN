import React from 'react';
import LegalLayout, {
    LegalSection as Section,
    LegalPara as Para,
    LegalList as List,
} from './LegalLayout';
import { LEGAL } from '../../constants/legal';

const link = { color: 'var(--accent)' };

const AcceptableUse = () => {
    return (
        <LegalLayout
            title="Acceptable Use Policy"
            lastUpdated={LEGAL.effectiveDate}
            description="The small set of limits on how AIIMIN may be used, and how we enforce them — including your right to appeal and to export your data."
            canonicalPath="/acceptable-use"
        >
            <Section title="Overview">
                <Para>
                    Effective {LEGAL.effectiveDate}. AIIMIN is a private tool for your own life. Nearly everything is
                    allowed. These are the limits.
                </Para>
            </Section>

            <Section title="Do not">
                <List
                    ordered
                    items={[
                        'Use AIIMIN for anything illegal, or to store material whose possession is illegal.',
                        'Store or process other people\u2019s personal data without a lawful basis — that includes documents, health information, and contact details.',
                        'Attempt to access another account, or any data that is not yours.',
                        'Probe, scan, or attack the service, or bypass rate limits, quotas, tier gates, or payment.',
                        'Automate the service in ways that degrade it for others, or resell access.',
                        'Reverse engineer to extract our source or credentials, except where the law expressly allows it.',
                        'Use AI features to generate content that is unlawful, that harasses or defames a person, or that impersonates someone.',
                        'Upload malware, or content designed to break the document viewer or the parser.',
                        'Misrepresent your identity or age.',
                        'Use AIIMIN as a system of record for anything safety-critical, or as a substitute for professional medical, legal, or financial advice.',
                    ]}
                />
            </Section>

            <Section title="Enforcement">
                <Para>
                    Depending on severity we may warn you, restrict a feature, suspend the account, or terminate it. We
                    will tell you why, and you can appeal to{' '}
                    <a href={`mailto:${LEGAL.emails.grievance}`} style={link}>{LEGAL.emails.grievance}</a>. Where we must
                    act immediately to protect users or the service, we act first and explain after. Suspension does not
                    remove your right to export your data.
                </Para>
            </Section>
        </LegalLayout>
    );
};

export default AcceptableUse;
