import i18n from '@green-world/i18n';
import { request } from '@green-world/utils/api';
import { getItem } from '@green-world/utils/cookie';
import { safeDecodeToken } from '@green-world/utils/helpers';
import { DecodedToken, User } from '@green-world/utils/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useEditUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
      name,
      lastname,
      coverImage,
      profileImage,
      shopName,
      phone,
      address,
      shopDescription,
      website,
      onlyOnline,
      onlyOnThisSite,
      socialMedia,
      workingTime
    }: User) =>
      request({
        url: `/user`,
        method: 'put',
        data: {
          email,
          name,
          lastname,
          coverImage,
          profileImage,
          shopName,
          phone,
          address,
          shopDescription,
          website,
          onlyOnline,
          onlyOnThisSite,
          socialMedia,
          workingTime
        }
      }),
    onSuccess: async () => {
      const localStorageToken = getItem('token');
      const token = safeDecodeToken<DecodedToken>(localStorageToken);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['userDetails', token?._id]
        }),
        queryClient.invalidateQueries({ queryKey: ['allUsers'] })
      ]);
      toast.success(i18n.t('hooks.common.dataUpdated'));
    }
  });
};
