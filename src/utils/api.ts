import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';

import { getItem } from './cookie';

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

client.interceptors.request.use(
  (config) => {
    const token = getItem('token');

    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },

  (error: AxiosError) => {
    return Promise.reject(error);
  }
);
