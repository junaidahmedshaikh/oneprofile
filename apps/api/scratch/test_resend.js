import dotenv from 'dotenv';
dotenv.config({ path: 'apps/api/.env' });

async function testResend() {
  const resendKey = process.env.RESEND_KEY || process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("No Resend key found");
    process.exit(1);
  }

  console.log("Testing Resend API key:", resendKey.substring(0, 8) + "...");
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'OneProfile <onboarding@resend.dev>',
        to: ['fakeforasuslaptop@gmail.com'],
        subject: 'Resend Live Check',
        html: '<p>Testing Resend key</p>'
      })
    });

    console.log("Status Code:", response.status);
    const data = await response.json();
    console.log("Response Body:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

testResend();
