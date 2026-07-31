import UserContext from '@green-world/context/UserContext';
import i18n from '@green-world/i18n';
import { request } from '@green-world/utils/api';
import { User } from '@green-world/utils/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useContext } from 'react';

export const getUpdateErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) return i18n.t('editUserData.updateError');

  const data = error.response?.data;
  if (typeof data === 'string' && data.trim()) {
    if (data === 'Invalid data provided.') {
      return i18n.t('editUserData.invalidProfileData');
    }
    if (data === 'User not found.') {
      return i18n.t('editUserData.userNotFound');
    }
    return data;
  }
  if (data && typeof data === 'object') {
    const payload = data as { message?: unknown; errors?: unknown };
    if (typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message;
    }
    if (Array.isArray(payload.errors)) {
      const messages = payload.errors.filter(
        (item): item is string => typeof item === 'string'
      );
      if (messages.length) return messages.join(' ');
    }
  }

  return i18n.t('editUserData.updateError');
};

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
    }
  });
};
