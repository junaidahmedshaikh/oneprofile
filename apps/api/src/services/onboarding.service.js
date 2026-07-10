import { nanoid } from "nanoid";
import { OnboardingDraft } from "../models/OnboardingDraft.js";
import { OnboardingResumeToken } from "../models/OnboardingResumeToken.js";
import { Tenant } from "../models/Tenant.js";
import { Membership } from "../models/Membership.js";
import { User } from "../models/User.js";
import { Profile } from "../models/Profile.js";
import { ApiError } from "../utils/apiError.js";
import { generateSecureToken, sha256 } from "../utils/crypto.js";
import { uploadLogoDataUri } from "./storage/cloudinary.service.js";

const stepOrder = ["industry", "category", "company", "logo", "content"];

const industryCatalog = [
  { key: "information_technology", label: "Information Technology" },
  { key: "healthcare", label: "Healthcare" },
  { key: "finance", label: "Finance" },
  { key: "education", label: "Education" },
  { key: "real_estate", label: "Real Estate" },
  { key: "manufacturing", label: "Manufacturing" },
  { key: "retail", label: "Retail" },
  { key: "construction", label: "Construction" },
  { key: "hospitality", label: "Hospitality" },
  { key: "legal", label: "Legal" },
  { key: "marketing", label: "Marketing" },
  { key: "agriculture", label: "Agriculture" },
  { key: "media_entertainment", label: "Media & Entertainment" },
  { key: "beauty_wellness", label: "Beauty & Wellness" },
  { key: "transportation_logistics", label: "Transportation & Logistics" },
  { key: "other", label: "Other" },
];

const businessTypeCatalog = [
  { key: "company", label: "Company" },
  { key: "startup", label: "Startup" },
  { key: "agency", label: "Agency" },
  { key: "brand", label: "Brand" },
  { key: "store", label: "Store" },
  { key: "organization", label: "Organization" },
  { key: "manufacturer", label: "Manufacturer" },
  { key: "distributor", label: "Distributor" },
  { key: "retail_shop", label: "Retail Shop" },
  { key: "wholesaler", label: "Wholesaler" },
  { key: "service_provider", label: "Service Provider" },
  { key: "non_profit", label: "Non-Profit" },
  { key: "other", label: "Other" },
];

const themeCatalog = [
  {
    key: "aurora",
    name: "Aurora",
    primary: "#4F8CFF",
    accent: "#22D3EE",
    mode: "dark",
    description: "Clean, luminous, and high-trust.",
  },
  {
    key: "midnight",
    name: "Midnight",
    primary: "#A78BFA",
    accent: "#60A5FA",
    mode: "dark",
    description: "Elegant and deeply minimal.",
  },
  {
    key: "sunrise",
    name: "Sunrise",
    primary: "#F97316",
    accent: "#FACC15",
    mode: "light",
    description: "Warm, bright, and energetic.",
  },
  {
    key: "mono",
    name: "Mono",
    primary: "#E2E8F0",
    accent: "#94A3B8",
    mode: "dark",
    description: "Editorial, restrained, premium.",
  },
];

const professionalCategoryCatalog = [
  { key: "doctor", label: "Doctor" },
  { key: "engineer", label: "Engineer" },
  { key: "lawyer", label: "Lawyer" },
  { key: "chartered_accountant", label: "Chartered Accountant" },
  { key: "architect", label: "Architect" },
  { key: "teacher", label: "Teacher" },
  { key: "consultant", label: "Consultant" },
  { key: "freelancer", label: "Freelancer" },
  { key: "real_estate_agent", label: "Real Estate Agent" },
  { key: "insurance_agent", label: "Insurance Agent" },
  { key: "designer", label: "Designer" },
  { key: "developer", label: "Developer" },
  { key: "photographer", label: "Photographer" },
  { key: "employee", label: "Employee" },
  { key: "marketing_professional", label: "Marketing Professional" },
  { key: "hr_professional", label: "HR Professional" },
  { key: "sales_professional", label: "Sales Professional" },
  { key: "other", label: "Other" },
];

const stepLabels = {
  industry: "Industry",
  category: "Category",
  company: "Company",
  logo: "Logo",
  // theme: "Theme",
  content: "Content",
};

function computeProgress(draft) {
  const steps =
    draft.profileType === "professional"
      ? ["industry", "category", "logo", "content"]
      : ["industry", "category", "company", "logo", "content"];
  const completed = new Set((draft.completedSteps || []).filter(s => steps.includes(s)));
  return Math.round((completed.size / steps.length) * 100);
}

async function syncUserOnboarding(userId, draft) {
  const user = await User.findById(userId);
  if (!user) return;
  user.onboardingStatus =
    draft.status === "published"
      ? "published"
      : draft.status === "paused"
        ? "in_progress"
        : draft.progress > 0
          ? "in_progress"
          : "not_started";
  user.onboardingProgress = draft.progress;
  if (draft.status === "published") {
    user.publishedProfileSlug =
      draft.publishedProfile.slug || user.publishedProfileSlug;
    user.publishedAt = draft.publishedProfile.publishedAt || user.publishedAt;
  }
  await user.save();
}

function buildSuggestion({ industry, businessCategory, companyName, tagline }) {
  const label = companyName || "Your business";
  const industryLabel = industry?.label || "your industry";
  const categoryLabel = businessCategory?.label || "service";
  return {
    headline: `${label} for modern ${industryLabel.toLowerCase()}`,
    summary:
      tagline ||
      `${label} helps teams move faster with focused ${categoryLabel.toLowerCase()} experiences built for trust and clarity.`,
    benefits: [
      `Trusted ${categoryLabel.toLowerCase()} expertise`,
      "Built for fast decision-making",
      "Optimized for polished online presence",
    ],
    ctaLabel: "Get in touch",
  };
}

async function ensureDraft(userId) {
  let draft = await OnboardingDraft.findOne({ userId });
  if (!draft) {
    draft = await OnboardingDraft.create({
      userId,
      status: "draft",
      currentStep: "industry",
    });
  }
  return draft;
}

function normalizeCompanyDetails(input = {}) {
  return {
    companyName: input.companyName || "",
    legalName: input.legalName || "",
    website: input.website || "",
    email: input.email || "",
    phone: input.phone || "",
    city: input.city || "",
    country: input.country || "",
    tagline: input.tagline || "",
    description: input.description || "",
    gstNumber: input.gstNumber || "",
    registrationDetails: input.registrationDetails || "",
    serviceArea: input.serviceArea || "",
    foundedYear: input.foundedYear || null,
    teamSize: input.teamSize || null,
  };
}

function normalizeTheme(theme = {}) {
  const selected =
    themeCatalog.find((item) => item.key === theme.key) || themeCatalog[0];
  return {
    key: selected.key,
    name: selected.name,
    primary: selected.primary,
    accent: selected.accent,
    mode: theme.mode || selected.mode,
  };
}

function normalizeIndustry(industry = {}) {
  const selected =
    industryCatalog.find((item) => item.key === industry.key) || null;
  return selected || { key: industry.key || "", label: industry.label || "" };
}

function normalizeCategory(category = {}) {
  const selected =
    businessTypeCatalog.find((item) => item.key === category.key) || null;
  return selected || { key: category.key || "", label: category.label || "" };
}

function normalizeProfessionalCategory(category = {}) {
  const selected =
    professionalCategoryCatalog.find((item) => item.key === category.key) ||
    null;
  return selected || { key: category.key || "", label: category.label || "" };
}

export async function getLookups() {
  return {
    industries: industryCatalog,
    businessTypes: businessTypeCatalog,
    professionalCategories: professionalCategoryCatalog,
    themes: themeCatalog,
    stepOrder,
  };
}

export async function getOnboardingState(userId) {
  const draft = await ensureDraft(userId);
  return draft;
}

export async function saveOnboardingDraft(userId, payload) {
  const draft = await ensureDraft(userId);
  const nextIndustry = payload.industry
    ? normalizeIndustry(payload.industry)
    : draft.industry;
  const nextCategory = payload.businessCategory
    ? normalizeCategory(payload.businessCategory)
    : draft.businessCategory;

  if (payload.industry) draft.industry = nextIndustry;
  if (payload.businessCategory) draft.businessCategory = nextCategory;
  if (payload.profileType) draft.profileType = payload.profileType;
  if (payload.professionalCategory)
    draft.professionalCategory = normalizeProfessionalCategory(
      payload.professionalCategory,
    );
  if (payload.companyDetails)
    draft.companyDetails = normalizeCompanyDetails(payload.companyDetails);
  if (payload.theme) draft.theme = normalizeTheme(payload.theme);
  if (payload.currentStep) draft.currentStep = payload.currentStep;
  if (Array.isArray(payload.completedSteps))
    draft.completedSteps = payload.completedSteps;
  if (Array.isArray(payload.skippedSteps))
    draft.skippedSteps = payload.skippedSteps;
  if (payload.personalDetails) draft.personalDetails = payload.personalDetails;
  if (payload.socialLinks) draft.socialLinks = payload.socialLinks;
  if (Array.isArray(payload.experience)) draft.experience = payload.experience;
  if (payload.contactDetails) draft.contactDetails = payload.contactDetails;
  if (payload.aiContent) {
    draft.aiContent = {
      headline: payload.aiContent.headline || "",
      summary: payload.aiContent.summary || "",
      benefits: payload.aiContent.benefits || [],
      ctaLabel: payload.aiContent.ctaLabel || "",
    };
  }

  draft.progress = computeProgress(draft);
  draft.status =
    draft.progress >= 100
      ? "ready_to_publish"
      : draft.progress > 0
        ? "in_progress"
        : "draft";
  draft.autoSaveMeta.lastSavedAt = new Date();
  await draft.save();
  await syncUserOnboarding(userId, draft);

  return draft;
}

export async function completeStep(userId, step, payload = {}) {
  if (!stepOrder.includes(step)) {
    throw new ApiError(
      400,
      "Invalid onboarding step",
      "ONBOARDING_STEP_INVALID",
    );
  }

  const draft = await ensureDraft(userId);
  if (payload.profileType) draft.profileType = payload.profileType;
  if (step === "category") {
    if (payload.businessCategory) {
      draft.businessCategory = normalizeCategory(payload.businessCategory);
    }
    if (payload.professionalCategory) {
      draft.professionalCategory = normalizeProfessionalCategory(
        payload.professionalCategory,
      );
    }
  }
  if (step === "company") {
    if (payload.industry) {
      draft.industry = normalizeIndustry(payload.industry);
    }
  }
  if (step === "logo") {
    if (payload.companyDetails)
      draft.companyDetails = normalizeCompanyDetails(payload.companyDetails);
    if (payload.logo) draft.logo = payload.logo;
  }
  if (step === "theme" && payload.theme) {
    draft.theme = normalizeTheme(payload.theme);
  }
  if (step === "content" && payload.aiContent) {
    draft.aiContent = {
      headline: payload.aiContent.headline || "",
      summary: payload.aiContent.summary || "",
      benefits: payload.aiContent.benefits || [],
      ctaLabel: payload.aiContent.ctaLabel || "",
    };
  }

  if (payload.personalDetails) draft.personalDetails = payload.personalDetails;
  if (payload.socialLinks) draft.socialLinks = payload.socialLinks;
  if (Array.isArray(payload.experience)) draft.experience = payload.experience;
  if (payload.contactDetails) draft.contactDetails = payload.contactDetails;

  const steps =
    draft.profileType === "professional"
      ? ["industry", "category", "logo", "content"]
      : ["industry", "category", "company", "logo", "content"];

  if (!draft.completedSteps.includes(step)) {
    draft.completedSteps.push(step);
  }
  draft.currentStep =
    steps[Math.min(steps.indexOf(step) + 1, steps.length - 1)] || "content";
  draft.status =
    draft.completedSteps.length >= steps.length
      ? "ready_to_publish"
      : "in_progress";
  draft.progress = computeProgress(draft);
  draft.autoSaveMeta.lastSavedAt = new Date();
  await draft.save();
  await syncUserOnboarding(userId, draft);
  return draft;
}

export async function skipStep(userId, step) {
  if (!stepOrder.includes(step)) {
    throw new ApiError(
      400,
      "Invalid onboarding step",
      "ONBOARDING_STEP_INVALID",
    );
  }

  const draft = await ensureDraft(userId);
  if (!draft.skippedSteps.includes(step)) {
    draft.skippedSteps.push(step);
  }
  if (!draft.completedSteps.includes(step)) {
    draft.completedSteps.push(step);
  }
  draft.currentStep =
    stepOrder[Math.min(stepOrder.indexOf(step) + 1, stepOrder.length - 1)] ||
    "content";
  draft.status = "in_progress";
  draft.progress = computeProgress(draft);
  draft.autoSaveMeta.lastSavedAt = new Date();
  await draft.save();
  await syncUserOnboarding(userId, draft);
  return draft;
}

export async function uploadLogo(userId, dataUri) {
  const draft = await ensureDraft(userId);
  const result = await uploadLogoDataUri(dataUri);
  draft.logo = {
    url: result.secure_url,
    publicId: result.public_id || "",
    provider: result.provider || "cloudinary",
  };
  if (!draft.completedSteps.includes("logo")) {
    draft.completedSteps.push("logo");
  }
  draft.currentStep = "theme";
  draft.progress = computeProgress(draft);
  draft.status = "in_progress";
  draft.autoSaveMeta.lastSavedAt = new Date();
  await draft.save();
  await syncUserOnboarding(userId, draft);
  return draft;
}

export async function generateAiContent(userId) {
  const draft = await ensureDraft(userId);
  const suggestion = buildSuggestion({
    industry: draft.industry,
    businessCategory: draft.businessCategory,
    companyName: draft.companyDetails?.companyName,
    tagline: draft.companyDetails?.tagline,
  });

  draft.aiContent = suggestion;
  if (!draft.completedSteps.includes("content")) {
    draft.completedSteps.push("content");
  }
  draft.progress = computeProgress(draft);
  draft.status = draft.progress >= 100 ? "ready_to_publish" : "in_progress";
  draft.autoSaveMeta.lastSavedAt = new Date();
  await draft.save();
  await syncUserOnboarding(userId, draft);
  return { draft, suggestion };
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

async function uniqueTenantSlug(base) {
  let slug = slugify(base) || `business-${nanoid(6)}`;
  let exists = await Tenant.findOne({ slug });
  while (exists) {
    slug = `${slugify(base)}-${nanoid(4)}`;
    exists = await Tenant.findOne({ slug });
  }
  return slug;
}

export async function resumeLater(userId) {
  const draft = await ensureDraft(userId);
  const rawToken = generateSecureToken(32);
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  await OnboardingResumeToken.deleteMany({ userId, usedAt: null });
  await OnboardingResumeToken.create({ userId, tokenHash, expiresAt });
  draft.status = "paused";
  draft.autoSaveMeta.lastSavedAt = new Date();
  draft.autoSaveMeta.resumeCount += 1;
  await draft.save();
  await syncUserOnboarding(userId, draft);
  return {
    draft,
    resumeToken: rawToken,
  };
}

export async function resumeFromToken(token) {
  const tokenHash = sha256(token);
  const record = await OnboardingResumeToken.findOne({
    tokenHash,
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });
  if (!record) {
    throw new ApiError(
      400,
      "Resume token is invalid or expired",
      "ONBOARDING_RESUME_INVALID",
    );
  }
  record.usedAt = new Date();
  await record.save();
  return ensureDraft(record.userId);
}

export async function publishOnboarding(userId) {
  const draft = await ensureDraft(userId);
  if (draft.status === "published" && draft.tenantId) {
    const tenant = await Tenant.findById(draft.tenantId);
    return {
      draft,
      tenant,
      publishedUrl: draft.publishedProfile.url,
    };
  }

  const required = draft.profileType === 'professional'
    ? [draft.professionalCategory?.key, draft.personalDetails?.title]
    : [draft.businessCategory?.key, draft.companyDetails?.companyName];

  if (required.some((value) => !value)) {
    throw new ApiError(
      400,
      "Complete the required steps before publishing",
      "ONBOARDING_INCOMPLETE",
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found", "USER_NOT_FOUND");
  }

  const brandName =
    draft.profileType === "professional"
      ? draft.personalDetails?.title ||
        (user.firstName
          ? `${user.firstName} ${user.lastName}`.trim()
          : user.name)
      : draft.companyDetails?.companyName || "My Business";

  const tenantSlug = await uniqueTenantSlug(brandName);
  const tenant = await Tenant.create({
    name: brandName,
    slug: tenantSlug,
    ownerId: userId,
    status: "active",
  });

  await Membership.updateOne(
    { userId, tenantId: tenant._id },
    {
      $setOnInsert: {
        userId,
        tenantId: tenant._id,
        role: "owner",
        status: "active",
      },
    },
    { upsert: true },
  );

  const publishedAt = new Date();
  draft.tenantId = tenant._id;
  draft.status = "published";
  draft.progress = 100;
  draft.publishedProfile = {
    slug: tenantSlug,
    url: `/profile/${tenantSlug}`,
    publishedAt,
  };
  draft.currentStep = "content";
  draft.autoSaveMeta.lastSavedAt = publishedAt;
  await draft.save();

  user.onboardingStatus = "published";
  user.onboardingProgress = 100;
  user.publishedProfileSlug = tenantSlug;
  user.publishedAt = publishedAt;
  await user.save();

  // Create or update live Profile database document
  await Profile.findOneAndUpdate(
    { userId },
    {
      userId,
      slug: tenantSlug,
      profileType: draft.profileType || "business",
      industry: draft.industry?.label || "",
      businessCategory:
        draft.profileType === "business"
          ? draft.businessCategory?.label || ""
          : "",
      professionalCategory:
        draft.profileType === "professional"
          ? draft.professionalCategory?.label || ""
          : "",
      employmentType: draft.personalDetails?.employmentType || "self_employed",
      designation: draft.personalDetails?.designation || "",
      yearsOfExperience: draft.personalDetails?.yearsOfExperience || null,
      practiceName: draft.personalDetails?.practiceName || "",
      department: draft.personalDetails?.department || "",
      workLocation: draft.personalDetails?.workLocation || "",
      
      title:
        draft.personalDetails?.title ||
        (user.firstName
          ? `${user.firstName} ${user.lastName}`.trim()
          : user.name),
      bio:
        draft.profileType === "professional"
          ? draft.personalDetails?.bio || ""
          : draft.companyDetails?.description || "",
      avatarUrl: draft.personalDetails?.avatarUrl || user.avatarUrl || "",
      coverImageUrl: draft.personalDetails?.coverImageUrl || "",
      languages: draft.personalDetails?.languages || [],
      skills: draft.personalDetails?.skills || [],
      certifications: draft.personalDetails?.certifications || [],
      experience: draft.experience || [],
      
      companyName: draft.companyDetails?.companyName || "",
      tagline: draft.companyDetails?.tagline || "",
      description: draft.companyDetails?.description || "",
      logoUrl: draft.logo?.url || "",
      gstNumber: draft.companyDetails?.gstNumber || "",
      registrationDetails: draft.companyDetails?.registrationDetails || "",
      serviceArea: draft.companyDetails?.serviceArea || "",
      foundedYear: draft.companyDetails?.foundedYear || null,
      teamSize: draft.companyDetails?.teamSize || null,
      theme: draft.theme || {
        key: "aurora",
        name: "Aurora",
        primary: "#4F8CFF",
        accent: "#22D3EE",
        mode: "dark",
      },
      socialLinks: draft.socialLinks || {
        linkedin: "",
        twitter: "",
        github: "",
        website: "",
        instagram: "",
        facebook: "",
        youtube: "",
        customLinks: [],
      },
      contactDetails: {
        email: draft.contactDetails?.email || user.email || "",
        phone: draft.contactDetails?.phone || user.phone || "",
        whatsAppNumber: draft.contactDetails?.whatsAppNumber || "",
      },
      location: {
        address: draft.contactDetails?.address || "",
        city: draft.companyDetails?.city || "",
        country: draft.companyDetails?.country || "",
        mapsEmbedUrl: draft.contactDetails?.mapsEmbedUrl || "",
      },
      visibility: "public",
    },
    { upsert: true, new: true },
  );

  return {
    draft,
    tenant,
    publishedUrl: draft.publishedProfile.url,
  };
}

export async function getOnboardingSummary(userId) {
  const draft = await ensureDraft(userId);
  return {
    draft,
    progress: draft.progress,
    currentStep: draft.currentStep,
    completedSteps: draft.completedSteps,
    skippedSteps: draft.skippedSteps,
    readyToPublish:
      draft.status === "ready_to_publish" || draft.progress >= 100,
    stepLabels,
  };
}
