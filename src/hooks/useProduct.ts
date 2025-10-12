import { request } from '@green-world/utils/api';
import {
  getDecrypted,
  storeEncrypted
} from '@green-world/utils/saveToLocalStorage';
import { Product } from '@green-world/utils/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useProduct = (id: string): UseQueryResult<Product> => {
  return useQuery({
    queryKey: ['productDetails', id],
    queryFn: async () => {
      const data = await request({
        url: `/product/details/${id}`,
        method: 'get'
      });
      storeEncrypted('product', data);
      return data;
    },
    enabled: !!id,
    initialData: () => getDecrypted('product', id)
  });
};
