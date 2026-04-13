import { request } from '@green-world/utils/api';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

export type ImageAutofillResponse = {
  title?: string;
  shortDescription?: string;
  group?: string;
  subGroup?: string;
  keywords?: string[];
};

type ImageAutofillPayload = {
  imageUrl: string;
  allowedGroups: Record<string, string[]>;
};

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (isAxiosError(error)) {
    const responseData = error.response?.data;

    if (
      responseData &&
      typeof responseData === 'object' &&
      'error' in responseData &&
      typeof responseData.error === 'string'
    ) {
      return responseData.error;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

export const useImageAutofill = (fallbackMessage: string) => {
  return useMutation<ImageAutofillResponse, Error, ImageAutofillPayload>({
    mutationFn: async (data) => {
      try {
        return await request({
          url: '/ai/image-autofill',
          method: 'post',
          data
        });
      } catch (error) {
        throw new Error(getErrorMessage(error, fallbackMessage));
      }
    }
  });
};
