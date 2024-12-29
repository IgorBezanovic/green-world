import UserContext from '@green-world/context/UserContext';
import { request } from '@green-world/utils/api';
import { User } from '@green-world/utils/types';
import { useContext } from 'react';
import { useQuery, UseQueryResult } from 'react-query';

export const useUser = (userID: string): UseQueryResult<User> => {
  const { setUserDataInCTX } = useContext(UserContext);

  return useQuery(
    ['userDetails', userID],
    () =>
      request({
        url: `/user/details/${userID}`,
        method: 'get'
      }),
    {
      enabled: !!userID,
      onSuccess: (data: User) => {
        setUserDataInCTX(data);
      }
    }
  );
};
