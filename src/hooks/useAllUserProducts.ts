import { request } from '@green-world/utils/api';
import { getItem } from '@green-world/utils/cookie';
import { jwtDecode } from 'jwt-decode';
import { useQuery } from 'react-query';

export const useAllUserProducts = () => {
  const decodedToken: any = jwtDecode(getItem('token')!);

  return useQuery(['allUserProducts', decodedToken._id], () =>
    request({
      url: `/product/personal/${decodedToken._id}`,
      method: 'get'
    })
  );
};
