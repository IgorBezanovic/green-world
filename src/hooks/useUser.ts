import { useAuth } from '@green-world/context/AuthContext';
import { request } from '@green-world/utils/api';
import { useQuery } from 'react-query';

export const useUser = () => {
  const { userId } = useAuth();

  return useQuery(['userDetails', userId], () =>
    request({
      url: `/user/details/${userId}`,
      method: 'get'
    })
  );
};
