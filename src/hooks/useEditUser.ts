import UserContext from '@green-world/context/UserContext';
import i18n from '@green-world/i18n';
import { request } from '@green-world/utils/api';
import { User } from '@green-world/utils/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { toast } from 'react-toastify';

export const useEditUser = () => {
  const queryClient = useQueryClient();
  const { userId } = useContext(UserContext);

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
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['userDetails', userId]
        }),
        queryClient.invalidateQueries({ queryKey: ['allUsers'] })
      ]);
      toast.success(i18n.t('hooks.common.dataUpdated'));
    }
  });
};
