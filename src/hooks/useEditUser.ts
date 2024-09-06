import { request } from '@green-world/utils/api';
import { User } from '@green-world/utils/types';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

export const useEditUser = () => {
  const navigate = useNavigate();

  return useMutation(
    ({
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
    {
      onSuccess: () => {
        navigate('/profile');
      }
    }
  );
};
