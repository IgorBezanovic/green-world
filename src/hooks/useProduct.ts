import { request } from '@green-world/utils/api';
import {
  getDecrypted,
  storeEncrypted
} from '@green-world/utils/saveToLocalStorage';
import { Product } from '@green-world/utils/types';
import { useQuery, UseQueryResult } from 'react-query';

export const useProduct = (id: string): UseQueryResult<Product> => {
  return useQuery(
    ['productDetails', id],
    () =>
      request({
        url: `/product/details/${id}`,
        method: 'get'
      }),
    {
      enabled: !!id,
      initialData: () => getDecrypted('product', id),
      onSuccess: (data) => storeEncrypted('product', data)
    }
  );
};
