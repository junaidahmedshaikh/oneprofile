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
  if (!transport) {
    logger.info({ to, subject, preview: text }, 'SMTP not configured, email skipped');
    return { skipped: true };
  }

  return transport.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    text,
    html
  });
}
