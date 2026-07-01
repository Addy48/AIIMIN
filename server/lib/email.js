/**
 * server/lib/email.js — AWS SES via nodemailer SMTP (AW-02).
 */
import nodemailer from 'nodemailer';
import logger from './logger.js';
import { renderEmail } from './emailTemplates.js';

const FROM_EMAIL = process.env.SES_FROM_EMAIL || 'noreply@aiimin.in';
const FROM_NAME = process.env.SES_FROM_NAME || 'AIIMIN';
const SES_REGION = process.env.AWS_SES_REGION || 'ap-south-1';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const smtpUser = process.env.AWS_SES_SMTP_USER;
  const smtpPass = process.env.AWS_SES_SMTP_PASS;

  if (smtpUser && smtpPass) {
    transporter = nodemailer.createTransport({
      host: `email-smtp.${SES_REGION}.amazonaws.com`,
      port: 587,
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    });
    return transporter;
  }

  return null;
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
  const transport = getTransporter();

  if (!transport) {
    logger.info('[email] SES SMTP not configured — stub send', { to, templateId, subject });
    return { stub: true, messageId: `stub-${Date.now()}` };
  }

  const info = await transport.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  });

  logger.info('[email] sent', { to, templateId, messageId: info.messageId });
  return { messageId: info.messageId };
}

export function isEmailConfigured() {
  return Boolean(process.env.AWS_SES_SMTP_USER && process.env.AWS_SES_SMTP_PASS);
}
