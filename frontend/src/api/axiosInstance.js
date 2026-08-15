import axios from 'axios';
import { getAccessToken, setAccessToken, clearAccessToken } from './tokenService';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends the httpOnly refresh-token cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// A separate, interceptor-free client for the refresh call itself,
// so a failed refresh never triggers an infinite retry loop.
const rawClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

/**
 * Lets consumers (e.g. the auth slice) react whenever a session is
 * forcibly ended because the refresh token itself is invalid/expired.
 */
let onSessionExpired = () => {};
export const registerSessionExpiredHandler = (handler) => {
  onSessionExpired = handler;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    const isAuthEndpoint =
      config?.url?.includes('/auth/login') ||
      config?.url?.includes('/auth/register') ||
      config?.url?.includes('/auth/refresh-token');

    if (response?.status === 401 && !config._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Queue this request until the in-flight refresh completes
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((newToken) => {
            if (!newToken) return reject(error);
            config._retry = true;
            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosInstance(config));
          });
        });
      }

      config._retry = true;
      isRefreshing = true;

      try {
        const { data } = await rawClient.post('/auth/refresh-token');
        const newToken = data?.data?.accessToken;
        setAccessToken(newToken);
        isRefreshing = false;
        onRefreshed(newToken);
        config.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(config);
      } catch (refreshError) {
        isRefreshing = false;
        onRefreshed(null);
        clearAccessToken();
        onSessionExpired();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
