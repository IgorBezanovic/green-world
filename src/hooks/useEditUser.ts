import { request } from '@green-world/utils/api';
import { User } from '@green-world/utils/types';
import { useMutation } from '@tanstack/react-query';

export const useEditUser = () => {
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
      onlyOnThisSite
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
          onlyOnThisSite
        }
      }),
    onSuccess: () => {
      // navigate('/profile');
    }
  });
};
