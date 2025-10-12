import { request } from '@green-world/utils/api';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

export const useDeleteEvent = (
  id: string,
  options?: UseMutationOptions<any, unknown, void>
) => {
  return useMutation<any, unknown, void>({
    mutationFn: () =>
      request({
        url: `/action/${id}`,
        method: 'delete'
      }),
    ...options
  });
};
