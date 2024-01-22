import axios from 'axios';
import type { AxiosResponse, AxiosError } from 'axios';

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const request = async <T>({ ...options }) => {
  const onSuccess = (response: AxiosResponse<T>) => response.data;
  const onError = (error: AxiosError) => {
    throw error;
  };

  return client(options).then(onSuccess).catch(onError);
};
