/**
 * Transactional email — AWS SES SMTP and/or Resend HTTP API.
 *
 * EMAIL_PROVIDER:
 *   auto   — Resend if RESEND_API_KEY set, else SES SMTP (default)
 *   resend — Resend only
 *   ses    — SES SMTP only
 */
import nodemailer from 'nodemailer';
import logger from './logger.js';
import { renderEmail } from './emailTemplates.js';

const FROM_EMAIL = process.env.SES_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'noreply@aiimin.in';
const FROM_NAME = process.env.SES_FROM_NAME || 'AIIMIN';
const SES_REGION = process.env.AWS_SES_REGION || 'ap-south-1';
const EMAIL_PROVIDER = (process.env.EMAIL_PROVIDER || 'auto').toLowerCase();

let sesTransporter = null;

function getSesTransporter() {
  if (sesTransporter) return sesTransporter;

  const smtpUser = process.env.AWS_SES_SMTP_USER;
  const smtpPass = process.env.AWS_SES_SMTP_PASS;

  if (smtpUser && smtpPass) {
    sesTransporter = nodemailer.createTransport({
      host: `email-smtp.${SES_REGION}.amazonaws.com`,
      port: 587,
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    });
    return sesTransporter;
  }

  return null;
}

function resolveProvider() {
  const hasResend = Boolean(process.env.RESEND_API_KEY);
  const hasSes = Boolean(process.env.AWS_SES_SMTP_USER && process.env.AWS_SES_SMTP_PASS);

  if (EMAIL_PROVIDER === 'resend') return hasResend ? 'resend' : null;
  if (EMAIL_PROVIDER === 'ses') return hasSes ? 'ses' : null;
  if (hasResend) return 'resend';
  if (hasSes) return 'ses';
  return null;
}

async function sendViaResend({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not configured');

  const from = process.env.RESEND_FROM || `"${FROM_NAME}" <${FROM_EMAIL}>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = body?.message || body?.error || res.statusText;
    throw new Error(`Resend API error (${res.status}): ${detail}`);
  }

  return { messageId: body.id, provider: 'resend' };
}

async function sendViaSes({ to, subject, html }) {
  const transport = getSesTransporter();
  if (!transport) throw new Error('SES SMTP not configured');

  const info = await transport.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  });

  return { messageId: info.messageId, provider: 'ses' };
}

/**
 * @param {string} to
 * @param {string} templateId
 * @param {Record<string, string>} variables
 */
export async function sendEmail(to, templateId, variables = {}) {
  if (!to || !templateId) {
    throw new Error('sendEmail requires to and templateId');
  }

  const { subject, html } = renderEmail(templateId, variables);
  const provider = resolveProvider();

  if (!provider) {
    logger.info('[email] no provider configured — stub send', { to, templateId, subject });
    return { stub: true, messageId: `stub-${Date.now()}`, provider: 'stub' };
  }

  try {
    const result = provider === 'resend'
      ? await sendViaResend({ to, subject, html })
      : await sendViaSes({ to, subject, html });

    logger.info('[email] sent', { to, templateId, provider: result.provider, messageId: result.messageId });
    return result;
  } catch (err) {
    // If auto mode preferred Resend but it failed, try SES once as fallback.
    if (provider === 'resend' && EMAIL_PROVIDER === 'auto' && getSesTransporter()) {
      logger.warn('[email] Resend failed, falling back to SES', { error: err.message });
      const fallback = await sendViaSes({ to, subject, html });
      logger.info('[email] sent via SES fallback', { to, templateId, messageId: fallback.messageId });
      return fallback;
    }
    throw err;
  }
}

export function isEmailConfigured() {
  return resolveProvider() !== null;
}

export function getEmailProvider() {
  return resolveProvider() || 'stub';
}
