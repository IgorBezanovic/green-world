import { request } from '@green-world/utils/api';
import { useMutation } from '@tanstack/react-query';

export const useMarkAsRead = () => {
  return useMutation({
    mutationFn: (receiverId: string) =>
      request({
        url: `/message/mark-read/${receiverId}`,
        method: 'put'
      })
  });
};
