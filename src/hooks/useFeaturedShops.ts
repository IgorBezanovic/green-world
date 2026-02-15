import { request } from '@green-world/utils/api';
import { useQuery } from '@tanstack/react-query';

export const useFeaturedShops = () => {
  return useQuery({
    queryKey: ['promoted-shops'],
    queryFn: () =>
      request({
        url: '/user/promoted-shops',
        method: 'get'
      })
  });
};
