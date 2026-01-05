import { request } from '@green-world/utils/api';
import { Comment } from '@green-world/utils/types';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

export type CommentPayload = {
  postId: string;
  text: string;
  parentComment?: string | null;
  author: string;
};

export const useCreateComment = (
  options?: UseMutationOptions<Comment, unknown, CommentPayload>
) => {
  return useMutation<Comment, unknown, CommentPayload>({
    mutationKey: ['createComment'],
    mutationFn: (data: CommentPayload) =>
      request({
        url: `/blog-post/${data.postId}/comment`,
        method: 'post',
        data
      }),
    ...options
  });
};
