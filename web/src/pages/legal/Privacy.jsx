import React from 'react';
import LegalLayout, {
    LegalSection as Section,
    LegalPara as Para,
    LegalList as List,
    LegalTable as Table,
} from './LegalLayout';
import { LEGAL, ADDRESS_FALLBACK } from '../../constants/legal';

const link = { color: 'var(--accent)' };

const Privacy = () => {
    return (
        <LegalLayout
            title="Privacy Policy"
            lastUpdated={LEGAL.effectiveDate}
            description="How AIIMIN collects, uses, stores and deletes your personal data — itemised per the DPDP Act 2023 and DPDP Rules 2025, including Google Limited Use commitments."
            canonicalPath="/privacy"
        >
            <Section title="Applies to">
                <Para>
                    Effective {LEGAL.effectiveDate}. This policy applies to aiimin.in, the AIIMIN web app,
                    aiimin.in/m, the AIIMIN Android app, and api.aiimin.in. A native iOS app is not offered
                    in the current product plan; if that changes, this policy will be updated before launch.
                </Para>
            </Section>

            <Section title="1. Summary in plain language">
                <Para>
                    AIIMIN is a Personal Life OS. You put your life into it — days, habits, money, documents, people,
                    practice sessions — and it gives you back an honest picture.
                </Para>
                <Para>Four commitments that will not change:</Para>
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

            <Section title="2. Who we are">
                <Para>
                    {LEGAL.entityNote} {ADDRESS_FALLBACK}
                </Para>
                {/* TODO(founder): publish registered address — DPDP Rules 2025 requirement */}
                <Para>
                    Under India&apos;s Digital Personal Data Protection Act, 2023 (DPDP Act), we are the
                    <strong> Data Fiduciary</strong> for your personal data, and you are the <strong>Data Principal</strong>.
                    For users in the EEA/UK we act as <strong>controller</strong> under the GDPR/UK GDPR.
                </Para>
                <Para>
                    Contact: <a href={`mailto:${LEGAL.emails.privacy}`} style={link}>{LEGAL.emails.privacy}</a> ·
                    {' '}Grievance Officer: see section 11 and <a href="/grievance" style={link}>/grievance</a>.
                </Para>
            </Section>

            <Section title="3. Exactly what we collect — itemised">
                <Para>
                    We list this per DPDP Rules 2025, Rule 3. Anything marked <strong>optional</strong> is collected only
                    if you switch it on; you can switch it off later and ask us to delete what was collected.
                </Para>

                <Para><strong>3.1 Account and identity</strong></Para>
                <Table
                    caption="Account and identity data"
                    head={['Data', 'Purpose', 'Basis', 'Where it lives']}
                    rows={[
                        ['Email address', 'Sign-in, verification, security and billing notices', 'Contract', 'Server'],
                        ['Name (or what you choose to be called)', 'Address you correctly in the product', 'Contract', '—'],
                        ['OS-ID (your 8-character handle)', 'Public identifier for sign-in', 'Contract', 'Server'],
                        ['6-digit PIN', 'Sign-in credential — stored only as a salted hash, never in plain text, never in logs or analytics', 'Contract', 'Server'],
                        ['Timezone', 'Correct day boundaries', 'Contract', 'Server'],
                        ['Google account name, email, profile picture (only if you sign in with Google)', 'Create and identify your account', 'Consent', 'Server'],
                        ['Session and device records (device model, app version, platform, last-seen)', 'Keep you signed in, show you your active devices, detect abuse', 'Legitimate use / contract', 'Server'],
                        ['IP address and coarse request logs', 'Security, abuse prevention, debugging', 'Legitimate use', 'Server, ≤ 90 days'],
                    ]}
                />

                <Para><strong>3.2 What you create in AIIMIN (your life data)</strong></Para>
                <Table
                    caption="Life data you create in AIIMIN"
                    head={['Data', 'Purpose', 'Basis']}
                    rows={[
                        ['Daily logs, habits and completions, goals, tasks, focus sessions, discipline records', 'Run the product features you use', 'Contract'],
                        [<strong>Journal entries</strong>, 'Your private writing space', 'Contract, with special handling (section 6)'],
                        ['Notes and their attachments', 'Your notes', 'Contract'],
                        ['Calendar events you create in AIIMIN', 'Your calendar', 'Contract'],
                        ['Money records: transactions, accounts, budgets, assets, lending and borrowing records', 'Your money features', 'Contract'],
                        ['People records: name, relationship, optional phone number and email, optional photo', 'Link your records to real people', 'Consent (see 3.4)'],
                        ['Documents you upload, and the metadata and expiry dates you add', 'Your document vault', 'Contract'],
                        ['Practice sessions (English/voice): transcript, scores, word bank', 'Your learning progress', 'Contract'],
                        ['Feedback and support messages you send us', 'Answer you, fix bugs', 'Contract'],
                    ]}
                />

                <Para><strong>3.3 Derived data we compute</strong></Para>
                <Para>
                    Life Score and its per-domain components; Depth state; streaks; AIIMIN English Index (AEI) and skill
                    levels; correlations and weekly/monthly insight text; suggested structure from your own text. Derived
                    data is produced from the data above and is deleted with it.
                </Para>

                <Para><strong>3.4 Optional connections — off unless you turn them on</strong></Para>
                <Table
                    caption="Optional connections and exactly what each one reads"
                    head={['Connection', 'Exactly what we read', 'What we never read', 'What we store on our servers']}
                    rows={[
                        [<strong>Google Calendar</strong>, 'Events on calendars you authorise; Google Tasks that have a due date', 'Gmail, Drive files (unless you separately connect Drive), contacts', 'Event time, title, calendar id, Google event id — or times only if you choose Busy-only mode'],
                        [<strong>Google Drive (optional)</strong>, 'Only the folder you nominate for note sync', 'Your whole Drive', 'File name, id, extracted text of files you sync'],
                        [<strong>Google People / phone contacts</strong>, 'Only the individual contacts you select in the picker', 'Your whole address book, call logs, message logs', 'Display name, optional email, a one-way hash of the phone number for matching, and the phone number itself only if you keep it visible'],
                        [<strong>Health Connect (Android)</strong>, 'Daily totals: steps, distance, active minutes, sleep duration', 'Workout GPS routes, heart-rate streams, medical records', 'Daily totals only, per day'],
                        [<strong>Device usage / screen time (Android)</strong>, 'Daily total screen time; app categories only if you opt in', 'Per-app minute-by-minute history, app contents', 'Daily total (and category totals if opted in)'],
                        [<strong>Payment alert reading (Android, opt-in)</strong>, 'Amount, direction, counterparty text and reference from payment alerts, matched on-device against a bank/UPI template list', 'OTPs, personal messages, message bodies', <><strong>Nothing raw.</strong> Only the transaction draft you approve</>],
                        [<strong>Microphone</strong>, 'Audio only while a practice session is running and you started it', 'Any background audio', 'Nothing by default — audio stays on your device and is discarded after scoring, unless you turn on cloud replay'],
                        [<strong>Camera</strong>, 'Frames while you are scanning a receipt or document', 'Anything outside a scan you started', 'The resulting file, if you save it'],
                        [<strong>Notifications</strong>, '—', '—', 'Push token per device'],
                    ]}
                />
                <Para>
                    <strong>We do not request location. We do not request call logs. We do not request SMS permissions.</strong>
                </Para>

                <Para><strong>3.5 Analytics and error reporting — consent first</strong></Para>
                <Para>
                    Until you consent, no product analytics or error-reporting SDK is initialised. If you consent, we
                    collect <strong>event counts and technical context only</strong>: which screens were opened, which
                    actions succeeded or failed, error codes, app version, device class, and an opaque per-account
                    identifier.
                </Para>
                <Para>
                    Never included in analytics or error reports: journal content, note content, document contents or
                    numbers, message or contact contents, transcripts, amounts, PIN, or any Google user data. You can
                    withdraw consent at any time in <strong>Account → Privacy</strong>; withdrawal stops future collection
                    and we delete the associated analytics records on request.
                </Para>
            </Section>

            <Section title="4. How we use your data — and how we do not">
                <Para>
                    <strong>We use it to:</strong> operate the features you use; compute your scores and insights; sync
                    across your devices; send you the notifications you chose; take payment and manage your plan; keep the
                    service secure; answer support requests; and meet legal obligations.
                </Para>
                <Para>
                    <strong>We do not:</strong> sell, rent or licence your personal data; share it for anyone else&apos;s
                    marketing; use it to build advertising profiles; train, fine-tune or improve any general-purpose AI
                    model on your content; publish anything on your behalf; read your journal in order to profile you; or
                    use your contacts to invite, market to, or grow through the people you know.
                </Para>
            </Section>

            <Section title="5. Google user data — Limited Use">
                <Para>
                    AIIMIN&apos;s use of information received from Google APIs adheres to the{' '}
                    <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={link}>
                        Google API Services User Data Policy
                    </a>, including the <strong>Limited Use</strong> requirements. Specifically:
                </Para>
                <List
                    ordered
                    items={[
                        'Google user data is used only to provide or improve the user-facing features that you authorised and that are prominently described in the product.',
                        'We do not transfer Google user data to third parties, except (a) infrastructure providers strictly processing it on our behalf under contract, (b) where you explicitly direct it, or (c) where required by law.',
                        'We do not use Google user data for advertising.',
                        'We do not use Google user data to train, fine-tune, or otherwise develop generalised AI/ML models.',
                        'No human reads your Google user data unless you specifically ask us to for support, we need to for security or to comply with law, or the data has been aggregated and anonymised.',
                    ]}
                />
                <Para><strong>Scopes we request, and why:</strong></Para>
                <Table
                    caption="Google OAuth scopes requested by AIIMIN"
                    head={['Scope', 'Why we need it', 'Consequence of refusing']}
                    rows={[
                        ['openid, email, profile', 'Create and identify your account when you choose Google sign-in', 'Use email + PIN sign-in instead'],
                        ['calendar.events (read/write)', 'Show your real day, and write back only events you create in AIIMIN — by default into a separate calendar named "AIIMIN"', 'Use AIIMIN-only manual events'],
                        ['tasks.readonly', 'Show Google Tasks that have a due date on your day', 'Tasks are not shown'],
                        ['drive.readonly (optional)', 'Sync notes from a single folder you nominate', 'No Drive note sync'],
                        ['contacts.readonly / People (optional)', 'Let you pick specific people to link to your records', 'Add people manually'],
                    ]}
                />
                <Para>
                    You can disconnect any Google connection at any time in <strong>Account → Connections</strong>, and
                    revoke AIIMIN at{' '}
                    <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={link}>
                        myaccount.google.com/permissions
                    </a>. On disconnect we ask whether to keep or delete the data already imported, and we honour your choice.
                </Para>
            </Section>

            <Section title="6. Special handling: journal and other high-sensitivity content">
                <Para>Your journal is treated as <strong>private reflection</strong>:</Para>
                <List
                    items={[
                        'It is excluded from analytics and telemetry entirely.',
                        'It is not used to compute profiles, and it is not sent to any AI provider unless you press the AI action on a specific entry — and then only that entry\u2019s text goes, with no identifiers.',
                        'It is never included in notification text.',
                        'You can exclude it from in-app search.',
                        'It is encrypted at rest.',
                    ]}
                />
                <Para>
                    We also <strong>never infer</strong> high-sensitivity facts about you. Medications, allergies,
                    diagnoses, and similar are only ever what you typed yourself; AIIMIN&apos;s AI is explicitly prohibited
                    from guessing them, and will always ask instead. AIIMIN is not a medical device and provides no
                    diagnosis (see <a href="/ai-disclosure" style={link}>AI Disclosure</a>).
                </Para>
            </Section>

            <Section title="7. Where your data is processed">
                <Para>
                    Primary processing is in <strong>India (AWS ap-south-1 / Mumbai)</strong> together with our managed
                    database provider. Some subprocessors (listed at <a href="/subprocessors" style={link}>/subprocessors</a>)
                    process data outside India, which may include the United States and the EU. Where such transfers
                    involve EEA/UK personal data, we rely on the European Commission&apos;s Standard Contractual Clauses.
                </Para>
            </Section>

            <Section title="8. How long we keep it">
                <Table
                    caption="Retention periods"
                    head={['Data', 'Retention']}
                    rows={[
                        ['Account data', 'While your account exists'],
                        ['Your life data', 'While your account exists, or until you delete it — whichever is first'],
                        ['Journal, notes, documents, people, transactions you delete', '30-day recycle bin, then permanent deletion'],
                        ['Practice audio', 'Deleted immediately after scoring, unless you enabled cloud replay (then 30 days, or until you delete it)'],
                        ['Health and screen-time daily totals', 'While the connection is on; deleted on request when you disconnect'],
                        ['Payment-alert drafts you did not approve', 'Discarded on device; never sent to us'],
                        ['Request/security logs', '90 days'],
                        ['Consent records and the content-free activity log', 'While your account exists, then per deletion above — kept because the law requires us to be able to show what you consented to'],
                        ['Processing logs required by DPDP Rules', 'At least 1 year'],
                        ['Billing records', 'As required by Indian tax law (currently 8 years) — invoices only, not your life data'],
                        ['After account deletion', 'Access revoked immediately; deletion from live systems within 7 days; from backups within 30 days'],
                    ]}
                />
            </Section>

            <Section title="9. Your rights and how to use them">
                <Para>Under the DPDP Act (and the GDPR/UK GDPR where it applies) you can:</Para>
                <Table
                    caption="Your rights and how to exercise them"
                    head={['Right', 'How']}
                    rows={[
                        [<strong>Access a copy of your data</strong>, 'Account → Privacy → Export; machine-readable JSON, plus your files'],
                        [<strong>Correct or complete it</strong>, <>Edit in the app; anything you cannot edit, email <a href={`mailto:${LEGAL.emails.privacy}`} style={link}>{LEGAL.emails.privacy}</a></>],
                        [<strong>Erase it</strong>, 'Account → Privacy → Wipe life data (keeps login) or Delete account (removes everything)'],
                        [<strong>Withdraw consent</strong>, 'Account → Privacy toggles — as easy as switching it on. We stop collecting immediately and offer to delete what was collected'],
                        [<strong>Nominate someone to exercise your rights if you die or become incapable (DPDP s.14)</strong>, <>Email <a href={`mailto:${LEGAL.emails.grievance}`} style={link}>{LEGAL.emails.grievance}</a> — we will record your nominee</>],
                        [<strong>Grievance redressal</strong>, <><a href="/grievance" style={link}>/grievance</a> — we respond within 90 days, and target 7 days</>],
                        [<strong>Complain to the Data Protection Board of India</strong>, 'If we do not resolve it, you may complain to the Board. EEA/UK users may complain to their supervisory authority'],
                        [<strong>Object / restrict / portability (GDPR)</strong>, <>Email <a href={`mailto:${LEGAL.emails.privacy}`} style={link}>{LEGAL.emails.privacy}</a></>],
                    ]}
                />
                <Para>We do not charge for these, and using them never degrades your service.</Para>
            </Section>

            <Section title="10. Children">
                <Para>
                    AIIMIN is for adults. You must be <strong>18 or older</strong> to create an account. We do not
                    knowingly collect data from children. If we learn that a child has created an account, we will delete
                    it and its data. We never serve behavioural advertising and never track children — there is no
                    advertising in AIIMIN at all.
                </Para>
            </Section>

            <Section title="11. Security, and what to do if something goes wrong">
                <Para>
                    See <a href="/security" style={link}>/security</a> for controls. If a personal data breach affects you,
                    we will inform you <strong>without undue delay</strong>, in plain language, with what happened, what
                    data was involved, what we have done, and what you should do — and we will notify the Data Protection
                    Board of India within <strong>72 hours</strong>.
                </Para>
                <Para>
                    Report a suspected vulnerability to{' '}
                    <a href={`mailto:${LEGAL.emails.security}`} style={link}>{LEGAL.emails.security}</a>. We will not pursue
                    legal action against good-faith security research that respects user privacy and does not degrade the
                    service.
                </Para>
            </Section>

            <Section title="12. Automated decision-making">
                <Para>
                    AIIMIN suggests; you decide. No feature makes a legally significant or irreversible decision about you
                    automatically. AI may pre-fill a field or propose a structure, always with a way to correct or dismiss
                    it, and never for permissions, billing, or deletion. See <a href="/ai-disclosure" style={link}>AI Disclosure</a>.
                </Para>
            </Section>

            <Section title="13. Changes">
                <Para>
                    If we change this policy materially, we will tell you in the app before the change takes effect and,
                    where required, ask for fresh consent. Old versions are archived and linked at{' '}
                    <a href="/legal" style={link}>/legal</a>.
                </Para>
            </Section>

            <Section title="14. Contact">
                <Para>
                    {LEGAL.entity} · {ADDRESS_FALLBACK}
                </Para>
                {/* TODO(founder): publish registered address — DPDP Rules 2025 requirement */}
                <Para>
                    Privacy: <a href={`mailto:${LEGAL.emails.privacy}`} style={link}>{LEGAL.emails.privacy}</a> ·
                    {' '}Grievance Officer: {LEGAL.grievanceOfficer},{' '}
                    <a href={`mailto:${LEGAL.emails.grievance}`} style={link}>{LEGAL.emails.grievance}</a> ·
                    {' '}Support: <a href={`mailto:${LEGAL.emails.support}`} style={link}>{LEGAL.emails.support}</a>
                </Para>
            </Section>
        </LegalLayout>
    );
};

export default Privacy;
