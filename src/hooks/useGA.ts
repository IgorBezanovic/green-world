import { request } from '@green-world/utils/api';
import { useQuery } from 'react-query';

export const useGA = () => {
  return useQuery('googleAnalytics', () =>
    request({
      url: 'analytics/google',
      method: 'get'
    })
  );
};
