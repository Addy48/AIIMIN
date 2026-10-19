import React from 'react';
import { Link } from 'react-router-dom';
import LegalLayout, {
    LegalSection as Section,
    LegalPara as Para,
} from './LegalLayout';
import { LEGAL, ADDRESS_FALLBACK, LEGAL_DOCUMENTS } from '../../constants/legal';

const link = { color: 'var(--accent)' };

const LegalHub = () => {
    return (
        <LegalLayout
            title="Legal & Trust"
            lastUpdated={LEGAL.effectiveDate}
            description="Index of every AIIMIN legal document — privacy, terms, security, deletion, cookies, acceptable use, refunds, AI disclosure, grievance redressal and subprocessors."
            canonicalPath="/legal"
        >
            <Section title="Every document, in one place">
                <Para>
                    All documents below are effective {LEGAL.effectiveDate} and cover every AIIMIN surface: aiimin.in, the
                    web app, aiimin.in/m, the Android app, and api.aiimin.in. There is exactly one Privacy Policy and one
                    Terms of Service across all surfaces.
                </Para>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {LEGAL_DOCUMENTS.map((doc) => (
                        <li key={doc.path}>
                            <Link
                                to={doc.path}
                                style={{
                                    display: 'block',
                                    padding: '14px 16px',
                                    minHeight: '44px',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg-card)',
                                    textDecoration: 'none',
                                }}
                            >
                                <span style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', alignItems: 'baseline' }}>
                                    <strong style={{ fontSize: '14px', color: 'var(--text-1)' }}>{doc.label}</strong>
                                    <span style={{ fontSize: '12px', color: 'var(--text-3)' }}>Effective {LEGAL.effectiveDate}</span>
                                </span>
                                <span style={{ display: 'block', fontSize: '13px', color: 'var(--text-2)', lineHeight: 1.6, marginTop: '4px' }}>
                                    {doc.summary}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section title="Exercise your rights in the app">
                <Para>
                    Export and deletion are self-service and always available — you do not need to email anyone.
                </Para>
                <Para>
                    <Link to="/account?section=privacy" style={link}>Account → Privacy → Export</Link> gives you a
                    machine-readable copy of everything we hold, plus your files.
                </Para>
                <Para>
                    <Link to="/account?section=privacy" style={link}>Account → Privacy → Delete</Link> lets you delete one
                    domain, wipe your life data while keeping your login, or delete your account entirely. Full detail at
                    {' '}<Link to="/data-deletion" style={link}>Data Deletion &amp; Export</Link>.
                </Para>
            </Section>

            <Section title="Grievance Officer">
                <Para>
                    <strong>{LEGAL.grievanceOfficer}</strong> ·{' '}
                    <a href={`mailto:${LEGAL.emails.grievance}`} style={link}>{LEGAL.emails.grievance}</a>
                </Para>
                <Para>{LEGAL.entityNote}</Para>
                <Para>{ADDRESS_FALLBACK}</Para>
                {/* TODO(founder): publish registered address — DPDP Rules 2025 requirement */}
                <Para>
                    Acknowledgement within 3 working days, substantive response targeted at 7 working days, and 90 days as
                    the statutory maximum. Details at <Link to="/grievance" style={link}>Grievance Redressal</Link>.
                </Para>
            </Section>

            <Section title="Archive of superseded versions">
                <Para>
                    This is the first published version of the AIIMIN legal pack, so there are no superseded versions yet.
                    When a document changes materially we will archive the previous version and link it here.
                </Para>
            </Section>
        </LegalLayout>
    );
};

export default LegalHub;
