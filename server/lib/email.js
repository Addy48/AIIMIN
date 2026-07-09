/**
 * Transactional email — Resend API (https://resend.com)
 */
import { Resend } from 'resend';
import logger from './logger.js';
import { renderEmail } from './emailTemplates.js';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@admin.aiimin.in';
const FROM_NAME = process.env.RESEND_FROM_NAME || 'AIIMIN';
const REPLY_TO = process.env.RESEND_REPLY_TO || 'aadityaupadhyay10@gmail.com';

let resendClient = null;

function getResend() {
  if (resendClient) return resendClient;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  resendClient = new Resend(apiKey);
  return resendClient;
}

function buildFrom() {
  const custom = process.env.RESEND_FROM?.trim();
  if (custom) return custom;
  return `${FROM_NAME} <${FROM_EMAIL}>`;
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
  const client = getResend();

  if (!client) {
    logger.info('[email] RESEND_API_KEY not set — stub send', { to, templateId, subject });
    return { stub: true, messageId: `stub-${Date.now()}`, provider: 'stub' };
  }

  const { data, error } = await client.emails.send({
    from: buildFrom(),
    to: [to],
    subject,
    html,
    replyTo: REPLY_TO,
  });

  if (error) {
    throw new Error(error.message || 'Resend send failed');
  }

  logger.info('[email] sent', { to, templateId, provider: 'resend', messageId: data?.id });
  return { messageId: data?.id, provider: 'resend' };
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getEmailProvider() {
  return isEmailConfigured() ? 'resend' : 'stub';
}
