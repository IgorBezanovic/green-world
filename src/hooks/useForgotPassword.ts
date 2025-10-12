import { request } from '@green-world/utils/api';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useForgotPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (email: string) =>
      request({
        url: `/auth/forgot-password`,
        method: 'post',
        data: {
          email
        }
      }),
    onSuccess: () => {
      navigate('/login');
    }
  });
};
