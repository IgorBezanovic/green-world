import { request } from '@green-world/utils/api';
import { useQuery } from 'react-query';

export const useEvent = (id: string) => {
  return useQuery(
    ['eventDetails', id],
    () =>
      request({
        url: `/action/details/${id}`,
        method: 'get'
      }),
    {
      enabled: !!id
    }
  );
};
