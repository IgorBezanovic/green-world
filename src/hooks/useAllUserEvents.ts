import { request } from '@green-world/utils/api';
import { getItem } from '@green-world/utils/cookie';
import { jwtDecode } from 'jwt-decode';
import { useQuery } from 'react-query';

export const useAllUserEvents = (userId?: string) => {
  const getToken = getItem('token');
  const decodedToken: any = getToken && jwtDecode(getToken);
  // Check if userId is passed, if not use the userId from the token
  const userIdToUse = userId ? userId : decodedToken?._id;

  return useQuery(['allUserEvents', userIdToUse], () =>
    request({
      url: `/action/personal/${userIdToUse}`,
      method: 'get'
    })
  );
};
