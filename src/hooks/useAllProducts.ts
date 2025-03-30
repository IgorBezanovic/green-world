import { request } from '@green-world/utils/api';
import { ProductFiltersParams } from '@green-world/utils/types';
import { useQuery } from 'react-query';

export const useAllProducts = (filters?: ProductFiltersParams) => {
  return useQuery(['allProducts', filters], () =>
    request({
      url: '/product/all',
      method: 'get',
      params: filters
    })
  );
};
