import { request } from '@green-world/utils/api';
import { useQuery } from 'react-query';

export const useProductsByGroup = (productGroup: string) => {
  return useQuery(
    ['productsByGroup', productGroup],
    () =>
      request({
        url: `/product/group/${productGroup}`,
        method: 'get'
      }),
    {
      enabled: !!productGroup
    }
  );
};
