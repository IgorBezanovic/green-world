import { request } from '@green-world/utils/api';
import { ContactUsValues } from '@green-world/utils/types';
import { useMutation } from 'react-query';

export const useContactUs = () => {
  return useMutation(({ subject, email, message }: ContactUsValues) =>
    request({
      url: `/contact-us`,
      method: 'post',
      data: {
        subject,
        email,
        message
      }
    })
  );
};
