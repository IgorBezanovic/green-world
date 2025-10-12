import { request } from '@green-world/utils/api';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { ProductPreview } from './useHomeProducts';

export type ProductsResponse = {
  currentPage: number;
  pages: number;
  products: ProductPreview[];
  totalProducts: number;
  priceLimits: [number, number];
};

export type ProductFiltersParams = {
  title?: string;
  group?: string;
  subGroup?: string;
  minPrice?: number;
  maxPrice?: number;
  priceOnRequest?: boolean;
  inStock?: boolean;
  page?: number;
};

export const useAllProducts = (
  filters: ProductFiltersParams
): UseQueryResult<ProductsResponse> => {
  return useQuery<ProductsResponse>({
    queryKey: ['allProducts', filters],
    queryFn: () =>
      request({
        url: '/product/all',
        method: 'get',
        params: filters
      }),
    staleTime: 1000 * 30
  });
};
