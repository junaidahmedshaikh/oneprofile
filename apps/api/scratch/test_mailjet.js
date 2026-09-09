import dotenv from 'dotenv';
dotenv.config({ path: 'apps/api/.env' });

async function testMailjet() {
  const apiKey = process.env.MAILJET_API_KEY;
  const secretKey = process.env.MAILJET_SECRET_KEY;
  const sender = process.env.MAILJET_SENDER || 'OneProfile <oneprofile.support@gmail.com>';

  if (!apiKey || !secretKey) {
    console.error("Error: MAILJET_API_KEY or MAILJET_SECRET_KEY missing!");
    process.exit(1);
  }

  console.log("Testing Mailjet API with key:", apiKey.substring(0, 8) + "...");
  const auth = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');

  let senderEmail = 'oneprofile.support@gmail.com';
  let senderName = 'OneProfile';
  const match = sender.match(/^(.*?)\s*<(.*?)>$/);
  if (match) {
    senderName = match[1].trim();
    senderEmail = match[2].trim();
  }

  const payload = {
    Messages: [
      {
        From: { Email: senderEmail, Name: senderName },
        To: [{ Email: 'oneprofile.support@gmail.com', Name: 'Test User' }],
        Subject: 'Mailjet Live API Verification Test',
        TextPart: 'Your OneProfile Mailjet API test email is working!',
        HTMLPart: '<h3>Mailjet Live API Verification Test</h3><p>Your OneProfile Mailjet API integration is working!</p>'
      }
    ]
  };

  try {
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log("HTTP Response Status:", response.status);
    const data = await response.json();
    console.log("Response Body:", JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("✅ Mailjet email sent successfully!");
    } else {
      console.error("❌ Mailjet returned an error response.");
    }
  } catch (error) {
    console.error("❌ Network or fetch error:", error);
  }
}

testMailjet();
