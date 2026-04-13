import { request } from '@green-world/utils/api';
import { Product } from '@green-world/utils/types';
import { useMutation } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

export type GenerateAiDescriptionPayload = {
  title: string;
  keywords: string[];
  images: string[];
  context: { group: Product['group']; subGroup: string };
};

type GenerateAiDescriptionResponse = {
  descriptionHtml: string;
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

export const useGenerateAiDescription = (fallbackMessage: string) => {
  return useMutation<
    GenerateAiDescriptionResponse,
    Error,
    GenerateAiDescriptionPayload
  >({
    mutationFn: async (data) => {
      try {
        return await request({
          url: '/ai/description',
          method: 'post',
          data
        });
      } catch (error) {
        throw new Error(getErrorMessage(error, fallbackMessage));
      }
    }
  });
};
