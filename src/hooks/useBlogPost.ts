import { request } from '@green-world/utils/api';
import {
  getDecrypted,
  storeEncrypted
} from '@green-world/utils/saveToLocalStorage';
import { BlogPost } from '@green-world/utils/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useBlogPost = (id?: string): UseQueryResult<BlogPost> => {
  const storageKey = 'blogpost';

  return useQuery<BlogPost>({
    queryKey: ['blogPost', id],
    queryFn: async () => {
      if (!id) throw new Error('Missing post id');
      const data = await request({
        url: `/blog-post/post/${id}`,
        method: 'get'
      });
      storeEncrypted(storageKey, data);
      return data as BlogPost;
    },
    enabled: !!id,
    initialData: () => getDecrypted(storageKey, id) as unknown as BlogPost
  });
};

export default useBlogPost;
