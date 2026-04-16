import { getServices } from '@green-world/services/serviceApi';
import type { ServiceListing } from '@green-world/utils/types';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useAllUserServices = (
  userId?: string
): UseQueryResult<ServiceListing[]> => {
  return useQuery({
    queryKey: ['allUserServices', userId],
    queryFn: () => getServices({ providerId: userId }),
    enabled: !!userId
  });
};
