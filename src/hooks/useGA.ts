import { request } from '@green-world/utils/api';
import { useQuery } from '@tanstack/react-query';

export const useGA = () => {
  return useQuery({
    queryKey: ['googleAnalytics'],
    queryFn: () =>
      request({
        url: 'analytics/google',
        method: 'get'
      })
  });
};
