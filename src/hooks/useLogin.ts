import { request } from '@green-world/utils/api';
import { setItem } from '@green-world/utils/cookie';
import { AuthValues } from '@green-world/utils/types';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation(
    ({ email, password }: AuthValues) =>
      request({
        url: `/auth/login`,
        method: 'post',
        data: {
          email,
          password
        }
      }),
    {
      onSuccess: (data: string) => {
        setItem('token', data);
        navigate('/');
      }
    }
  );
};
