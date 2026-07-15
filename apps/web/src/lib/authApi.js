import api, { executeRefresh } from './api';

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  requestOtpLogin: (payload) => api.post('/auth/otp/request', payload),
  verifyOtpLogin: (payload) => api.post('/auth/otp/verify', payload),
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload),
  resetPassword: (payload) => api.post('/auth/reset-password', payload),
  verifyEmailRequest: (payload) => api.post('/auth/verify-email/request', payload),
  verifyEmailConfirm: (payload) => api.post('/auth/verify-email/confirm', payload),
  verifyPhoneRequest: (payload) => api.post('/auth/verify-phone/request', payload),
  verifyPhoneConfirm: (payload) => api.post('/auth/verify-phone/confirm', payload),
  refresh: () => executeRefresh(),
  logout: () => api.post('/auth/logout', {}),
  me: () => api.get('/auth/me'),
  sessions: () => api.get('/auth/sessions'),
  logoutAll: () => api.post('/auth/logout-all', {}),
  googleStart: () => api.get('/auth/google'),
  googleCallback: (payload) => api.post('/auth/google/callback', payload),
  
  // New Email OTP Endpoints
  verifyRegistrationConfirm: (payload) => api.post('/auth/verify-registration/confirm', payload),
  verifyRegistrationResend: (payload) => api.post('/auth/verify-registration/resend', payload),
  forgotPasswordRequest: (payload) => api.post('/auth/forgot-password/request', payload),
  forgotPasswordVerify: (payload) => api.post('/auth/forgot-password/verify', payload),
  changeEmailRequest: (payload) => api.post('/auth/change-email/request', payload),
  changeEmailConfirm: (payload) => api.post('/auth/change-email/confirm', payload)
};
