import dotenv from 'dotenv';
dotenv.config({ path: 'apps/api/.env' });

import { sendMail } from '../src/services/email.service.js';

async function testFallback() {
  console.log("Testing sendMail with Mailjet + Resend fallback...");
  const result = await sendMail({
    to: 'fakeforasuslaptop@gmail.com',
    subject: 'OneProfile Integration Test',
    text: 'Your verification code is 123456.',
    html: '<p>Your verification code is <strong>123456</strong>.</p>'
  });

  console.log("sendMail Result:", JSON.stringify(result, null, 2));
}

testFallback();
