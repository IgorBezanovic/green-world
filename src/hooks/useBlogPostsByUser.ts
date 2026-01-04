import { request } from '@green-world/utils/api';
import {
  getDecrypted,
  storeEncrypted
} from '@green-world/utils/saveToLocalStorage';
import { BlogPost } from '@green-world/utils/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useBlogPostsByUser = (
  userId?: string
): UseQueryResult<BlogPost[]> => {
  const storageKey = 'user-blogposts-' + userId;

  return useQuery<BlogPost[]>({
    queryKey: ['blogPostsByUser', userId],
    queryFn: async () => {
      if (!userId) throw new Error('Missing userId');
      const data = (await request({
        url: `/blog-post/${userId}`,
        method: 'get'
      })) as BlogPost[];
      storeEncrypted(storageKey, data);
      return data;
    },
    enabled: !!userId,
    initialData: () => getDecrypted(storageKey, userId) as unknown as BlogPost[]
  });
};

export default useBlogPostsByUser;
