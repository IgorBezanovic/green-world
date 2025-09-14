import { SearchOptionType } from '@green-world/components';
import { request } from '@green-world/utils/api';
import { useQuery, UseQueryResult } from 'react-query';

export const useSearch = (
  searchTerm: string
): UseQueryResult<SearchOptionType[]> => {
  return useQuery(
    ['search', searchTerm],
    () =>
      request({
        url: `/ai/search`,
        method: 'get',
        params: { searchTerm }
      }),
    {
      enabled: searchTerm.length >= 3
    }
  );
};
