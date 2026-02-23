import { request } from '@green-world/utils/api';
import { Event } from '@green-world/utils/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useCreateEvent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
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
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userDetails'] }),
        queryClient.invalidateQueries({ queryKey: ['allUserEvents'] }),
        queryClient.invalidateQueries({ queryKey: ['allEvents'] })
      ]);
      navigate('/profile');
    }
  });
};
