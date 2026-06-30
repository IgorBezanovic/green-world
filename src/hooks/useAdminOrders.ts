import { adminGetOrders } from '@green-world/services/adminApi';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const ADMIN_ORDER_KEYS = {
  all: ['adminOrders'] as const,
  list: (filters: Record<string, any>) =>
    [...ADMIN_ORDER_KEYS.all, 'list', filters] as const
};

export const useAdminOrders = (filters: Record<string, any>) =>
  useQuery({
    queryKey: ADMIN_ORDER_KEYS.list(filters),
    queryFn: () => adminGetOrders(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30
  });
