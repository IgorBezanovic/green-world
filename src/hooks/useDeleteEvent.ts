import { request } from '@green-world/utils/api';
import { useMutation, UseMutationOptions } from 'react-query';

export const useDeleteEvent = (
  id: string,
  options?: UseMutationOptions<any, unknown, void>
) => {
  return useMutation(
    ['eventDelete', id],
    () =>
      request({
        url: `/action/${id}`,
        method: 'delete'
      }),
    options
  );
};
