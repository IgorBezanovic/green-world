import { request } from '@green-world/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (receiverId: string) =>
      request({
        url: `/message/mark-read/${receiverId}`,
        method: 'put'
      }),
    onSuccess: async (_data, receiverId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userMessages'] }),
        queryClient.invalidateQueries({
          queryKey: ['conversation', receiverId]
        })
      ]);
    }
  });
};
