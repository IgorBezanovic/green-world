import UserContext from '@green-world/context/UserContext';
import { request } from '@green-world/utils/api';
import { Product } from '@green-world/utils/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useContext } from 'react';

export const useAllUserProducts = (
  userId?: string
): UseQueryResult<Product[]> => {
  const { userId: contextUserId } = useContext(UserContext);
  const userIdToUse = userId || contextUserId;

  return useQuery({
    queryKey: ['allUserProducts', userIdToUse],
    queryFn: () =>
      request({
        url: `/product/personal/${userIdToUse}`,
        method: 'get'
      }),
    enabled: !!userIdToUse
  });
};
