import { logger } from '../config/logger.js';

export async function sendSms({ to, message }) {
  logger.info({ to, preview: message }, 'SMS provider not configured, SMS skipped');
  return { skipped: true };
}
