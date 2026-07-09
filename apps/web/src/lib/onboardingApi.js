import api from './api';

export const onboardingApi = {
  lookups: () => api.get('/onboarding/lookups'),
  me: () => api.get('/onboarding/me'),
  save: (payload) => api.put('/onboarding/me', payload),
  completeStep: (payload) => api.post('/onboarding/step', payload),
  skipStep: (payload) => api.post('/onboarding/skip', payload),
  uploadLogo: (payload) => api.post('/onboarding/logo', payload),
  generateContent: () => api.post('/onboarding/content/ai', {}),
  resumeLater: (payload = {}) => api.post('/onboarding/resume-later', payload),
  publish: () => api.post('/onboarding/publish', {})
};
