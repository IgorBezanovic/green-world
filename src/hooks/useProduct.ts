import { request } from '@green-world/utils/api';
import { Product } from '@green-world/utils/types';
import { useQuery, UseQueryResult } from 'react-query';

export const useProduct = (id: string): UseQueryResult<Product | undefined> => {
  return useQuery(
    ['productDetails', id],
    () =>
      request({
        url: `/product/details/${id}`,
        method: 'get'
      }),
    {
      enabled: !!id
    }
  );
};
