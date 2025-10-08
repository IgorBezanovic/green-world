import { request } from '@green-world/utils/api';
import { useMutation } from 'react-query';

export const useMarkAsRead = () => {
  return useMutation((receiverId: string) =>
    request({
      url: `/message/mark-read/${receiverId}`,
      method: 'put'
    })
  );
};
