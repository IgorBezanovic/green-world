import { request } from '@green-world/utils/api';
import { useQuery } from '@tanstack/react-query';

export const useAllUsers = () => {
  return useQuery({
    queryKey: ['allUsers'],
    queryFn: () =>
      request({
        url: '/user/all-users',
        method: 'get'
      })
  });
};
