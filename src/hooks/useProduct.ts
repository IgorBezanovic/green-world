import { request } from '@green-world/utils/api';
import { useQuery } from 'react-query';

export const useProduct = (id: string) => {
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
