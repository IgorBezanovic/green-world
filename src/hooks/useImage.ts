import { request } from '@green-world/utils/api';
import { useMutation } from 'react-query';

export const useImage = () => {
  return useMutation(
    (file: FormData) =>
      request({
        url: '/storage/upload/',
        method: 'post',
        data: file,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    {
      onSuccess: (data) => {
        data;
      }
    }
  );
};
