import axios from 'axios';

let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
if (baseUrl && !baseUrl.endsWith('/api/v1')) {
  baseUrl = baseUrl.replace(/\/$/, '') + '/api/v1';
}

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

let getAccessToken = () => null;
let setAccessToken = () => {};

export function bindAuthTokenAccessors(readToken, writeToken) {
  getAccessToken = readToken;
  setAccessToken = writeToken;
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

export function executeRefresh() {
  if (!refreshPromise) {
    const fallbackToken = localStorage.getItem("oneprofile_fallback_refresh_token");
    refreshPromise = api.post('/auth/refresh', { refreshToken: fallbackToken || undefined }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');
    
    const publicAuthRoutes = [
      '/auth/login',
      '/auth/register',
      '/auth/otp/request',
      '/auth/otp/verify',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/google',
    ];
    const isPublicAuthRoute = publicAuthRoutes.some(route => originalRequest?.url?.includes(route));

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest && !isPublicAuthRoute) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await executeRefresh();
        const newToken = refreshResponse.data?.data?.accessToken;
        const newRefreshToken = refreshResponse.data?.data?.refreshToken;
        if (newToken) {
          setAccessToken(newToken);
          if (newRefreshToken) {
            localStorage.setItem("oneprofile_fallback_refresh_token", newRefreshToken);
          }
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        setAccessToken(null);
        localStorage.removeItem("oneprofile_fallback_refresh_token");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
