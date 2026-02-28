import { request } from '@green-world/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteEvent = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<any, unknown, void>({
    mutationFn: () =>
      request({
        url: `/action/${id}`,
        method: 'delete'
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userDetails'] }),
        queryClient.invalidateQueries({ queryKey: ['allUserEvents'] }),
        queryClient.invalidateQueries({ queryKey: ['allEvents'] }),
        queryClient.invalidateQueries({ queryKey: ['eventDetails', id] })
      ]);
    }
  });
};
