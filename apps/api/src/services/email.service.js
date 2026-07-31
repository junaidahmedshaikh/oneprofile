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
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000
  });
}

const transport = createTransport();

async function sendMailInternal({ to, subject, text, html }) {
  // 1. Try Mailjet HTTP API
  if (env.MAILJET_API_KEY && env.MAILJET_SECRET_KEY) {
    try {
      const auth = Buffer.from(`${env.MAILJET_API_KEY}:${env.MAILJET_SECRET_KEY}`).toString('base64');
      
      let senderEmail = 'junaid.shaikh0708@gmail.com';
      let senderName = 'OneProfile';
      
      const senderMatch = env.MAILJET_SENDER.match(/^(.*?)\s*<(.*?)>$/);
      if (senderMatch) {
        senderName = senderMatch[1].trim();
        senderEmail = senderMatch[2].trim();
      } else if (env.MAILJET_SENDER) {
        senderEmail = env.MAILJET_SENDER.trim();
      }

      const response = await fetch('https://api.mailjet.com/v3.1/send', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Messages: [
            {
              From: { Email: senderEmail, Name: senderName },
              To: [{ Email: to, Name: to.split('@')[0] }],
              Subject: subject,
              TextPart: text,
              HTMLPart: html
            }
          ]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        logger.error({ data }, 'Mailjet API returned an error');
        throw new Error(data.ErrorMessage || 'Mailjet error');
      }
      return data;
    } catch (err) {
      logger.error({ err }, 'Failed to send email via Mailjet');
    }
  }

  // 2. Try Resend HTTP API
  const resendKey = env.RESEND_API_KEY || env.RESEND_KEY;
  if (resendKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
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
    }
  }

  // 3. Try Brevo HTTP API
  if (env.BREVO_API_KEY) {
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sender: {
            name: 'OneProfile',
            email: env.SMTP_USER || 'junaid.shaikh0708@gmail.com'
          },
          to: [{ email: to }],
          subject,
          textContent: text,
          htmlContent: html
        })
      });
      const data = await response.json();
      if (!response.ok) {
        logger.error({ data }, 'Brevo API returned an error');
        throw new Error(data.message || 'Brevo error');
      }
      return data;
    } catch (err) {
      logger.error({ err }, 'Failed to send email via Brevo');
    }
  }

  // 4. Fallback to Nodemailer SMTP
  if (!transport) {
    logger.info({ to, subject, preview: text }, 'No HTTP Email API or SMTP configured, email skipped');
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

export async function sendMail({ to, subject, text, html }) {
  const timeoutMs = 6000;
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Email dispatch timed out')), timeoutMs)
  );

  try {
    return await Promise.race([
      sendMailInternal({ to, subject, text, html }),
      timeoutPromise
    ]);
  } catch (err) {
    logger.error({ err, to }, 'sendMail failed or timed out');
    return { skipped: true, error: err.message };
  }
}
