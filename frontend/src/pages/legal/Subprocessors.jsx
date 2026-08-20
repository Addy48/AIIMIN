import React from 'react';
import LegalLayout, {
    LegalSection as Section,
    LegalPara as Para,
    LegalTable as Table,
} from './LegalLayout';
import { LEGAL } from '../../constants/legal';

const Subprocessors = () => {
    return (
        <LegalLayout
            title="Subprocessors & Third Parties"
            lastUpdated={LEGAL.effectiveDate}
            description="Every provider that processes data on AIIMIN's behalf, what data each one sees, and the region it is processed in."
            canonicalPath="/subprocessors"
        >
            <Section title="Overview">
                <Para>
                    Effective {LEGAL.effectiveDate}. We will update this page before adding a subprocessor that processes
                    personal data.
                </Para>
            </Section>

            <Section title="Current subprocessors">
                <Table
                    caption="Providers that process data on our behalf"
                    head={['Provider', 'Purpose', 'Data involved', 'Region']}
                    rows={[
                        ['Amazon Web Services', 'Application hosting, object storage, queues', 'All service data', 'India (ap-south-1)'],
                        ['Supabase (managed PostgreSQL)', 'Primary database', 'All service data', 'India region'],
                        ['Vercel', 'Website and web app hosting/CDN', 'Request metadata; static assets', 'Global edge'],
                        ['Google LLC', 'Sign-in (if you choose it); Calendar / Tasks / Drive / People APIs (if you connect them)', 'Google user data you authorised', 'Global'],
                        ['Google Gemini', 'AI tasks', 'Minimised prompt text', 'Global'],
                        ['Groq', 'AI tasks', 'Minimised prompt text', 'Global'],
                        ['OpenRouter', 'AI routing fallback', 'Minimised prompt text', 'Global'],
                        ['Resend', 'Transactional email', 'Email address, message content', 'Global'],
                        ['Upstash (Redis)', 'Rate limiting, caching', 'Technical identifiers', 'India / global'],
                        ['Stripe and/or Google Play Billing', 'Payments', 'Billing details handled by the processor; we never see your full card number', 'Global'],
                        ['Google Analytics 4', <>Product analytics — <strong>only with consent</strong></>, 'Event counts, pseudonymous id', 'Global'],
                        ['Sentry', <>Error reporting — <strong>only with consent</strong></>, 'Error context, scrubbed', 'Global'],
                    ]}
                />
                <Para>
                    We require each provider by contract to process data only on our instructions, to keep it secure, and
                    not to use it for their own purposes. Where transfers of EEA/UK data occur, Standard Contractual
                    Clauses apply.
                </Para>
            </Section>

            <Section title="Force majeure">
                <Para>
                    We are not liable for failures caused by events outside our reasonable control, including provider
                    outages, network failures, government action, or natural disaster. We will communicate honestly and
                    restore service as quickly as we can.
                </Para>
            </Section>
        </LegalLayout>
    );
};

export default Subprocessors;
