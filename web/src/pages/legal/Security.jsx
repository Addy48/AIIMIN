import React from 'react';
import LegalLayout, {
    LegalSection as Section,
    LegalPara as Para,
    LegalTable as Table,
} from './LegalLayout';
import { LEGAL } from '../../constants/legal';

const link = { color: 'var(--accent)' };

const Security = () => {
    return (
        <LegalLayout
            title="Security Statement"
            lastUpdated={LEGAL.effectiveDate}
            description="The security controls AIIMIN has live today, the controls that are planned with dates, and the claims we deliberately do not make."
            canonicalPath="/security"
        >
            <Section title="How to read this page">
                <Para>
                    Effective {LEGAL.effectiveDate}. This page is written to be verifiable. If a control is not live yet,
                    it is marked <strong>planned</strong> and dated.
                </Para>
            </Section>

            <Section title="What is in place">
                <Table
                    caption="Security controls live today"
                    head={['Area', 'Control']}
                    rows={[
                        ['Transport', 'TLS 1.2+ everywhere; HSTS on aiimin.in; certificate pinning in the Android app'],
                        ['Authentication', 'Session tokens with short-lived caching; PIN stored as a salted hash; rate limiting on sign-in; optional biometric unlock on Android'],
                        ['Authorisation', 'Every database table carries row-level security keyed to your account; the server derives your identity from the session and never trusts a client-supplied user id'],
                        ['Secrets', 'Held in a managed secrets store, never in source control'],
                        ['Data at rest', 'Managed database encryption; additional column-level encryption for OAuth tokens, document identification numbers, and journal content'],
                        ['Files', 'Private object storage; every download uses a short-lived, single-use signed link; no public buckets'],
                        ['Third-party tokens', 'Encrypted; deleted when you disconnect or delete your account'],
                        ['Isolation', 'Production data is never copied into development or testing; test data is synthetic'],
                        ['Logging', 'Requests, security events, and a content-free activity log you can read yourself in Account → Privacy'],
                        ['Dependencies', 'Automated dependency and container scanning in CI'],
                        ['Backups', 'Encrypted, with a documented restore procedure that we rehearse'],
                        ['Vault', 'The Family area can be locked behind PIN or biometrics and re-locks automatically'],
                    ]}
                />
            </Section>

            <Section title="Planned, with dates">
                <Table
                    caption="Controls not yet live"
                    head={['Control', 'Target']}
                    rows={[
                        ['Web application firewall in front of the API', 'With the cloud migration wave'],
                        ['CloudWatch alarms + on-call notification for API errors, latency, queue age', 'Wave 0'],
                        ['SSH access limited to session-manager only', 'Wave 0'],
                        ['Independent penetration test before public launch', 'Wave 13'],
                        ['Client-side (end-to-end) encryption for journal and vault, with a recovery kit', 'V1.1 — deliberately not shipped without recovery, because a lost key means lost data'],
                    ]}
                />
            </Section>

            <Section title="What we do not claim">
                <Para>
                    We do not claim end-to-end encryption today. Our systems can technically read the content we store,
                    which is why access is restricted, logged, and limited to support you request or law requires.
                </Para>
            </Section>

            <Section title="Report a vulnerability">
                <Para>
                    Email <a href={`mailto:${LEGAL.emails.security}`} style={link}>{LEGAL.emails.security}</a>. Please do
                    not test against other people&apos;s accounts.
                </Para>
            </Section>
        </LegalLayout>
    );
};

export default Security;
