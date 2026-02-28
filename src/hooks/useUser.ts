import UserContext from '@green-world/context/UserContext';
import { request } from '@green-world/utils/api';
import { getItem } from '@green-world/utils/cookie';
import { safeDecodeToken } from '@green-world/utils/helpers';
import {
  getDecrypted,
  storeEncrypted
} from '@green-world/utils/saveToLocalStorage';
import { DecodedToken, User } from '@green-world/utils/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useContext } from 'react';

export const useUser = (userID: string, me?: boolean): UseQueryResult<User> => {
  const { setUserDataInCTX } = useContext(UserContext);
  const localStorageToken = getItem('token');
  const token = safeDecodeToken<DecodedToken>(localStorageToken || '');

  return useQuery({
    queryKey: ['userDetails', userID],
    queryFn: async () => {
      const data = await request({
        url: `/user/details/${userID}`,
        method: 'get'
      });
      if (me || userID === token?._id) setUserDataInCTX(data);
      storeEncrypted('user', data as User & { _id: string });
      return data;
    },
    enabled: !!userID,
    initialData: () => getDecrypted('user', userID)
  });
};
