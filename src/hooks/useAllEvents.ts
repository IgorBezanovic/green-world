import { request } from '@green-world/utils/api';
import { useQuery } from 'react-query';

export const useAllEvents = () => {
  return useQuery('allEvents', () =>
    request({
      url: 'action/all',
      method: 'get'
    })
  );
};
