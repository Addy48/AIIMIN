/**
 * Login.jsx — Clerk-powered authentication page
 *
 * Uses Clerk's <SignIn> component which handles:
 *  - Email/password login
 *  - Google OAuth (one click)
 *  - Magic links
 *  - Sign-up
 *
 * After a successful sign-in Clerk redirects to /overview.
 */
import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useThemeContext } from '../context/ThemeContext';

export default function Login() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark' || theme === 'midnight' || theme === 'vercel' || theme === 'internet';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: isDark
        ? 'radial-gradient(ellipse at 50% 0%, rgba(30,92,58,0.18) 0%, #0a0a0a 60%)'
        : 'radial-gradient(ellipse at 50% 0%, rgba(30,92,58,0.08) 0%, #fafaf9 60%)',
      padding: '24px',
    }}>
      {/* Brand mark */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div style={{
          fontSize: '28px',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          color: isDark ? '#f5f5f5' : '#111',
          marginBottom: '6px',
        }}>
          AIIMIN
        </div>
        <div style={{
          fontSize: '13px',
          color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
          letterSpacing: '0.04em',
        }}>
          Your personal operating system
        </div>
      </div>

      {/* Clerk SignIn widget */}
      <SignIn
        routing="hash"
        redirectUrl="/overview"
        signUpUrl="/login#/sign-up"
        appearance={{
          variables: {
            colorPrimary: '#1E5C3A',
            colorBackground: isDark ? '#111' : '#fff',
            colorText: isDark ? '#f5f5f5' : '#111',
            colorTextSecondary: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
            colorInputBackground: isDark ? '#1a1a1a' : '#fafaf9',
            colorInputText: isDark ? '#f5f5f5' : '#111',
            borderRadius: '16px',
            fontFamily: 'Inter, system-ui, sans-serif',
          },
          elements: {
            card: {
              boxShadow: isDark
                ? '0 0 0 1px rgba(255,255,255,0.08), 0 24px 64px rgba(0,0,0,0.6)'
                : '0 0 0 1px rgba(0,0,0,0.08), 0 24px 64px rgba(0,0,0,0.12)',
              background: isDark ? '#111' : '#fff',
            },
            headerTitle: { fontWeight: 800, letterSpacing: '-0.02em' },
            formButtonPrimary: {
              background: '#1E5C3A',
              fontWeight: 700,
            },
            footerAction: { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' },
          },
        }}
      />
    </div>
  );
}
