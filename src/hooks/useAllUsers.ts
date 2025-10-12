import { request } from '@green-world/utils/api';
import { User } from '@green-world/utils/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useAllUsers = (): UseQueryResult<User[]> => {
  return useQuery({
    queryKey: ['allUsers'],
    queryFn: () =>
      request({
        url: '/user/all-users',
        method: 'get'
      })
  });
};
