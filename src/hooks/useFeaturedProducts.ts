import { request } from '@green-world/utils/api';
import { useQuery } from '@tanstack/react-query';

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['promoted-products'],
    queryFn: () =>
      request({
        url: '/product/promoted-products',
        method: 'get'
      })
  });
};
