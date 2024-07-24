import { request } from '@green-world/utils/api';
import { NewPasswordValues } from '@green-world/utils/types';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

export const useChangePassword = () => {
  return useMutation(
    ({ currentPassword, newPassword, confirmNewPassword }: NewPasswordValues) =>
      request({
        url: `/auth/new-password`,
        method: 'put',
        data: {
          currentPassword,
          newPassword,
          confirmNewPassword
        }
      }),
    {
      onSuccess: () => {
        toast('Uspesno ste promenili paswword!');
      }
    }
  );
};
