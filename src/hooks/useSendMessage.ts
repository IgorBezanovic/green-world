import { request } from '@green-world/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface MessagePayload {
  receiverId: string;
  content: string;
}

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['sendMessage'],
    mutationFn: (payload: MessagePayload) =>
      request({
        url: `/message`,
        method: 'post',
        data: payload
      }),
    onSuccess: async (variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userMessages'] }),
        queryClient.invalidateQueries({
          queryKey: ['conversation', variables.receiverId]
        })
      ]);
    }
  });
};
