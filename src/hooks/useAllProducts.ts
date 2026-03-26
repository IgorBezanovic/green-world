import { request } from '@green-world/utils/api';
import { PaginatedResponse } from '@green-world/utils/types';
import {
  keepPreviousData,
  useQuery,
  UseQueryResult
} from '@tanstack/react-query';

import { ProductPreview } from './useHomeProducts';

export type ProductsResponse = PaginatedResponse<ProductPreview> & {
  extras?: {
    priceLimits?: [number, number];
  };
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
    staleTime: 1000 * 30,
    placeholderData: keepPreviousData
  });
};
