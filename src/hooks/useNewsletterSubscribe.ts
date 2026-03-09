import { request } from '@green-world/utils/api';
import { useMutation } from '@tanstack/react-query';

export type NewsletterSubscribeRequest = {
  email: string;
};

export type NewsletterSubscribeResponse = {
  success: boolean;
  message?: string;
};

export const useNewsletterSubscribe = () => {
  return useMutation<
    NewsletterSubscribeResponse,
    Error,
    NewsletterSubscribeRequest
  >({
    mutationFn: ({ email }: NewsletterSubscribeRequest) =>
      request({
        url: '/newsletter/subscribe',
        method: 'post',
        data: { email }
      })
  });
};
