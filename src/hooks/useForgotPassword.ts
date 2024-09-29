import { request } from '@green-world/utils/api';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

export const useForgotPassword = () => {
  const navigate = useNavigate();

  return useMutation(
    (email: string) =>
      request({
        url: `/auth/forgot-password`,
        method: 'post',
        data: {
          email
        }
      }),
    {
      onSuccess: (data) => {
        console.log(data);
        navigate('/login');
      }
    }
  );
};
