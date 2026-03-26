import { request } from '@green-world/utils/api';
import {
  BlogPost,
  BlogPostsListFiltersParams,
  PaginatedResponse
} from '@green-world/utils/types';
import { useQuery } from '@tanstack/react-query';

export const useAllBlogPosts = (filters?: BlogPostsListFiltersParams) => {
  return useQuery({
    queryKey: ['blogPosts', filters],
    queryFn: () =>
      request({
        url: '/blog-post',
        method: 'get',
        params: filters
      }) as Promise<PaginatedResponse<BlogPost>>
  });
};
