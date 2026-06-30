import {
  getSellerOrders,
  getSellerOrdersUnreadCount,
  markSellerOrdersRead
} from '@green-world/services/ordersApi';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const SELLER_ORDER_KEYS = {
  all: ['sellerOrders'] as const,
  list: (filters: Record<string, any>) =>
    [...SELLER_ORDER_KEYS.all, 'list', filters] as const,
  unreadCount: ['sellerOrders', 'unreadCount'] as const
};

export const useSellerOrders = (filters: Record<string, any>) =>
  useQuery({
    queryKey: SELLER_ORDER_KEYS.list(filters),
    queryFn: () => getSellerOrders(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30
  });

export const useSellerOrdersUnreadCount = (enabled = true) =>
  useQuery({
    queryKey: SELLER_ORDER_KEYS.unreadCount,
    queryFn: getSellerOrdersUnreadCount,
    enabled,
    staleTime: 1000 * 15,
    refetchInterval: enabled ? 30000 : false
  });

export const useMarkSellerOrdersRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markSellerOrdersRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SELLER_ORDER_KEYS.all });
      qc.invalidateQueries({ queryKey: SELLER_ORDER_KEYS.unreadCount });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Greška pri ažuriranju porudžbina'
      );
    }
  });
};
