import { request } from '@green-world/utils/api';
import { useQuery } from 'react-query';

export const useUserMessage = () => {
  return useQuery('userMessages', () =>
    request({
      url: '/message', // API endpoint na backend-u
      method: 'get',
    })
  );
};
