import { request } from '@green-world/utils/api';
import { Event } from '@green-world/utils/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const useEditEvent = (id: string) => {
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
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['allUserEvents'] }),
        queryClient.invalidateQueries({ queryKey: ['allEvents'] }),
        queryClient.invalidateQueries({ queryKey: ['eventDetails', id] })
      ]);
      toast.success('Podaci su uspešno ažurirani.');
    }
  });
};
