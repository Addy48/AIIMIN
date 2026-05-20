import React from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/layout/PageHeader';

const Identity = () => {
  return (
    <div className="page-container" style={{
      padding: 'var(--content-pad)',
      paddingBottom: '100px',
      fontFamily: 'var(--font-sans)',
      color: 'var(--color-text-1)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader 
          title="AIIMIN"
          subtitle="Identity & Vision"
          description="The definitive personal operating system designed to structure your life, optimize your focus, and accelerate your trajectory."
          centered={true}
        />

        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'var(--font-serif)', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            Our Philosophy
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--color-text-2)', lineHeight: 1.8, marginBottom: '16px' }}>
            AIIMIN is not just a tool; it's a behavioral framework. We believe that true productivity stems from clarity, structure, and frictionless execution. By centralizing your finances, placements, habits, and focus sessions into one unified dashboard, AIIMIN eliminates context switching and cognitive fatigue.
          </p>
          <p style={{ fontSize: '15px', color: 'var(--color-text-2)', lineHeight: 1.8 }}>
            Built with a "Nordic Calm" aesthetic, the interface is intentionally designed to be quiet and unobtrusive. The software should never compete for your attention—it should channel it.
          </p>
        </section>

        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'var(--font-serif)', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            Privacy Policy
          </h2>
          <div style={{ background: 'var(--color-surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>1. Data Ownership</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-3)', lineHeight: 1.6, marginBottom: '24px' }}>
              Your data belongs to you. AIIMIN operates on a fundamental principle of data sovereignty. All behavioral logs, financial records, and career data stored within the platform are encrypted and strictly accessible only by your authenticated session.
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>2. Data Collection</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-3)', lineHeight: 1.6, marginBottom: '24px' }}>
              We collect only what is necessary to operate the Life OS. This includes:
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                <li>Authentication metrics (Email, Session Tokens).</li>
                <li>User-inputted records (Finance entries, Placement tracking, Journal entries).</li>
                <li>Telemetry data strictly for internal UI/UX improvements (Error logging).</li>
              </ul>
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>3. Third-Party Sharing</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-3)', lineHeight: 1.6 }}>
              AIIMIN <strong>does not</strong> and will never sell your personal or behavioral data to third-party advertisers. Integrations with external APIs (e.g., Supabase, Sports Data APIs) are handled securely with minimal payload transmission.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'var(--font-serif)', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            Terms & Conditions
          </h2>
          <div style={{ fontSize: '14px', color: 'var(--color-text-2)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p>
              By accessing and using the AIIMIN Life OS, you agree to these Terms and Conditions. This software is provided "as-is," without any express or implied warranty regarding uninterrupted operation.
            </p>
            <p>
              <strong>1. Usage Constraints:</strong> You agree to use the platform solely for personal productivity and data tracking. Automated scraping, abuse of the internal APIs, or attempts to circumvent authentication are strictly prohibited and will result in immediate account termination.
            </p>
            <p>
              <strong>2. Financial Disclaimer:</strong> The 'Finance' module within AIIMIN is for informational and organizational purposes only. It does not constitute professional financial advice. AIIMIN assumes no liability for investment losses or budget discrepancies.
            </p>
            <p>
              <strong>3. Continuous Evolution:</strong> AIIMIN is a living product. Features, integrations, and visual aesthetics are subject to change, deprecation, or overhaul as the platform evolves towards its ultimate vision.
            </p>
          </div>
        </section>

        <footer style={{ textAlign: 'center', paddingTop: '40px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-3)', letterSpacing: '0.05em' }}>
            © {new Date().getFullYear()} AIIMIN Systems. All rights reserved.
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default Identity;
