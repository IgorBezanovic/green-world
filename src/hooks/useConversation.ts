import { request } from '@green-world/utils/api';
import { useQuery } from 'react-query';

export const useConversation = (chatWithId: string) => {
  return useQuery(['conversation', chatWithId], () =>
    request({
      url: `/message/conversation/${chatWithId}`,
      method: 'get'
    })
  );
};
