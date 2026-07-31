import { request } from '@green-world/utils/api';
import { setItem } from '@green-world/utils/cookie';
import { safeDecodeToken } from '@green-world/utils/helpers';
import { DecodedToken } from '@green-world/utils/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

type MetaAuthResponse = {
  token: string;
  requiresPhoneSetup?: boolean;
};

export const useMetaAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
    onSuccess: async (data: MetaAuthResponse) => {
      setItem('token', data.token);
      const token = safeDecodeToken<DecodedToken>(data.token);
      window.dispatchEvent(new Event('auth:login'));
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['userDetails', token?._id]
        }),
        queryClient.invalidateQueries({ queryKey: ['allUserProducts'] }),
        queryClient.invalidateQueries({ queryKey: ['allUserEvents'] }),
        queryClient.invalidateQueries({ queryKey: ['blogPostsByUser'] })
      ]);
      navigate(data.requiresPhoneSetup ? '/complete-registration' : '/');
    }
  });
};
