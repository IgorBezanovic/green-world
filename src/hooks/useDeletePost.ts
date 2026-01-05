import { request } from '@green-world/utils/api';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

export const useDeletePost = (
  id: string,
  options?: UseMutationOptions<any, unknown, void>
) => {
  return useMutation({
    mutationFn: () =>
      request({
        url: `/blog-post/post/${id}`,
        method: 'delete'
      }),
    ...options
  });
};
