import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useThemeContext } from '../context/ThemeContext';
import { motion } from 'framer-motion';

export default function Login() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark' || theme === 'midnight' || theme === 'vercel' || theme === 'internet';

  return (
    <div className="login-root">
      {/* ─── LEFT PANEL ─── */}
      <div className="login-left">
        <div className="login-left-glow" />
        <div className="login-left-logo">
          <span className="login-wordmark-white">AIIMIN</span>
        </div>
        <div className="login-left-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="login-left-tagline"
          >
            The Personal<br />Operating System<br />for the Ambitious.
          </motion.h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="login-left-pills"
        >
          {['✦ Finance & Goals', '✦ Habits & Lab', '✦ Journal & Focus'].map(p => (
            <span key={p} className="login-pill">{p}</span>
          ))}
        </motion.div>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div className="login-right">
        <motion.div 
          className="login-form-wrap"
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Native Header */}
          <div className="login-native-header">
            <h1 className="login-native-title">Sign in.</h1>
            <p className="login-native-subtitle">Welcome back. Enter your details to continue.</p>
          </div>

          <SignIn
            routing="hash"
            redirectUrl="/overview"
            signUpUrl="/login#/sign-up"
            appearance={{
              variables: {
                colorPrimary: '#1E5C3A',
                colorBackground: 'transparent',
                colorText: isDark ? '#f5f5f5' : '#111',
                colorTextSecondary: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                colorInputBackground: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
                colorInputText: isDark ? '#f5f5f5' : '#111',
                borderRadius: '16px',
                fontFamily: 'Inter, system-ui, sans-serif',
              },
              elements: {
                rootBox: {
                  width: '100%',
                },
                cardBox: {
                  boxShadow: 'none',
                  background: 'transparent',
                  border: 'none',
                },
                card: {
                  boxShadow: 'none',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  gap: '24px',
                },
                header: {
                  display: 'none', // Hide Clerk's header
                },
                footer: {
                  background: 'transparent',
                  padding: 0,
                  border: 'none',
                },
                footerAction: {
                  display: 'none', // Hide footer action
                },
                formFieldInput: {
                  background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  border: '1px solid transparent',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.02)',
                  fontSize: '15px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                },
                formButtonPrimary: {
                  background: '#1E5C3A',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: '14px',
                  padding: '16px',
                  boxShadow: '0 4px 14px rgba(30, 92, 58, 0.25)',
                  fontSize: '16px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  marginTop: '12px',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                },
                socialButtonsBlockButton: {
                  border: 'none',
                  borderRadius: '14px',
                  background: isDark ? 'rgba(255,255,255,0.06)' : '#ffffff',
                  padding: '16px',
                  boxShadow: isDark ? 'none' : '0 4px 14px rgba(0,0,0,0.04)',
                  fontSize: '15px',
                  fontWeight: 500,
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                },
                dividerRow: {
                  margin: '8px 0',
                },
                dividerLine: {
                  background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  height: '1px',
                },
                dividerText: {
                  color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                  background: 'var(--color-base)',
                  padding: '0 16px',
                  fontSize: '13px',
                },
                identityPreview: {
                  background: isDark ? 'rgba(255,255,255,0.04)' : '#ffffff',
                  border: 'none',
                  boxShadow: isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.02)',
                  borderRadius: '14px',
                  padding: '16px',
                },
                identityPreviewEditButtonIcon: {
                  color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                },
                formFieldLabelRow: {
                  marginBottom: '10px',
                },
                formFieldLabel: {
                  fontWeight: 500,
                  fontSize: '13.5px',
                  color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                }
              },
            }}
          />
        </motion.div>
      </div>

      {/* ─── STYLES ─── */}
      <style>{`
        .login-root {
          display: flex;
          min-height: 100vh;
          overflow: hidden;
          background: var(--color-base);
        }

        /* LEFT */
        .login-left {
          width: 45%;
          max-width: 600px;
          min-height: 100vh;
          flex-shrink: 0;
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 56px 56px 56px 64px;
          box-sizing: border-box;
          overflow: hidden;
          background: color-mix(in srgb, var(--color-accent) 90%, #000 10%);
          background-image: radial-gradient(
            ellipse 80% 60% at 30% 40%,
            color-mix(in srgb, var(--color-accent) 60%, #fff 10%) 0%,
            color-mix(in srgb, var(--color-accent) 85%, #000 15%) 50%,
            color-mix(in srgb, var(--color-accent) 40%, #000 60%) 100%
          );
        }

        .login-left-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(255,255,255,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(0,0,0,0.4) 0%, transparent 60%);
        }

        .login-left-logo {
          position: relative;
          z-index: 2;
        }

        .login-wordmark-white {
          font-family: var(--font-serif);
          font-size: 26px;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.05em;
          opacity: 0.95;
        }

        .login-left-center {
          flex: 1;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        .login-left-tagline {
          font-family: var(--font-serif);
          font-size: clamp(36px, 4.5vw, 54px);
          font-weight: 800;
          color: #fff;
          line-height: 1.05;
          letter-spacing: -0.035em;
          margin: 0;
          opacity: 0.98;
        }

        .login-left-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          position: relative;
          z-index: 2;
        }

        .login-pill {
          display: inline-flex;
          align-items: center;
          padding: 8px 18px;
          border-radius: 99px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.95);
          font-size: 13px;
          font-weight: 600;
          font-family: var(--font-sans);
          letter-spacing: 0.02em;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        /* RIGHT */
        .login-right {
          flex: 1;
          min-height: 100vh;
          background: var(--color-base);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
          box-sizing: border-box;
          overflow-y: auto;
          position: relative;
        }

        .login-form-wrap {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
        }

        .login-native-header {
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .login-native-title {
          font-family: var(--font-serif);
          font-size: 42px;
          font-weight: 800;
          color: var(--color-text-1);
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin: 0;
        }

        .login-native-subtitle {
          font-family: var(--font-sans);
          font-size: 16px;
          color: var(--color-text-3);
          margin: 0;
          letter-spacing: -0.01em;
        }

        /* CLERK BRANDING OVERRIDES */
        .cl-internal-b3alnr, 
        .cl-watermark,
        [class*="cl-internal-"] > a[href*="clerk.com"],
        .cl-internal-1dauvpw,
        .cl-internal-1hp5nqm {
          display: none !important;
        }

        /* Input & Button hover states for premium feel */
        .cl-formFieldInput:hover, 
        .cl-formFieldInput:focus {
          box-shadow: 0 4px 20px rgba(0,0,0,0.06) !important;
          border-color: rgba(0,0,0,0.05) !important;
          transform: translateY(-1px);
        }
        
        .cl-socialButtonsBlockButton:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important;
          transform: translateY(-2px);
        }

        .cl-formButtonPrimary:hover {
          box-shadow: 0 8px 24px rgba(30, 92, 58, 0.35) !important;
          transform: translateY(-2px);
          filter: brightness(1.05);
        }

        /* Dark mode input hover fix */
        @media (prefers-color-scheme: dark) {
          .login-root {
            --login-shadow-hover: 0 4px 20px rgba(255,255,255,0.05);
          }
          .cl-formFieldInput:hover, 
          .cl-formFieldInput:focus {
            box-shadow: var(--login-shadow-hover) !important;
            border-color: rgba(255,255,255,0.1) !important;
          }
          .cl-socialButtonsBlockButton:hover {
            box-shadow: var(--login-shadow-hover) !important;
          }
        }

        /* Mobile: hide left panel */
        @media (max-width: 900px) {
          .login-left {
            display: none;
          }
          .login-right {
            min-height: 100vh;
          }
          .login-native-title {
            font-size: 36px;
          }
        }

        /* Tablets: tighten */
        @media (max-width: 1100px) and (min-width: 901px) {
          .login-left {
            width: 40%;
            padding: 40px 36px;
          }
        }
      `}</style>
    </div>
  );
}
