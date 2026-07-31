import {
  getBuyerOrders,
  getSellerOrders,
  getSellerOrdersPendingCount,
  markSellerOrdersRead,
  updateSellerOrderReadStatus,
  updateSellerOrderStatus,
  updateBuyerOrderStatus
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
  pendingCount: ['sellerOrders', 'pendingCount'] as const
};

export const useSellerOrders = (filters: Record<string, any>, enabled = true) =>
  useQuery({
    queryKey: SELLER_ORDER_KEYS.list(filters),
    queryFn: () => getSellerOrders(filters),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30
  });

export const useBuyerOrders = (filters: Record<string, any>, enabled = true) =>
  useQuery({
    queryKey: [...SELLER_ORDER_KEYS.all, 'buyer-list', filters],
    queryFn: () => getBuyerOrders(filters),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30
  });

export const useSellerOrdersPendingCount = (enabled = true) =>
  useQuery({
    queryKey: SELLER_ORDER_KEYS.pendingCount,
    queryFn: getSellerOrdersPendingCount,
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
      qc.invalidateQueries({ queryKey: SELLER_ORDER_KEYS.pendingCount });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Greška pri ažuriranju porudžbina'
      );
    }
  });
};

export const useUpdateBuyerOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status
    }: {
      id: string;
      status: 'NONE' | 'SELLER_CONTACTED' | 'DELIVERED';
    }) => updateBuyerOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SELLER_ORDER_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Greška pri promeni statusa porudžbine'
      );
    }
  });
};

export const useUpdateSellerOrderReadStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) =>
      updateSellerOrderReadStatus(id, read),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SELLER_ORDER_KEYS.all });
      qc.invalidateQueries({ queryKey: SELLER_ORDER_KEYS.pendingCount });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Greška pri promeni statusa porudžbine'
      );
    }
  });
};

export const useUpdateSellerOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status
    }: {
      id: string;
      status: 'NONE' | 'SELLER_CONTACTED' | 'DELIVERED';
    }) => updateSellerOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SELLER_ORDER_KEYS.all });
      qc.invalidateQueries({ queryKey: SELLER_ORDER_KEYS.pendingCount });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Greška pri promeni statusa porudžbine'
      );
    }
  });
};
