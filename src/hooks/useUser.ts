import { request } from '@green-world/utils/api';
import { useQuery } from 'react-query';

export const useUser = (userID: string) => {
  return useQuery(
    ['userDetails', userID],
    () =>
      request({
        url: `/user/details/${userID}`,
        method: 'get'
      }),
    {
      enabled: !!userID
    }
  );
};
