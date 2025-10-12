import { request } from '@green-world/utils/api';
import { useQuery } from '@tanstack/react-query';

export const useAllEvents = () => {
  return useQuery({
    queryKey: ['allEvents'],
    queryFn: () =>
      request({
        url: 'action/all',
        method: 'get'
      })
  });
};
