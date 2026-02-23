import { request } from '@green-world/utils/api';
import { getItem } from '@green-world/utils/cookie';
import { safeDecodeToken } from '@green-world/utils/helpers';
import { useQuery } from '@tanstack/react-query';

export const useAllUserEvents = (userId?: string) => {
  const getToken = getItem('token');
  const decodedToken = safeDecodeToken<{ _id?: string }>(getToken);
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
