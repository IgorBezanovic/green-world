import { request } from '@green-world/utils/api';
import { useMutation, UseMutationOptions } from 'react-query';

export const useDeleteProduct = (
  id: string,
  options?: UseMutationOptions<any, unknown, void>
) => {
  return useMutation(
    ['productDelete', id],
    () =>
      request({
        url: `/product/${id}`,
        method: 'delete'
      }),
    options
  );
};
