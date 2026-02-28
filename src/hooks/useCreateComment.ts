import { request } from '@green-world/utils/api';
import { Comment } from '@green-world/utils/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type CommentPayload = {
  postId: string;
  text: string;
  parentComment?: string | null;
  author: string;
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<Comment, unknown, CommentPayload>({
    mutationKey: ['createComment'],
    mutationFn: (data: CommentPayload) =>
      request({
        url: `/blog-post/${data.postId}/comment`,
        method: 'post',
        data
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['blogPost'] })
      ]);
    }
  });
};
