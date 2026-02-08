import { request } from '@green-world/utils/api';
import { getItem, removeItem } from '@green-world/utils/cookie';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      const refreshToken = getItem('refreshToken');
      return request({
        url: `/auth/logout`,
        method: 'post',
        data: {
          refreshToken
        }
      });
    },
    onSuccess: () => {
      removeItem('token');
      removeItem('refreshToken');
      window.dispatchEvent(new CustomEvent('auth:logout'));
      navigate('/');
    },
    onError: () => {
      // Even if the backend fails (e.g. token already invalid), we should
      // still clean up the client state to prevent a "stuck" logged-in state.
      removeItem('token');
      removeItem('refreshToken');
      window.dispatchEvent(new CustomEvent('auth:logout'));
      navigate('/');
    }
  });
};
