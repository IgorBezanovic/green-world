import { request } from '@green-world/utils/api';
import {
  EventListFiltersParams,
  EventsResponse
} from '@green-world/utils/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const useAllEvents = (filters?: EventListFiltersParams) => {
  return useQuery<EventsResponse>({
    queryKey: ['allEvents', filters],
    queryFn: () =>
      request({
        url: 'action/all',
        method: 'get',
        params: filters
      }) as Promise<EventsResponse>,
    placeholderData: keepPreviousData
  });
};
