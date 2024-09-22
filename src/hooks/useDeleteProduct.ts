import { request } from '@green-world/utils/api';
import { useMutation } from 'react-query';

export const useDeleteProduct = (id: string) => {
  return useMutation(['productDelete', id], () =>
    request({
      url: `/product/${id}`,
      method: 'delete'
    })
  );
};
