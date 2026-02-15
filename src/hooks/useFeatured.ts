import { ProductPreview } from '@green-world/hooks/useHomeProducts';
import { request } from '@green-world/utils/api';
import { User } from '@green-world/utils/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export interface FeaturedResponse {
  promotedProducts: ProductPreview[];
  promotedShops: User[];
  isLoadingProducts: boolean;
  isLoadingShops: boolean;
  isFetchingProducts: boolean;
  isFetchingShops: boolean;
}

export const useFeatured = (): FeaturedResponse & {
  productsQuery: UseQueryResult<ProductPreview[]>;
  shopsQuery: UseQueryResult<User[]>;
} => {
  const productsQuery = useQuery({
    queryKey: ['featured', 'promoted-products'],
    queryFn: () => request({ url: '/product/promoted-products', method: 'get' })
  });

  const shopsQuery = useQuery({
    queryKey: ['featured', 'promoted-shops'],
    queryFn: () => request({ url: '/user/promoted-shops', method: 'get' })
  });

  const promotedProducts = Array.isArray(productsQuery.data)
    ? productsQuery.data
    : [];
  const promotedShops = Array.isArray(shopsQuery.data) ? shopsQuery.data : [];

  return {
    promotedProducts,
    promotedShops,
    isLoadingProducts: productsQuery.isLoading,
    isLoadingShops: shopsQuery.isLoading,
    isFetchingProducts: productsQuery.isFetching,
    isFetchingShops: shopsQuery.isFetching,
    productsQuery,
    shopsQuery
  };
};
