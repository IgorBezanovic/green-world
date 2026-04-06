import { request } from '@green-world/utils/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SERVICE_KEYS } from './useServices';

export type VoteType = 'like' | 'dislike' | string;

export const useVoteService = (serviceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vote }: { vote: VoteType }) =>
      request({
        url: `/services/${serviceId}/vote`,
        method: 'post',
        data: { vote }
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: SERVICE_KEYS.detail(serviceId)
      });
    }
  });
};
