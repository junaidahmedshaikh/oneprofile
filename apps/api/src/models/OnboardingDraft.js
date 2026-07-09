import mongoose from 'mongoose';

const onboardingDraftSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', default: null, index: true },
    status: {
      type: String,
      enum: ['draft', 'in_progress', 'paused', 'ready_to_publish', 'published'],
      default: 'draft',
      index: true
    },
    currentStep: { type: String, default: 'industry' },
    completedSteps: [{ type: String, trim: true }],
    skippedSteps: [{ type: String, trim: true }],
    progress: { type: Number, default: 0 },
    industry: {
      key: { type: String, default: '' },
      label: { type: String, default: '' }
    },
    businessCategory: {
      key: { type: String, default: '' },
      label: { type: String, default: '' }
    },
    companyDetails: {
      companyName: { type: String, default: '' },
      legalName: { type: String, default: '' },
      website: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      city: { type: String, default: '' },
      country: { type: String, default: '' },
      tagline: { type: String, default: '' },
      description: { type: String, default: '' }
    },
    logo: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      provider: { type: String, default: 'cloudinary' }
    },
    theme: {
      key: { type: String, default: 'aurora' },
      name: { type: String, default: 'Aurora' },
      primary: { type: String, default: '#4F8CFF' },
      accent: { type: String, default: '#22D3EE' },
      mode: { type: String, enum: ['light', 'dark'], default: 'dark' }
    },
    aiContent: {
      headline: { type: String, default: '' },
      summary: { type: String, default: '' },
      benefits: [{ type: String, trim: true }],
      ctaLabel: { type: String, default: '' }
    },
    publishedProfile: {
      slug: { type: String, default: '' },
      url: { type: String, default: '' },
      publishedAt: { type: Date, default: null }
    },
    autoSaveMeta: {
      lastSavedAt: { type: Date, default: null },
      resumeCount: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export const OnboardingDraft = mongoose.model('OnboardingDraft', onboardingDraftSchema);
