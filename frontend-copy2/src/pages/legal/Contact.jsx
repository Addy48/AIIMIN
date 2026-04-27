import React from 'react';
import LegalLayout, { LegalSection as Section, LegalPara as Para } from './LegalLayout';

const Contact = () => {
    return (
        <LegalLayout title="Contact Us">
            <Section title="Contact Information">
                <Para>If you have questions about your privacy, need technical support, or wish to submit a data deletion request, our team is here to help.</Para>
            </Section>
            <Section title="Details">
                <Para><strong>Company:</strong> AIIMIN</Para>
                <Para><strong>Support Email:</strong> support@aiimin.in</Para>
            </Section>
            <Section title="Response Policy">
                <Para>We review all inquiries related to data privacy and account security within 48 business hours.</Para>
            </Section>
        </LegalLayout>
    );
};

export default Contact;
