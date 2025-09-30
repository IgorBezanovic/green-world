import { request } from '@green-world/utils/api';
import { getItem } from '@green-world/utils/cookie';
import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';

export const useAllUserEvents = (userId?: string) => {
  const getToken = getItem('token');
  const decodedToken: any = getToken && jwtDecode(getToken);
  const userIdToUse = userId ?? decodedToken?._id;

  return useQuery({
    queryKey: ['allUserEvents', userIdToUse],
    queryFn: () =>
      request({
        url: `/action/personal/${userIdToUse}`,
        method: 'get'
      }),
    enabled: !!userIdToUse
  });
};
