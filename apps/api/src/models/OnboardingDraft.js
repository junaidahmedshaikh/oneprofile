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
    profileType: { type: String, enum: ['business', 'professional'], default: 'business' },
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
    professionalCategory: {
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
      description: { type: String, default: '' },
      gstNumber: { type: String, default: '' },
      registrationDetails: { type: String, default: '' },
      serviceArea: { type: String, default: '' },
      foundedYear: { type: Number, default: null },
      teamSize: { type: Number, default: null }
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
    },

    // Expanded Professional fields for onboarding draft state
    personalDetails: {
      title: { type: String, default: '' },
      bio: { type: String, default: '' },
      avatarUrl: { type: String, default: '' },
      coverImageUrl: { type: String, default: '' },
      languages: [{ type: String }],
      skills: [{ type: String }],
      certifications: [{ type: String }],
      employmentType: { type: String, enum: ['self_employed', 'employed'], default: 'self_employed' },
      designation: { type: String, default: '' },
      yearsOfExperience: { type: Number, default: null },
      practiceName: { type: String, default: '' },
      department: { type: String, default: '' },
      workLocation: { type: String, default: '' }
    },
    socialLinks: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      github: { type: String, default: '' },
      website: { type: String, default: '' },
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      youtube: { type: String, default: '' },
      customLinks: [{ title: { type: String }, url: { type: String } }]
    },
    experience: { type: Array, default: [] },
    contactDetails: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      whatsAppNumber: { type: String, default: '' },
      address: { type: String, default: '' },
      mapsEmbedUrl: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

export const OnboardingDraft = mongoose.model('OnboardingDraft', onboardingDraftSchema);
