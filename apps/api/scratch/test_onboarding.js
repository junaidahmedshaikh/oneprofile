import dotenv from 'dotenv';
dotenv.config({ path: 'apps/api/.env' });

import { connectDatabase } from '../src/config/database.js';
import { User } from '../src/models/User.js';
import { OnboardingDraft } from '../src/models/OnboardingDraft.js';
import { signAccessToken } from '../src/utils/jwt.js';

async function diagnose() {
  await connectDatabase({ allowDegradedMode: false });
  console.log("Database connected successfully.");

  const user = await User.findOne({});
  if (!user) {
    console.error("No user found in database!");
    process.exit(1);
  }
  console.log("Diagnosing for user:", user._id, user.email);

  const payload = {
    sub: String(user._id),
    sessionId: "diagnostic-session",
    roles: user.roles || [],
    permissions: user.permissions || []
  };

  const token = signAccessToken(payload);
  console.log("Generated diagnostic token.");

  // Hit the local API on port 4000
  const url = 'http://localhost:4000/api/v1/onboarding/me';
  
  // Build a dummy request body representing form mount values
  const body = {
    currentStep: "industry",
    companyDetails: {
      companyName: "",
      legalName: "",
      website: "",
      email: "",
      phone: "",
      city: "",
      country: "",
      tagline: "",
      description: "",
      gstNumber: "",
      registrationDetails: "",
      serviceArea: "",
      foundedYear: null,
      teamSize: null,
    },
    personalDetails: { title: "", bio: "", avatarUrl: "", coverImageUrl: "", languagesRaw: "", skillsRaw: "", certificationsRaw: "" },
    contactDetails: { email: "", phone: "", whatsAppNumber: "" },
    socialLinks: { linkedin: "", twitter: "", github: "", website: "", instagram: "", facebook: "", youtube: "", customLinks: [] }
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    console.log("Status Code:", response.status);
    const data = await response.json();
    console.log("Response Body:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Request failed:", error);
  }

  process.exit(0);
}

diagnose();
