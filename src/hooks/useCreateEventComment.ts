import { request } from '@green-world/utils/api';
import { Comment } from '@green-world/utils/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type EventCommentPayload = {
  actionId: string;
  text: string;
  parentComment?: string | null;
  author: string;
};

export const useCreateEventComment = () => {
  const queryClient = useQueryClient();

  return useMutation<Comment, unknown, EventCommentPayload>({
    mutationKey: ['createEventComment'],
    mutationFn: (data: EventCommentPayload) =>
      request({
        url: `/action/${data.actionId}/comment`,
        method: 'post',
        data
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['eventDetails'] })
      ]);
    }
  });
};
