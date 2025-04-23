import { request } from '@green-world/utils/api';
import { Event } from '@green-world/utils/types';
import { useMutation } from 'react-query';

export const useEditEvent = (id: string) => {
  return useMutation(
    ({
      title,
      description,
      place,
      address,
      coverImage,
      dateAction,
      startTime,
      endTime,
      typeAction,
      contactPerson,
      contactPhone,
      contactMail,
      status
    }: Event) =>
      request({
        url: `/action/${id}`,
        method: 'put',
        data: {
          title,
          description,
          place,
          address,
          coverImage,
          dateAction,
          startTime,
          endTime,
          typeAction,
          contactPerson,
          contactPhone,
          contactMail,
          status
        }
      }),
    {
      onSuccess: () => {
        // navigate('/profile');
      }
    }
  );
};
