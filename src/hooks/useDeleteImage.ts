import { request } from '@green-world/utils/api';
import { useMutation } from '@tanstack/react-query';

export const useDeleteImage = () => {
  return useMutation({
    mutationFn: (imageKey: string) =>
      request({
        url: '/aws/upload/',
        method: 'delete',
        data: { imageKey }
      })
  });
};
