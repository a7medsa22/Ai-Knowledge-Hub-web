import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
class RefreshTokenResponse {
  success: boolean;
  data?: { accessToken: string; refreshToken: string };
}
const api: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  paramsSerializer: {
    indexes: null // serialize arrays as tags=val1&tags=val2
  }
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      // Don't redirect if we're already on login or signup pages
      const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/signup';

      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken && !isAuthPage) {
        try {
          // Use axios.post to avoid hitting the interceptor with the refresh request
          const refreshResponse = await axios.post(
            `/api/v1/users/auth/refresh`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const { success, data } = refreshResponse.data;

          if (!success || !data) {
            throw new Error('Unable to refresh token');
          }

          const { accessToken, refreshToken: newRefreshToken } = data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry the original request
          const originalRequest = error.config!;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clean up and redirect
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('auth_user');
          if (!isAuthPage) {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      } else if (!isAuthPage) {
        // No refresh token and not on auth page, redirect
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
