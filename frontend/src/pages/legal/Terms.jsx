import React from 'react';
import LegalLayout, { LegalSection as Section, LegalPara as Para } from './LegalLayout';

const Terms = () => {
    return (
        <LegalLayout title="Terms of Service" lastUpdated="May 25, 2026">
            <Section title="1. Acceptance of Terms">
                <Para>
                    By accessing or using AIIMIN ("the Service") at <a href="https://www.aiimin.in" style={{ color: 'var(--accent)' }}>www.aiimin.in</a>, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service. These Terms are effective as of May 25, 2026.
                </Para>
            </Section>

            <Section title="2. Service Description">
                <Para>
                    AIIMIN is a personal productivity dashboard — a private life operating system that centralizes daily habits, goal tracking, journal entries, focus sessions, finance management, calendar integration, and personal analytics in one interface.
                </Para>
                <Para>
                    AIIMIN is a personal project developed and maintained by a single developer (Aaditya Upadhyay) for personal and limited-access use. It integrates with Google APIs (Calendar, YouTube) to display the user's own data inside their dashboard.
                </Para>
            </Section>

            <Section title="3. Eligibility">
                <Para>
                    You must be at least 13 years of age to use this Service. By using the Service, you represent and warrant that you meet this requirement and that you have the legal authority to enter into these Terms.
                </Para>
            </Section>

            <Section title="4. Account Registration & Security">
                <Para>
                    To access the full features of AIIMIN, you must create an account using Google OAuth or the AIIMIN sign-up form. You are responsible for:
                </Para>
                <Para>• Maintaining the security and confidentiality of your account credentials.</Para>
                <Para>• All activity that occurs under your account.</Para>
                <Para>• Immediately notifying us of any unauthorized access to your account.</Para>
                <Para>
                    We reserve the right to suspend or terminate your account if we detect unauthorized use or a breach of these Terms.
                </Para>
            </Section>

            <Section title="5. Acceptable Use">
                <Para>You agree to use AIIMIN only for lawful, personal, non-commercial productivity purposes. You may NOT:</Para>
                <Para>• Interfere with or attempt to disrupt the integrity, performance, or availability of the Service.</Para>
                <Para>• Attempt to gain unauthorized access to the Service, its backend systems, database, or any other user's data.</Para>
                <Para>• Use the Service in any way that violates any applicable local, national, or international law or regulation.</Para>
                <Para>• Reverse engineer, decompile, or attempt to extract the source code of the Service.</Para>
                <Para>• Use automated scripts, bots, or scrapers to access the Service without prior written consent.</Para>
                <Para>• Upload or transmit any malicious code, viruses, or harmful data to the Service.</Para>
                <Para>• Impersonate any person or entity or falsely represent your identity or affiliation.</Para>
            </Section>

            <Section title="6. Google API Integrations">
                <Para>
                    AIIMIN integrates with the following Google APIs. By connecting these integrations, you authorize AIIMIN to access the described data on your behalf:
                </Para>
                <Para>
                    <strong>Google Calendar API (read-only):</strong> AIIMIN requests read-only access to your Google Calendar to display your upcoming events and schedules inside your dashboard. AIIMIN does NOT create, edit, or delete any calendar events. Calendar data is fetched in real time and is not permanently stored on our servers.
                </Para>
                <Para>
                    <strong>YouTube Data API (read-only):</strong> AIIMIN requests read-only access to your YouTube activity to display information in your dashboard. AIIMIN does NOT post, modify, or delete any YouTube content on your behalf. YouTube data is fetched in real time and is not permanently stored on our servers.
                </Para>
                <Para>
                    All Google API usage strictly complies with the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google API Services User Data Policy</a>, including the Limited Use requirements.
                </Para>
                <Para>
                    You may revoke AIIMIN's access to your Google account at any time via your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google Account Permissions</a> page. Revocation immediately disables all Google-connected features in the dashboard.
                </Para>
                <Para>
                    Your use of Google services through AIIMIN is also governed by <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Google's Terms of Service</a>.
                </Para>
            </Section>

            <Section title="7. Privacy">
                <Para>
                    Your use of the Service is also governed by our <a href="/privacy" style={{ color: 'var(--accent)' }}>Privacy Policy</a>, which is incorporated into these Terms by reference. Please review it carefully to understand our data practices.
                </Para>
                <Para>
                    We are committed to protecting your personal data and complying with all applicable data protection laws. We do not sell, rent, or share your personal data with third parties for commercial purposes.
                </Para>
            </Section>

            <Section title="8. Intellectual Property">
                <Para>
                    All content, features, and functionality of the AIIMIN service — including but not limited to its design, code, text, graphics, and user interface — are the exclusive property of Aaditya Upadhyay and are protected by applicable intellectual property laws.
                </Para>
                <Para>
                    Your personal data and content that you enter into the dashboard (goals, journal entries, notes, etc.) remain your property. You grant AIIMIN a limited, non-exclusive license to store and process this data solely to provide the Service.
                </Para>
            </Section>

            <Section title="9. Data Deletion">
                <Para>
                    You have the right to request deletion of your account and all associated data at any time. To do so, email <a href="mailto:aadityaupadhyay10@gmail.com" style={{ color: 'var(--accent)' }}>aadityaupadhyay10@gmail.com</a> or visit the <a href="/data-deletion" style={{ color: 'var(--accent)' }}>Data Deletion page</a>. All data will be permanently deleted within 30 days of a verified request.
                </Para>
            </Section>

            <Section title="10. Disclaimers">
                <Para>
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </Para>
                <Para>
                    We do not guarantee that the Service will be uninterrupted, error-free, or free of viruses or other harmful components. AIIMIN is not responsible for any loss of data or productivity resulting from downtime or technical issues.
                </Para>
            </Section>

            <Section title="11. Limitation of Liability">
                <Para>
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, AIIMIN AND ITS DEVELOPER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, OR BUSINESS INTERRUPTION, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.
                </Para>
            </Section>

            <Section title="12. Suspension and Termination">
                <Para>
                    We reserve the right to suspend or terminate your access to the Service at any time, with or without notice, if you breach these Terms or if we reasonably believe your use of the Service poses a risk to other users or the Service itself.
                </Para>
                <Para>
                    You may stop using the Service at any time. If you wish to have your account and data deleted, follow the process described in Section 9.
                </Para>
            </Section>

            <Section title="13. Governing Law">
                <Para>
                    These Terms are governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts located in Uttar Pradesh, India.
                </Para>
            </Section>

            <Section title="14. Changes to These Terms">
                <Para>
                    We reserve the right to update these Terms at any time. When we do, we will update the "Last Updated" date at the top of this page. Your continued use of the Service after any changes constitutes your acceptance of the new Terms. We encourage you to review these Terms periodically.
                </Para>
            </Section>

            <Section title="15. Contact">
                <Para>
                    If you have any questions about these Terms, please contact:<br />
                    <strong>Aaditya Upadhyay</strong><br />
                    Email: <a href="mailto:aadityaupadhyay10@gmail.com" style={{ color: 'var(--accent)' }}>aadityaupadhyay10@gmail.com</a><br />
                    Website: <a href="https://www.aiimin.in" style={{ color: 'var(--accent)' }}>www.aiimin.in</a>
                </Para>
            </Section>
        </LegalLayout>
    );
};

export default Terms;
