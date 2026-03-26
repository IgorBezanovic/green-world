import { request } from '@green-world/utils/api';
import {
  PaginatedResponse,
  User,
  UsersListFiltersParams
} from '@green-world/utils/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useAllUsers = (
  filters?: UsersListFiltersParams
): UseQueryResult<PaginatedResponse<User>> => {
  return useQuery({
    queryKey: ['allUsers', filters],
    queryFn: () =>
      request({
        url: '/user/all-users',
        method: 'get',
        params: filters
      })
  });
};
