import { useSuccess } from '@green-world/context/PopupContext';
import { request } from '@green-world/utils/api';
import { setItem } from '@green-world/utils/cookie';
import { RegistrationValues } from '@green-world/utils/types';
import { useMutation } from 'react-query';

export const useSignUp = () => {
  const { setIsOpen } = useSuccess();

  return useMutation(
    ({ email, password }: RegistrationValues) =>
      request({
        url: `/auth/sign-up`,
        method: 'post',
        data: {
          email,
          password
        }
      }),
    {
      onSuccess: (data: string) => {
        setItem('token', data);
        setIsOpen(true);
      }
    }
  );
};
