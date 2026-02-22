import { request } from '@green-world/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

type BlogPostPayload = {
  title: string;
  author: string;
  coverImage?: string;
  blocks: Array<{
    type: 'text' | 'image';
    text?: string;
    image?: string;
  }>;
  keywords?: string[];
  timeOfReading?: number;
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BlogPostPayload) =>
      request({
        url: '/blog-post',
        method: 'post',
        data
      }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userDetails'] }),
        queryClient.invalidateQueries({ queryKey: ['blogPostsByUser'] })
      ]);
      toast.success('Uspešno ste kreirali blog post!');
    }
  });
};
