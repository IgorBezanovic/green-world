import { request } from '@green-world/utils/api';
import { getItem } from '@green-world/utils/cookie';
import { safeDecodeToken } from '@green-world/utils/helpers';
import { Product } from '@green-world/utils/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useAllUserProducts = (
  userId?: string
): UseQueryResult<Product[]> => {
  const getToken = getItem('token');
  const decodedToken = safeDecodeToken<{ _id?: string }>(getToken);
  // Check if userId is passed, if not use the userId from the token
  const userIdToUse = userId ? userId : decodedToken?._id;

  return useQuery({
    queryKey: ['allUserProducts', userIdToUse],
    queryFn: () =>
      request({
        url: `/product/personal/${userIdToUse}`,
        method: 'get'
      })
  });
};
