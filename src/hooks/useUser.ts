import { request } from '@green-world/utils/api';
import { getItem } from '@green-world/utils/cookie';
import { jwtDecode } from 'jwt-decode';
import { useQuery } from 'react-query';

export const useUser = () => {
  const decodedToken: any = jwtDecode(getItem('token')!);

  return useQuery(['userDetails', decodedToken._id], () =>
    request({
      url: `/user/details/${decodedToken._id}`,
      method: 'get'
    })
  );
};
