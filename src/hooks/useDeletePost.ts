import { request } from '@green-world/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeletePost = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      request({
        url: `/blog-post/post/${id}`,
        method: 'delete'
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userDetails'] }),
        queryClient.invalidateQueries({ queryKey: ['blogPostsByUser'] })
      ]);
    }
  });
};
