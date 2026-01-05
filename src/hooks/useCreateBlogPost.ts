import { request } from '@green-world/utils/api';
import { useMutation } from '@tanstack/react-query';
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
  return useMutation({
    mutationFn: (data: BlogPostPayload) =>
      request({
        url: '/blog-post',
        method: 'post',
        data
      }),
    onSuccess: () => {
      toast.success('Uspešno ste kreirali blog post!');
    }
  });
};
