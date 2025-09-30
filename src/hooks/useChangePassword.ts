import { request } from '@green-world/utils/api';
import { NewPasswordValues } from '@green-world/utils/types';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useChangePassword = (): UseMutationResult<
  unknown,
  Error,
  NewPasswordValues
> => {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
      confirmNewPassword
    }: NewPasswordValues) =>
      request({
        url: `/auth/new-password`,
        method: 'put',
        data: { currentPassword, newPassword, confirmNewPassword }
      }),
    onSuccess: () => {
      toast('Uspešno ste promenili password!');
    },
    onError: (err: any) => {
      toast(`Došlo je do greške: ${err.message || 'Nepoznata greška'}`);
    }
  });
};
