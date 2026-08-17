import React from 'react';
import LegalLayout, {
    LegalSection as Section,
    LegalPara as Para,
    LegalTable as Table,
} from './LegalLayout';
import { LEGAL } from '../../constants/legal';

const link = { color: 'var(--accent)' };

const DataDeletion = () => {
    return (
        <LegalLayout
            title="Data Deletion & Export"
            lastUpdated={LEGAL.effectiveDate}
            description="Export everything from AIIMIN at any time, and delete a record, a domain, or your whole account — with the exact timelines for each."
            canonicalPath="/data-deletion"
        >
            <Section title="Export — always available">
                <Para>
                    <strong>Account → Privacy → Export.</strong> You get a JSON file containing every record we hold about
                    you, plus your uploaded files. Large accounts are prepared in the background and delivered as a
                    download link that expires in 7 days. There is no charge and no limit on how often you export.
                </Para>
            </Section>

            <Section title="Three levels of deletion">
                <Table
                    caption="Deletion levels and where to find each one"
                    head={['Level', 'What it does', 'Where', 'Reversible?']}
                    rows={[
                        [<strong>Delete a record</strong>, 'Removes a single entry', 'Anywhere in the app', '30-day recycle bin for journal, notes, documents, people, transactions; import batches can be undone in one tap'],
                        [<strong>Delete a domain</strong>, 'Removes everything in one area — money, English, health, contacts, documents, or journal — while keeping the rest', 'Account → Privacy', 'No'],
                        [<strong>Delete your account</strong>, 'Removes your account and all life data', 'Account → Privacy → Delete account, confirmed by typing DELETE', 'No'],
                    ]}
                />
                <Para>
                    There is also <strong>Wipe life data</strong>, which clears your life records but keeps your login —
                    useful if you want to start clean. It is confirmed by typing <strong>WIPE ALL DATA</strong>.
                </Para>
            </Section>

            <Section title="Timeline">
                <Para>
                    Access revoked and third-party tokens (including Google) revoked <strong>immediately</strong>; removal
                    from live systems within <strong>7 days</strong>; removal from encrypted backups within
                    {' '}<strong>30 days</strong>. We keep only what the law obliges us to keep — billing invoices and
                    consent/processing records — and never your life content.
                </Para>
            </Section>

            <Section title="Deleting via Google">
                <Para>
                    Revoking AIIMIN at{' '}
                    <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={link}>
                        myaccount.google.com/permissions
                    </a>{' '}
                    stops all Google access immediately. It does not delete your AIIMIN account; use the in-app option or
                    email <a href={`mailto:${LEGAL.emails.privacy}`} style={link}>{LEGAL.emails.privacy}</a> with the
                    subject &quot;Account Deletion Request&quot; from your registered address.
                </Para>
            </Section>

            <Section title="If you cannot sign in">
                <Para>
                    Email <a href={`mailto:${LEGAL.emails.privacy}`} style={link}>{LEGAL.emails.privacy}</a> from your
                    registered email. We will verify you and complete the deletion within 7 days, and confirm in writing.
                </Para>
            </Section>
        </LegalLayout>
    );
};

export default DataDeletion;
