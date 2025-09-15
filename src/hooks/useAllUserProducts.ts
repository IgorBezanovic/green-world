import { request } from '@green-world/utils/api';
import { getItem } from '@green-world/utils/cookie';
import { Product } from '@green-world/utils/types';
import { jwtDecode } from 'jwt-decode';
import { useQuery, UseQueryResult } from 'react-query';

export const useAllUserProducts = (
  userId?: string
): UseQueryResult<Product[]> => {
  const getToken = getItem('token');
  const decodedToken: any = getToken && jwtDecode(getToken);
  // Check if userId is passed, if not use the userId from the token
  const userIdToUse = userId ? userId : decodedToken?._id;

  return useQuery(['allUserProducts', userIdToUse], () =>
    request({
      url: `/product/personal/${userIdToUse}`,
      method: 'get'
    })
  );
};
