import { request } from '@green-world/utils/api';
import { useQuery } from '@tanstack/react-query';

export const useConversation = (chatWithId: string) => {
  return useQuery({
    queryKey: ['conversation', chatWithId],
    queryFn: () =>
      request({
        url: `/message/conversation/${chatWithId}`,
        method: 'get'
      })
  });
};
