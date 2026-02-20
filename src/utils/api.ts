import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

import { getItem, removeItem } from './cookie';
import type { DecodedToken } from './types';

export const client = axios.create({
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
  window.dispatchEvent(new CustomEvent('auth:logout'));
  toast.info('Login sesija Vam je istekla');

  if (window.location.pathname !== '/') {
    window.location.assign('/');
  }
};

client.interceptors.request.use(
  (config) => {
    const token = getItem('token');
    const isValid = isTokenValid(token);
    const isExpired = Boolean(token) && !isValid;

    if (token) {
      if (isExpired) {
        handleSessionExpired();
        return config;
      }
      config.headers['Authorization'] = token;
    }
    return config;
  },

  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      handleSessionExpired();
    }
    return Promise.reject(error);
  }
);
