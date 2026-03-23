import { request } from '@green-world/utils/api';
import { Comment } from '@green-world/utils/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type ProductReviewPayload = {
  productId: string;
  author: string;
  title?: string;
  text: string;
  image?: string;
  parentComment?: string | null;
};

export const useCreateProductReview = () => {
  const queryClient = useQueryClient();

  return useMutation<Comment, unknown, ProductReviewPayload>({
    mutationKey: ['createProductReview'],
    mutationFn: (data: ProductReviewPayload) =>
      request({
        url: `/product/${data.productId}/review`,
        method: 'post',
        data
      }),
    onSuccess: async (_result, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['productDetails', variables.productId]
        })
      ]);
    }
  });
};
