import { request } from '@green-world/utils/api';
import { Product, ProductFiltersParams } from '@green-world/utils/types';
import { useQuery, UseQueryResult } from 'react-query';

type AllProducts = {
  currentPage: number;
  pages: number;
  products: Product[];
  totalProducts: number;
};

export const useAllProducts = (
  filters?: ProductFiltersParams
): UseQueryResult<AllProducts | undefined> => {
  return useQuery(['allProducts', filters], () =>
    request({
      url: '/product/all',
      method: 'get',
      params: filters
    })
  );
};
