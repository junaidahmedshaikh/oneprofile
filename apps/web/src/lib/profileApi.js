import api from './api';

export const profileApi = {
  me: () => api.get('/profiles/me'),
  save: (payload) => api.put('/profiles/me', payload),
  getPublic: (slug) => api.get(`/profiles/public/${slug}`)
};
