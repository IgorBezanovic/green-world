import { request } from '@green-world/utils/api';
import { setItem } from '@green-world/utils/cookie';
import { isLikelyJwt } from '@green-world/utils/helpers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

type GoogleAuthResponse =
  | string
  | {
      token?: string;
    };

export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credential: string) =>
      request({
        url: '/auth/google',
        method: 'post',
        data: { credential }
      }) as Promise<GoogleAuthResponse>,
    onSuccess: (data) => {
      const token = typeof data === 'string' ? data : data?.token;

      if (!isLikelyJwt(token)) {
        toast.error('Neispravan odgovor servera za Google prijavu.');
        return;
      }

      setItem('token', token);
      queryClient.invalidateQueries({ queryKey: ['userDetails'] });
      queryClient.invalidateQueries({ queryKey: ['allUserProducts'] });
      queryClient.invalidateQueries({ queryKey: ['allUserEvents'] });
      navigate('/');
    },
    onError: (err: any) => {
      const msg = err?.response?.data || 'Greška pri loginu.';
      toast.error(msg);
    }
  });
};
