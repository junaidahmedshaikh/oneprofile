import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profileType: 'business',
  industry: null,
  businessCategory: null,
  professionalCategory: null,
  companyDetails: {
    companyName: '',
    legalName: '',
    website: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    tagline: '',
    description: '',
    gstNumber: '',
    registrationDetails: '',
    serviceArea: '',
    foundedYear: null,
    teamSize: null,
  },
  personalDetails: {
    title: '',
    bio: '',
    avatarUrl: '',
    coverImageUrl: '',
    languagesRaw: '',
    skillsRaw: '',
    certificationsRaw: '',
    designation: '',
    yearsOfExperience: '',
    practiceName: '',
    department: '',
    workLocation: '',
    industry: '',
  },
  socialLinks: {
    linkedin: '',
    twitter: '',
    github: '',
    website: '',
    instagram: '',
    facebook: '',
    youtube: '',
    customLinks: [],
  },
  contactDetails: {
    email: '',
    phone: '',
    whatsAppNumber: '',
    address: '',
    mapsEmbedUrl: '',
  },
  theme: {
    key: 'aurora',
    name: 'Aurora',
    primary: '#4F8CFF',
    accent: '#22D3EE',
    mode: 'dark',
  },
  aiContent: {
    headline: '',
    summary: '',
    ctaLabel: '',
  },
  experience: [],
  activeStep: 'industry',
  completedSteps: [],
  skippedSteps: [],
  progress: 0,
  saving: false,
  error: null,
  lastSavedAt: null,
  readyToPublish: false,
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setProfileType(state, action) {
      state.profileType = action.payload;
    },
    setIndustry(state, action) {
      state.industry = action.payload;
    },
    setBusinessCategory(state, action) {
      state.businessCategory = action.payload;
    },
    setProfessionalCategory(state, action) {
      state.professionalCategory = action.payload;
    },
    updateCompanyDetails(state, action) {
      state.companyDetails = { ...state.companyDetails, ...action.payload };
    },
    updatePersonalDetails(state, action) {
      state.personalDetails = { ...state.personalDetails, ...action.payload };
    },
    updateSocialLinks(state, action) {
      state.socialLinks = { ...state.socialLinks, ...action.payload };
    },
    updateContactDetails(state, action) {
      state.contactDetails = { ...state.contactDetails, ...action.payload };
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
    setAiContent(state, action) {
      state.aiContent = { ...state.aiContent, ...action.payload };
    },
    setExperience(state, action) {
      state.experience = action.payload;
    },
    updateOnboardingData(state, action) {
      const {
        profileType,
        industry,
        businessCategory,
        professionalCategory,
        companyDetails,
        personalDetails,
        socialLinks,
        contactDetails,
        theme,
        aiContent,
        experience,
        completedSteps,
        skippedSteps,
      } = action.payload || {};

      if (profileType) state.profileType = profileType;
      if (industry !== undefined) state.industry = industry;
      if (businessCategory !== undefined) state.businessCategory = businessCategory;
      if (professionalCategory !== undefined) state.professionalCategory = professionalCategory;
      if (companyDetails) state.companyDetails = { ...state.companyDetails, ...companyDetails };
      if (personalDetails) state.personalDetails = { ...state.personalDetails, ...personalDetails };
      if (socialLinks) state.socialLinks = { ...state.socialLinks, ...socialLinks };
      if (contactDetails) state.contactDetails = { ...state.contactDetails, ...contactDetails };
      if (theme) state.theme = theme;
      if (aiContent) state.aiContent = { ...state.aiContent, ...aiContent };
      if (experience) state.experience = experience;
      if (completedSteps) state.completedSteps = completedSteps;
      if (skippedSteps) state.skippedSteps = skippedSteps;
    },
    hydrateOnboarding(state, action) {
      const payload = action.payload || {};
      const draft = payload.draft || payload;

      if (draft) {
        state.profileType = draft.profileType || 'business';
        state.industry = draft.industry || null;
        state.businessCategory = draft.businessCategory || null;
        state.professionalCategory = draft.professionalCategory || null;
        if (draft.companyDetails) state.companyDetails = { ...state.companyDetails, ...draft.companyDetails };
        if (draft.personalDetails) state.personalDetails = { ...state.personalDetails, ...draft.personalDetails };
        if (draft.socialLinks) state.socialLinks = { ...state.socialLinks, ...draft.socialLinks };
        if (draft.contactDetails) state.contactDetails = { ...state.contactDetails, ...draft.contactDetails };
        if (draft.theme) state.theme = draft.theme;
        if (draft.aiContent) state.aiContent = { ...state.aiContent, ...draft.aiContent };
        if (draft.experience) state.experience = draft.experience;
      }

      state.activeStep = payload.currentStep || draft?.currentStep || 'industry';
      state.completedSteps = payload.completedSteps || draft?.completedSteps || [];
      state.skippedSteps = payload.skippedSteps || draft?.skippedSteps || [];
      state.progress = payload.progress ?? draft?.progress ?? 0;
      state.readyToPublish = Boolean(payload.readyToPublish);
      state.lastSavedAt = draft?.autoSaveMeta?.lastSavedAt || null;
      state.error = null;
    },
    setActiveStep(state, action) {
      state.activeStep = action.payload;
    },
    setSaving(state, action) {
      state.saving = action.payload;
    },
    setOnboardingError(state, action) {
      state.error = action.payload;
    },
    resetOnboarding(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setProfileType,
  setIndustry,
  setBusinessCategory,
  setProfessionalCategory,
  updateCompanyDetails,
  updatePersonalDetails,
  updateSocialLinks,
  updateContactDetails,
  setTheme,
  setAiContent,
  setExperience,
  updateOnboardingData,
  hydrateOnboarding,
  setActiveStep,
  setSaving,
  setOnboardingError,
  resetOnboarding,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
