import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

function createTransport() {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });
}

const transport = createTransport();

export async function sendMail({ to, subject, text, html }) {
  if (env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: env.RESEND_FROM || 'OneProfile <onboarding@resend.dev>',
          to: Array.isArray(to) ? to : [to],
          subject,
          text,
          html
        })
      });
      const data = await response.json();
      if (!response.ok) {
        logger.error({ data }, 'Resend API returned an error');
        throw new Error(data.message || 'Resend error');
      }
      return data;
    } catch (err) {
      logger.error({ err }, 'Failed to send email via Resend');
      if (!transport) throw err;
    }
  }

  if (!transport) {
    logger.info({ to, subject, preview: text }, 'SMTP / Resend not configured, email skipped');
    return { skipped: true };
  }

  return transport.sendMail({
    from: env.SMTP_FROM || 'oneprofile <no-reply@oneprofile.com>',
    to,
    subject,
    text,
    html
  });
}

