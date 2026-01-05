import { request } from '@green-world/utils/api';
import { BlogPost } from '@green-world/utils/types';
import { useQuery } from '@tanstack/react-query';

export const useAllBlogPosts = () => {
  return useQuery({
    queryKey: ['blogPosts'],
    queryFn: () =>
      request({
        url: '/blog-post',
        method: 'get'
      }) as Promise<BlogPost[]>
  });
};
