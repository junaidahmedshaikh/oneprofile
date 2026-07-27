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
              From: {
                Email: senderEmail,
                Name: senderName
              },
              To: [
                {
                  Email: to,
                  Name: to.split('@')[0]
                }
              ],
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

