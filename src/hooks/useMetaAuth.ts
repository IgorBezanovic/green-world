import { request } from '@green-world/utils/api';
import { setItem } from '@green-world/utils/cookie';
import type { AuthResponse } from '@green-world/utils/types';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useMetaAuth = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({
      name,
      email,
      image
    }: {
      name: string;
      email: string;
      image: string;
    }) =>
      request({
        url: `/auth/meta`,
        method: 'post',
        data: {
          name,
          email,
          image
        }
      }),
    onSuccess: (data: AuthResponse) => {
      setItem('token', data.token);
      setItem('refreshToken', data.refreshToken);
      navigate('/');
    }
  });
};
