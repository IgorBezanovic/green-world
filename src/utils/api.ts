import axios from 'axios';
import type { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

import { getItem, removeItem, setItem } from './cookie';
import type { DecodedToken } from './types';

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const request = async ({ ...options }) => {
  const onSuccess = (response: AxiosResponse) => response.data;
  const onError = (error: AxiosError) => {
    throw error;
  };

  return client(options).then(onSuccess).catch(onError);
};

const isTokenValid = (token?: string) => {
  if (!token) return false;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!decoded?.exp) return true;
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

let didNotifySessionExpired = false;

const handleSessionExpired = () => {
  if (didNotifySessionExpired) return;
  didNotifySessionExpired = true;

  removeItem('token');
  removeItem('refreshToken');
  window.dispatchEvent(new CustomEvent('auth:logout'));
  toast.info('Login sesija Vam je istekla');

  if (window.location.pathname !== '/') {
    window.location.assign('/');
  }
};

export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getItem('refreshToken');
  if (!refreshToken) return null;

  try {
    const response = await refreshClient.post('/auth/refresh-token', {
      refreshToken
    });
    const { token, refreshToken: newRefreshToken } = response.data || {};
    if (!token || !newRefreshToken) return null;

    setItem('token', token);
    setItem('refreshToken', newRefreshToken);
    return token;
  } catch {
    return null;
  }
};

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });

  failedQueue = [];
};

client.interceptors.request.use(
  async (config) => {
    const token = getItem('token');
    const isValid = isTokenValid(token);
    const isExpired = Boolean(token) && !isValid;

    if (!token) return config;

    if (isExpired) {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        handleSessionExpired();
        return config;
      }
      config.headers = config.headers ?? {};
      config.headers['Authorization'] = newToken;
      return config;
    }

    config.headers = config.headers ?? {};
    config.headers['Authorization'] = token;
    return config;
  },

  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if ((status === 401 || status === 403) && !originalRequest?._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = token;
            }
            return client(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = newToken;
          }
          processQueue(null, newToken);
          return client(originalRequest);
        }

        handleSessionExpired();
        processQueue(new Error('Failed to refresh token'));
        return Promise.reject(error);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        handleSessionExpired();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
