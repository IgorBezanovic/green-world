import UserContext from '@green-world/context/UserContext';
import { request } from '@green-world/utils/api';
import { useContext } from 'react';
import { useMutation } from 'react-query';

export const useImage = (isUserProfileImage?: boolean) => {
  const { user, setUser } = useContext(UserContext);

  return useMutation(
    (file: FormData) =>
      request({
        url: '/storage/upload/',
        method: 'post',
        data: file,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    {
      onSuccess: (data: string) => {
        isUserProfileImage &&
          setUser({
            ...user,
            profileImage: data
          });
      }
    }
  );
};
