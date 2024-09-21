import { request } from '@green-world/utils/api';
import { useQuery } from 'react-query';

export const useAllProducts = () => {
  return useQuery(['allProducts'], () =>
    request({
      url: '/product/all',
      method: 'get'
    })
  );
};
