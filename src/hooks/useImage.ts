import UserContext from '@green-world/context/UserContext';
import { request } from '@green-world/utils/api';
import { useMutation } from '@tanstack/react-query';
import { useContext } from 'react';

export const useImage = (isUserProfileImage?: boolean) => {
  const { user, setUser } = useContext(UserContext);

  return useMutation({
    mutationFn: (file: FormData) =>
      request({
        url: '/aws/upload/',
        method: 'post',
        data: file,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    onSuccess: (data: string) => {
      isUserProfileImage &&
        setUser({
          ...user,
          profileImage: data
        });
    }
  });
};
