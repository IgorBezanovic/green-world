import { useSuccess } from '@green-world/context/PopupContext';
import { request } from '@green-world/utils/api';
import { setItem } from '@green-world/utils/cookie';
import { safeDecodeToken } from '@green-world/utils/helpers';
import { DecodedToken, RegistrationValues } from '@green-world/utils/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useSignUp = () => {
  const { setIsOpen } = useSuccess();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: RegistrationValues) =>
      request({
        url: `/auth/sign-up`,
        method: 'post',
        data: {
          email,
          password
        }
      }),
    onSuccess: async (data: string) => {
      setItem('token', data);
      const token = safeDecodeToken<DecodedToken>(data);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['userDetails', token?._id]
        }),
        queryClient.invalidateQueries({ queryKey: ['allUserProducts'] }),
        queryClient.invalidateQueries({ queryKey: ['allUserEvents'] }),
        queryClient.invalidateQueries({ queryKey: ['blogPostsByUser'] })
      ]);
      setIsOpen(true);
    }
  });
};
