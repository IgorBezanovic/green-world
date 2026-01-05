import { request } from '@green-world/utils/api';
import { useMutation } from '@tanstack/react-query';

export const useVotePost = (postId: string) => {
  return useMutation({
    mutationFn: ({ vote }: { vote: 'like' | 'dislike' | string }) =>
      request({
        url: `/blog-post/${postId}/vote`,
        method: 'post',
        data: { vote }
      })
  });
};
