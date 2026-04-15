import { request } from '@green-world/utils/api';
import {
  getDecrypted,
  storeEncrypted
} from '@green-world/utils/saveToLocalStorage';
import { Product } from '@green-world/utils/types';
import {
  useQuery,
  useQueryClient,
  UseQueryResult
} from '@tanstack/react-query';

export const useProduct = (id: string): UseQueryResult<Product> => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['productDetails', id],
    queryFn: async () => {
      const data = await request({
        url: `/product/details/${id}`,
        method: 'get'
      });
      storeEncrypted('product', data);
      queryClient.invalidateQueries({ queryKey: ['userDetails'] });
      return data;
    },
    enabled: !!id,
    initialData: () => getDecrypted('product', id) ?? undefined
  });
};
