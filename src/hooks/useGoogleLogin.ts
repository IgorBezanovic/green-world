import { request } from '@green-world/utils/api';
import { setItem } from '@green-world/utils/cookie';
import { isLikelyJwt, safeDecodeToken } from '@green-world/utils/helpers';
import { DecodedToken } from '@green-world/utils/types';
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
    onSuccess: async (data) => {
      const token = typeof data === 'string' ? data : data?.token;

      if (!isLikelyJwt(token)) {
        toast.error('Neispravan odgovor servera za Google prijavu.');
        return;
      }

      setItem('token', token);
      const decoded = safeDecodeToken<DecodedToken>(token);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['userDetails', decoded?._id]
        }),
        queryClient.invalidateQueries({ queryKey: ['allUserProducts'] }),
        queryClient.invalidateQueries({ queryKey: ['allUserEvents'] }),
        queryClient.invalidateQueries({ queryKey: ['blogPostsByUser'] })
      ]);
      navigate('/');
    },
    onError: (err: any) => {
      const msg = err?.response?.data || 'Greška pri loginu.';
      toast.error(msg);
    }
  });
};
