import { request } from '@green-world/utils/api';
import {
  getDecryptedProduct,
  storeEncryptedProduct
} from '@green-world/utils/localStogareProducts';
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
      initialData: () => getDecryptedProduct(id),
      onSuccess: (data) => storeEncryptedProduct(data)
    }
  );
};
