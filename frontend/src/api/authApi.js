import axiosInstance from './axiosInstance';

export const authApi = {
  register: (payload) => axiosInstance.post('/auth/register', payload),
  login: (payload) => axiosInstance.post('/auth/login', payload),
  logout: () => axiosInstance.post('/auth/logout'),
  refreshToken: () => axiosInstance.post('/auth/refresh-token'),
  getMe: () => axiosInstance.get('/auth/me'),
  verifyEmail: (token) => axiosInstance.get(`/auth/verify-email/${token}`),
  resendVerification: (email) => axiosInstance.post('/auth/resend-verification', { email }),
  forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => axiosInstance.patch(`/auth/reset-password/${token}`, { password }),
};

export default authApi;
