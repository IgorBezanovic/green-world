import { request } from '@green-world/utils/api';
import { useQuery } from 'react-query';

export const useAllUsers = () => {
  return useQuery('allUsers', () =>
    request({
      url: '/user/all-users',
      method: 'get'
    })
  );
};
