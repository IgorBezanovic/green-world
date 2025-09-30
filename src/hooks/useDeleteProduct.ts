import { request } from '@green-world/utils/api';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

export const useDeleteProduct = (
  id: string,
  options?: UseMutationOptions<any, unknown, void>
) => {
  return useMutation({
    mutationFn: () =>
      request({
        url: `/product/${id}`,
        method: 'delete'
      }),
    ...options
  });
};
