import UserContext from '@green-world/context/UserContext';
import { request } from '@green-world/utils/api';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

export const useAllUserEvents = (userId?: string) => {
  const { userId: contextUserId } = useContext(UserContext);
  const userIdToUse = userId ?? contextUserId;

  return useQuery({
    queryKey: ['allUserEvents', userIdToUse],
    queryFn: () =>
      request({
        url: `/action/personal/${userIdToUse}`,
        method: 'get'
      }),
    enabled: !!userIdToUse
  });
};
