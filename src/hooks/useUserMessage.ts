import { request } from '@green-world/utils/api';
import { getItem } from '@green-world/utils/cookie';
import { useQuery } from 'react-query';

export const useUserMessage = () => {
  const token = getItem('token');

  return useQuery(
    ['userMessages'],
    () =>
      request({
        url: '/message',
        method: 'get'
      }),
    {
      enabled: !!token,
      refetchOnWindowFocus: false,
      retry: false
    }
  );
};
