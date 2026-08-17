import React from 'react';
import LegalLayout, {
    LegalSection as Section,
    LegalPara as Para,
} from './LegalLayout';
import { LEGAL, ADDRESS_FALLBACK } from '../../constants/legal';

const link = { color: 'var(--accent)' };

const Terms = () => {
    return (
        <LegalLayout
            title="Terms of Service"
            lastUpdated={LEGAL.effectiveDate}
            description="The agreement between you and AIIMIN — eligibility, your content, subscriptions, AI features, liability, termination and governing law."
            canonicalPath="/terms"
        >
            <Section title="1. Agreement">
                <Para>
                    By creating an account or using AIIMIN, you agree to these Terms and to the{' '}
                    <a href="/privacy" style={link}>Privacy Policy</a>. If you do not agree, do not use AIIMIN.
                    These Terms are effective {LEGAL.effectiveDate}.
                </Para>
            </Section>

            <Section title="2. What AIIMIN is">
                <Para>
                    AIIMIN is a personal productivity and life-management application: capture, habits, goals, calendar,
                    money tracking, documents, practice tools, and AI-assisted summaries.
                </Para>
                <Para>
                    AIIMIN is <strong>not</strong>: a medical, psychological, or diagnostic service; a financial,
                    investment, tax, or legal adviser; a bank, payment system, or account aggregator; a records system you
                    should rely on as your only copy; an emergency service.
                </Para>
            </Section>

            <Section title="3. Eligibility">
                <Para>
                    You must be <strong>18 or older</strong> and legally able to enter a contract. One account per person.
                    You are responsible for what happens under your account.
                </Para>
            </Section>

            <Section title="4. Your account">
                <Para>
                    Keep your PIN and OS-ID private. Tell us promptly at{' '}
                    <a href={`mailto:${LEGAL.emails.support}`} style={link}>{LEGAL.emails.support}</a> if you suspect
                    unauthorised access. We may require email verification, and we may throttle or block requests that
                    look automated or abusive. During the founding period, access may be gated by a waitlist or invitation.
                </Para>
            </Section>

            <Section title="5. Your content">
                <Para>
                    <strong>You own what you put in.</strong> You grant us only the limited, revocable licence needed to
                    host, back up, transmit, and display your content to you, and to process it to provide the features you
                    use. We claim no ownership, and we will not publish your content. This licence ends when you delete the
                    content or your account, subject to backup cycles described in the Privacy Policy.
                </Para>
                <Para>
                    <strong>You are responsible</strong> for having the right to upload what you upload, including
                    documents about other people. Where you store data about family members or other people, you confirm
                    you have a lawful basis to do so.
                </Para>
            </Section>

            <Section title="6. Acceptable use">
                <Para>
                    See <a href="/acceptable-use" style={link}>/acceptable-use</a>. In short: do not break the law, do not
                    abuse the service or other people, do not attack the infrastructure, and do not try to extract other
                    users&apos; data.
                </Para>
            </Section>

            <Section title="7. Subscriptions and payment">
                <Para>
                    Plans, prices, renewals, refunds and cancellation are described in{' '}
                    <a href="/refunds" style={link}>/refunds</a>, which forms part of these Terms. Prices are in Indian
                    Rupees and are shown inclusive or exclusive of taxes as displayed at checkout. Founding rates apply for
                    the stated period and are honoured for as long as the subscription remains continuously active, unless
                    the description says otherwise. We may change prices for future billing periods with at least 30
                    days&apos; notice; you may cancel before the change takes effect.
                </Para>
            </Section>

            <Section title="8. AI features">
                <Para>
                    AI output may be wrong. See <a href="/ai-disclosure" style={link}>/ai-disclosure</a>. You are
                    responsible for decisions you make. Quotas apply per plan and are stated in-app; we do not promise
                    unlimited AI.
                </Para>
            </Section>

            <Section title="9. Third-party services">
                <Para>
                    Google, payment processors, AI providers and hosting providers have their own terms. We are not
                    responsible for their outages or acts. If a third-party API changes or is withdrawn, an affected
                    feature may change or stop; we will tell you and, where a paid feature is materially lost, offer a fair
                    remedy under section 12.
                </Para>
            </Section>

            <Section title="10. Availability">
                <Para>
                    We target high availability but do not guarantee uninterrupted service. We may perform maintenance, and
                    we may change or discontinue features. If we discontinue a paid feature you are actively using, we will
                    give notice and a pro-rata credit or refund for the unused portion.
                </Para>
            </Section>

            <Section title="11. Disclaimers">
                <Para>
                    To the extent permitted by law, AIIMIN is provided &quot;as is&quot; and &quot;as available&quot;,
                    without warranties of merchantability, fitness for a particular purpose, or non-infringement.
                    <strong> Keep your own copies of documents that matter.</strong> Export is always available; use it.
                </Para>
            </Section>

            <Section title="12. Limitation of liability">
                <Para>
                    To the extent permitted by law, we are not liable for indirect, incidental, special, consequential, or
                    punitive damages, or for lost profits, revenue, goodwill, or data. Our total aggregate liability arising
                    out of or related to AIIMIN is limited to {LEGAL.liabilityCap}. Nothing here limits liability that
                    cannot be limited by law, including for gross negligence, wilful misconduct, or death or personal
                    injury caused by negligence.
                </Para>
            </Section>

            <Section title="13. Indemnity">
                <Para>
                    You will indemnify us against third-party claims arising from your unlawful use of AIIMIN or your
                    breach of these Terms.
                </Para>
            </Section>

            <Section title="14. Suspension and termination">
                <Para>
                    You may stop and delete your account at any time. We may suspend or terminate access for a material
                    breach of these Terms or <a href="/acceptable-use" style={link}>/acceptable-use</a>, for legal reasons,
                    or to protect the service or other users — with notice where practical, and immediately where
                    necessary. On termination you keep your export right for 30 days unless the law requires otherwise.
                </Para>
            </Section>

            <Section title="15. Governing law and disputes">
                <Para>
                    These Terms are governed by the laws of India. Courts at {LEGAL.jurisdiction} have exclusive
                    jurisdiction, subject to any non-waivable consumer rights you have where you live. Before filing,
                    please contact <a href={`mailto:${LEGAL.emails.grievance}`} style={link}>{LEGAL.emails.grievance}</a> —
                    most issues are resolved in days.
                </Para>
            </Section>

            <Section title="16. Changes">
                <Para>
                    We will post changes here and notify you in-app for material changes at least 14 days before they take
                    effect. Continuing to use AIIMIN after that means you accept them.
                </Para>
            </Section>

            <Section title="17. Contact">
                <Para>{LEGAL.entityNote}</Para>
                <Para>{ADDRESS_FALLBACK}</Para>
                {/* TODO(founder): publish registered address — DPDP Rules 2025 requirement */}
                <Para>
                    <a href={`mailto:${LEGAL.emails.support}`} style={link}>{LEGAL.emails.support}</a>
                </Para>
            </Section>
        </LegalLayout>
    );
};

export default Terms;
