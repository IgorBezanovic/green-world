import i18n from '@green-world/i18n';
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
      toast.success(i18n.t('hooks.changePassword.success'));
    },
    onError: (err: any) => {
      toast.error(
        i18n.t('hooks.changePassword.error', {
          message: err?.message || i18n.t('hooks.changePassword.unknownError')
        })
      );
    }
  });
};
