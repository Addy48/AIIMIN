/**
 * Transactional email — Resend API (https://resend.com)
 */
import { Resend } from 'resend';
import logger from './logger.js';
import { renderEmail } from './emailTemplates.js';
import { buildWaitlistResendVariables } from './waitlistEmailVariants.js';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@admin.aiimin.in';
const FROM_NAME = process.env.RESEND_FROM_NAME || 'AIIMIN';
const REPLY_TO = process.env.RESEND_REPLY_TO || 'aadityaupadhyay10@gmail.com';
const RESEND_API = 'https://api.resend.com';

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

async function resendFetch(path, options = {}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not set');
  const res = await fetch(`${RESEND_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.message || body?.error || `Resend API ${res.status}`);
  }
  return body;
}

async function sendWaitlistViaResendTemplate(to, variables) {
  const templateId = process.env.RESEND_WAITLIST_TEMPLATE_ID;
  if (!templateId) return null;

  const data = await resendFetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      from: buildFrom(),
      to: [to],
      reply_to: REPLY_TO,
      template: {
        id: templateId,
        variables: buildWaitlistResendVariables(variables),
      },
    }),
  });

  logger.info('[email] sent via Resend template', {
    to,
    templateId,
    provider: 'resend',
    messageId: data?.id,
  });
  return { messageId: data?.id, provider: 'resend', mode: 'template' };
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

  if (templateId === 'waitlist_confirmation' && process.env.RESEND_WAITLIST_TEMPLATE_ID) {
    const client = getResend();
    if (!client) {
      logger.info('[email] RESEND_API_KEY not set — stub send', { to, templateId });
      return { stub: true, messageId: `stub-${Date.now()}`, provider: 'stub' };
    }
    return sendWaitlistViaResendTemplate(to, variables);
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
  return { messageId: data?.id, provider: 'resend', mode: 'html' };
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getEmailProvider() {
  return isEmailConfigured() ? 'resend' : 'stub';
}
