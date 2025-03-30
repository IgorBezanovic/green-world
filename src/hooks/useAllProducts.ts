import { request } from '@green-world/utils/api';
import { useQuery } from 'react-query';

export const useAllProducts = (filters?: any) => {
  return useQuery(['allProducts', filters], () =>
    request({
      url: '/product/all',
      method: 'get',
      params: filters
    })
  );
};
