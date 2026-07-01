import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const IS_WAITLIST_MODE = process.env.REACT_APP_WAITLIST_MODE === 'true';

export default function Login() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark' || theme === 'midnight' || theme === 'vercel' || theme === 'internet';

  return (
    <div className="login-root">
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
          {['✦ Finance & Goals', '✦ Habits & Lab', '✦ Journal & Focus'].map((p) => (
            <span key={p} className="login-pill">{p}</span>
          ))}
        </motion.div>
      </div>

      <div className="login-right">
        <motion.div
          className="login-form-wrap"
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="login-native-header">
            <h1 className="login-native-title">Sign in.</h1>
            <p className="login-native-subtitle">
              {IS_WAITLIST_MODE
                ? 'Approved testers only. Everyone else — join the waitlist.'
                : 'Account sign-in is being rebuilt on AWS Cognito.'}
            </p>
          </div>

          <div className="login-placeholder-card">
            <p className="login-placeholder-text">
              We removed the old auth provider and are finishing AWS Cognito login.
              If you are on the approved tester list, sign-in will return here soon.
            </p>
            {IS_WAITLIST_MODE ? (
              <Link to="/" className="login-cta">Back to waitlist</Link>
            ) : (
              <Link to="/contact" className="login-cta">Contact support</Link>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`
        .login-root {
          display: flex;
          min-height: 100vh;
          overflow: hidden;
          background: var(--color-base);
        }

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

        .login-left-logo { position: relative; z-index: 2; }

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
        }

        .login-right {
          flex: 1;
          min-height: 100vh;
          background: var(--color-base);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
        }

        .login-form-wrap {
          width: 100%;
          max-width: 400px;
        }

        .login-native-header {
          margin-bottom: 32px;
        }

        .login-native-title {
          font-family: var(--font-serif);
          font-size: 42px;
          font-weight: 800;
          color: var(--color-text-1);
          letter-spacing: -0.04em;
          margin: 0 0 8px;
        }

        .login-native-subtitle {
          font-size: 16px;
          color: var(--color-text-3);
          margin: 0;
          line-height: 1.5;
        }

        .login-placeholder-card {
          padding: 24px;
          border-radius: 16px;
          border: 1px solid var(--color-border);
          background: ${isDark ? 'rgba(255,255,255,0.03)' : '#fff'};
        }

        .login-placeholder-text {
          margin: 0 0 20px;
          font-size: 14px;
          line-height: 1.6;
          color: var(--color-text-2);
        }

        .login-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 14px 18px;
          border-radius: 14px;
          background: #1E5C3A;
          color: #fff;
          font-weight: 600;
          text-decoration: none;
        }

        @media (max-width: 900px) {
          .login-left { display: none; }
        }
      `}</style>
    </div>
  );
}
