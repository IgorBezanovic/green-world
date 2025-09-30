import { request } from '@green-world/utils/api';
import { Product } from '@green-world/utils/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useProductsByGroup = (
  productGroup: string
): UseQueryResult<Product[]> => {
  return useQuery({
    queryKey: ['productsByGroup', productGroup],
    queryFn: () =>
      request({
        url: `/product/group/${productGroup}`,
        method: 'get'
      }),
    enabled: !!productGroup
  });
};
