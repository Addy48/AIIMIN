import React from 'react';
import LegalLayout, {
    LegalSection as Section,
    LegalPara as Para,
    LegalList as List,
    LegalTable as Table,
} from './LegalLayout';
import { LEGAL, ADDRESS_FALLBACK } from '../../constants/legal';

const link = { color: 'var(--accent)' };

const Refunds = () => {
    return (
        <LegalLayout
            title="Refund, Billing & Cancellation"
            lastUpdated={LEGAL.effectiveDate}
            description="AIIMIN plan prices, how renewal and cancellation work, the 7-day goodwill refund, failed-payment grace period, and price-change notice."
            canonicalPath="/refunds"
        >
            <Section title="Who is billing you">
                <Para>
                    Effective {LEGAL.effectiveDate}. {LEGAL.entityNote}
                </Para>
                <Para>{ADDRESS_FALLBACK}</Para>
                {/* TODO(founder): publish registered address — DPDP Rules 2025 requirement */}
                <Para>
                    GSTIN will be published here once registration is complete.
                    {/* TODO(founder): publish GSTIN once registered */}
                </Para>
            </Section>

            <Section title="Plans">
                <Table
                    caption="AIIMIN plans and prices"
                    head={['Plan', 'List price', 'Founding price', 'Billing']}
                    rows={[
                        ['Explore', 'Free', '—', '—'],
                        ['Core', '₹29 / month', 'Complimentary for waitlist members at launch, for the stated period', 'Monthly'],
                        ['Pro', '₹59 / month', '₹49 / month', 'Monthly'],
                        ['Elite', '₹99 / month', '₹79 / month', 'Monthly'],
                    ]}
                />
                <Para>
                    Prices are in Indian Rupees. Taxes are applied as required and shown at checkout. AIIMIN is a digital
                    service delivered immediately on payment; there is nothing to ship.
                </Para>
            </Section>

            <Section title="Fulfilment">
                <Para>
                    Access to the plan&apos;s features is enabled on your account <strong>immediately</strong> after a
                    successful payment, on every surface you sign in to. If it is not, contact{' '}
                    <a href={`mailto:${LEGAL.emails.support}`} style={link}>{LEGAL.emails.support}</a> and we will fix or
                    refund it.
                </Para>
            </Section>

            <Section title="Renewal and cancellation">
                <Para>
                    Subscriptions renew automatically each month until you cancel. <strong>Cancel any time</strong> in
                    Account → Subscription (or, for purchases made through Google Play, in your Play subscriptions).
                    Cancellation stops the next charge; your plan stays active until the end of the period you already paid
                    for. Cancelling never deletes your data — features simply become read-only, and export stays available.
                </Para>
            </Section>

            <Section title="Refunds">
                <List
                    ordered
                    items={[
                        <><strong>7-day goodwill refund.</strong> If you are unhappy within 7 days of your first paid charge on a plan, email <a href={`mailto:${LEGAL.emails.support}`} style={link}>{LEGAL.emails.support}</a> and we will refund it in full. No argument.</>,
                        <><strong>Service failure.</strong> If a paid feature was unavailable or materially broken for a meaningful part of a billing period, we refund or credit that period pro rata.</>,
                        <><strong>Accidental or duplicate charge.</strong> Refunded in full.</>,
                        <><strong>Mid-period cancellation.</strong> Not refunded by default (you keep access to the period end), except under 1–3 above.</>,
                        <><strong>Store purchases.</strong> Purchases made through Google Play follow Google&apos;s refund process; we will also help directly.</>,
                    ]}
                />
                <Para>
                    Approved refunds are issued to the original payment method within <strong>5–7 business days</strong> of
                    approval, subject to your bank&apos;s timelines. We do not charge a processing fee for refunds.
                </Para>
            </Section>

            <Section title="Failed payments">
                <Para>
                    If a charge fails we retry and tell you. You keep full access for a <strong>7-day grace period</strong>
                    {' '}— we do not lock you out of your own life data. After that, paid features become read-only until
                    payment succeeds. Your data is never deleted for non-payment.
                </Para>
            </Section>

            <Section title="Price changes">
                <Para>
                    At least 30 days&apos; notice in-app and by email, effective from a future billing period. Founding
                    rates are honoured as described at the time you subscribed, for as long as the subscription remains
                    continuously active.
                </Para>
            </Section>

            <Section title="Chargebacks">
                <Para>
                    Please talk to us first at{' '}
                    <a href={`mailto:${LEGAL.emails.support}`} style={link}>{LEGAL.emails.support}</a> — it is faster. If a
                    chargeback is raised, the plan reverts to Explore while we investigate; your data remains intact.
                </Para>
            </Section>
        </LegalLayout>
    );
};

export default Refunds;
