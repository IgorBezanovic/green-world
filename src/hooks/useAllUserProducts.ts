import { request } from '@green-world/utils/api';
import { getItem } from '@green-world/utils/cookie';
import { jwtDecode } from 'jwt-decode';
import { useQuery } from 'react-query';

export const useAllUserProducts = (userId?: string) => {
  const decodedToken: any = jwtDecode(getItem('token')!);
  // Check if userId is passed, if not use the userId from the token
  const userIdToUse = userId ? userId : decodedToken._id;

  return useQuery(['allUserProducts', userIdToUse], () =>
    request({
      url: `/product/personal/${userIdToUse}`,
      method: 'get'
    })
  );
};
