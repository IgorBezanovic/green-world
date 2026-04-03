import { request } from '@green-world/utils/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useEvent = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['eventDetails', id],
    queryFn: async () => {
      const data = await request({
        url: `/action/details/${id}`,
        method: 'get'
      });
      queryClient.invalidateQueries({ queryKey: ['userDetails'] });
      return data;
    },
    enabled: !!id
  });
};
