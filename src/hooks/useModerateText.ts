import { request } from '@green-world/utils/api';
import { useMutation } from '@tanstack/react-query';

type ModerateTextPayload = {
  fields: {
    title: string;
    description: string;
    shortDescription: string;
  };
};

export type ModerateTextResponse = {
  flaggedFields?: string[];
};

export const useModerateText = () => {
  return useMutation<ModerateTextResponse, Error, ModerateTextPayload>({
    mutationFn: (data) =>
      request({
        url: '/ai/moderate-text',
        method: 'post',
        data
      })
  });
};
