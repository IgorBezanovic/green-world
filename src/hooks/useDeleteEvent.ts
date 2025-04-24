import { request } from '@green-world/utils/api';
import { useMutation } from 'react-query';

export const useDeleteEvent = (id: string) => {
  return useMutation(['eventDelete', id], () =>
    request({
      url: `/action/${id}`,
      method: 'delete'
    })
  );
};
