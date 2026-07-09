import api from './api';

export const dashboardApi = {
  summary: () => api.get('/dashboard/summary'),
  activity: () => api.get('/dashboard/activity'),
  leads: (page = 1, limit = 10) => api.get(`/dashboard/leads?page=${page}&limit=${limit}`),
  appointments: () => api.get('/dashboard/appointments'),
  notifications: () => api.get('/dashboard/notifications'),
  markRead: (id) => api.put(`/dashboard/notifications/${id}/read`, {})
};
