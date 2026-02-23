import { request } from '@green-world/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type VoteType = 'like' | 'dislike' | string;

export const useVotePost = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vote }: { vote: VoteType }) =>
      request({
        url: `/blog-post/${postId}/vote`,
        method: 'post',
        data: { vote }
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['blogPost', postId] })
      ]);
    }
  });
};
