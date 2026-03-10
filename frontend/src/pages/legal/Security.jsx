import React from 'react';
import LegalLayout, { LegalSection as Section, LegalPara as Para } from './LegalLayout';

const Security = () => {
    return (
        <LegalLayout title="Security Practices" lastUpdated="March 5, 2026">
            <Section title="Security Architecture">
                <Para>At AIIMIN, protecting your personal data and connected accounts is foundational to our engineering architecture.</Para>
            </Section>
            <Section title="Practices">
                <Para><strong>HTTPS Encryption:</strong> All data transmitted between your browser and our servers is encrypted using industry-standard TLS (Transport Layer Security).</Para>
                <Para><strong>Authentication:</strong> We use stateless, token-based authentication (JWT) backed by secure OAuth 2.0 protocols to ensure passwords are never stored or handled by our systems.</Para>
                <Para><strong>Database Protection:</strong> Our database architectures utilize strictly defined Row Level Security (RLS) policies. Your data is isolated and completely inaccessible to other users.</Para>
                <Para><strong>Access Control:</strong> API access tokens granted by third parties (like Google) are securely encrypted at rest.</Para>
                <Para><strong>Minimal Scope:</strong> We aggressively limit the data we request, operating exclusively on read-only permissions for external integrations.</Para>
            </Section>
        </LegalLayout>
    );
};

export default Security;
