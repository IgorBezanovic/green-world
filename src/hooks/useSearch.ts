import { SearchOptionType } from '@green-world/components';
import { request } from '@green-world/utils/api';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useSearch = (
  searchTerm: string
): UseQueryResult<SearchOptionType[]> => {
  return useQuery({
    queryKey: ['search', searchTerm],
    queryFn: () =>
      request({
        url: `/ai/search`,
        method: 'get',
        params: { searchTerm }
      }),
    enabled: searchTerm.length >= 3
  });
};
