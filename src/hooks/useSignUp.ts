import { useSuccess } from '@green-world/context/PopupContext';
import { request } from '@green-world/utils/api';
import { setItem } from '@green-world/utils/cookie';
import { AuthResponse, RegistrationValues } from '@green-world/utils/types';
import { useMutation } from '@tanstack/react-query';

export const useSignUp = () => {
  const { setIsOpen } = useSuccess();

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
    onSuccess: (data: AuthResponse) => {
      setItem('token', data.token);
      setItem('refreshToken', data.refreshToken);
      setIsOpen(true);
    }
  });
};
