import { request } from '@green-world/utils/api';
import { Event } from '@green-world/utils/types';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

export const useCreateEvent = () => {
  const navigate = useNavigate();

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
        url: `/action`,
        method: 'post',
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
        navigate('/profile');
      }
    }
  );
};
