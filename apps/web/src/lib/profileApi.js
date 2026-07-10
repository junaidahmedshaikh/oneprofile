import api from './api';

export const profileApi = {
  me: () => api.get('/profiles/me'),
  save: (payload) => api.put('/profiles/me', payload),
  getPublic: (slug) => api.get(`/profiles/public/${slug}`),
  uploadAvatar: (payload) => api.post('/profiles/me/upload-avatar', payload),
  uploadCover: (payload) => api.post('/profiles/me/upload-cover', payload)
};
