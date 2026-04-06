import { request } from '@green-world/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type VoteType = 'like' | 'dislike' | string;

export const useVoteProduct = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vote }: { vote: VoteType }) =>
      request({
        url: `/product/${productId}/vote`,
        method: 'post',
        data: { vote }
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['productDetails', productId]
      });
    }
  });
};
