import UserContext from '@green-world/context/UserContext';
import { request } from '@green-world/utils/api';
import {
  getDecrypted,
  storeEncrypted
} from '@green-world/utils/saveToLocalStorage';
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
      initialData: () => getDecrypted('product', userID),
      onSuccess: (data: User) => {
        storeEncrypted('user', data as User & { _id: string });
        setUserDataInCTX(data);
      }
    }
  );
};
