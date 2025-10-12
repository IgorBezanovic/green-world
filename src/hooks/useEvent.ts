import { request } from '@green-world/utils/api';
import { useQuery } from '@tanstack/react-query';

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ['eventDetails', id],
    queryFn: () =>
      request({
        url: `/action/details/${id}`,
        method: 'get'
      }),
    enabled: !!id
  });
};
