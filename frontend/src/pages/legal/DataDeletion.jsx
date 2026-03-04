import React from 'react';
import LegalLayout, { LegalSection as Section, LegalPara as Para } from './LegalLayout';

const DataDeletion = () => {
    return (
        <LegalLayout title="Data Deletion Policy" lastUpdated="March 5, 2026">
            <Section title="Data Deletion Policy">
                <Para>At AIIMIN, you are in full control of your data. If you decide to stop using our service, you can easily request the permanent deletion of your account and all associated data.</Para>
            </Section>
            <Section title="How to Request Deletion">
                <Para>1. <strong>In-App Deletion:</strong> Navigate to the Settings menu inside the AIIMIN dashboard and click the "Delete Account" button. Confirm your choice to automatically wipe your data.</Para>
                <Para>2. <strong>Email Request:</strong> You can also email our support team directly via the Contact Page with the subject line "Account Deletion Request."</Para>
            </Section>
            <Section title="Data Removal Timeline">
                <Para>Upon initiating a deletion request, your profile data, stored preferences, and active authentication tokens are purged from our active databases immediately. Backups are rotated and fully purged within a 30-day window.</Para>
            </Section>
            <Section title="Revoking Google Access">
                <Para>In addition to deleting your AIIMIN account, you should also revoke the OAuth permissions granted to our application directly within your Google Account.</Para>
                <Para>To do this, visit the <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google Security Checkup - Third-party apps with account access</a> page, locate "AIIMIN", and click "Remove Access".</Para>
            </Section>
        </LegalLayout>
    );
};

export default DataDeletion;
