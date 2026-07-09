import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  draft: null,
  activeStep: 'industry',
  completedSteps: [],
  skippedSteps: [],
  progress: 0,
  saving: false,
  error: null,
  lastSavedAt: null,
  readyToPublish: false
};

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    hydrateOnboarding(state, action) {
      const payload = action.payload || {};
      state.draft = payload.draft || null;
      state.activeStep = payload.currentStep || payload.draft?.currentStep || 'industry';
      state.completedSteps = payload.completedSteps || payload.draft?.completedSteps || [];
      state.skippedSteps = payload.skippedSteps || payload.draft?.skippedSteps || [];
      state.progress = payload.progress ?? payload.draft?.progress ?? 0;
      state.readyToPublish = Boolean(payload.readyToPublish);
      state.lastSavedAt = payload.draft?.autoSaveMeta?.lastSavedAt || null;
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
    }
  }
});

export const { hydrateOnboarding, setActiveStep, setSaving, setOnboardingError, resetOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;
