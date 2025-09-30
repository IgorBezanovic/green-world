import { request } from '@green-world/utils/api';
import { ContactUsValues } from '@green-world/utils/types';
import { useMutation } from '@tanstack/react-query';

export const useContactUs = () => {
  return useMutation({
    mutationFn: ({ subject, email, message }: ContactUsValues) =>
      request({
        url: `/user/contact-us`,
        method: 'post',
        data: {
          subject,
          email,
          message
        }
      })
  });
};
