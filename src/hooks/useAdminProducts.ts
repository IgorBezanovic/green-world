import {
  adminCreateProduct,
  adminDeleteProduct,
  adminGetProducts,
  adminGetUsersList,
  adminUpdateProduct
} from '@green-world/services/adminApi';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const ADMIN_PRODUCT_KEYS = {
  all: ['adminProducts'] as const,
  list: (filters: Record<string, any>) =>
    [...ADMIN_PRODUCT_KEYS.all, 'list', filters] as const,
  usersList: ['adminUsersList'] as const
};

// ─── Queries ────────────────────────────────────────────────────────────────

export const useAdminProducts = (filters: Record<string, any>) =>
  useQuery({
    queryKey: ADMIN_PRODUCT_KEYS.list(filters),
    queryFn: () => adminGetProducts(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30
  });

export const useAdminUsersList = () =>
  useQuery({
    queryKey: ADMIN_PRODUCT_KEYS.usersList,
    queryFn: adminGetUsersList,
    staleTime: 1000 * 60 * 5
  });

// ─── Mutations ──────────────────────────────────────────────────────────────

export const useAdminCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => adminCreateProduct(data),
    onSuccess: () => {
      toast.success('Proizvod je uspešno kreiran');
      qc.invalidateQueries({ queryKey: ADMIN_PRODUCT_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Greška pri kreiranju proizvoda'
      );
    }
  });
};

export const useAdminUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      adminUpdateProduct(id, data),
    onSuccess: () => {
      toast.success('Proizvod je ažuriran');
      qc.invalidateQueries({ queryKey: ADMIN_PRODUCT_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Greška pri ažuriranju proizvoda'
      );
    }
  });
};

export const useAdminDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminDeleteProduct(id),
    onSuccess: () => {
      toast.success('Proizvod je obrisan');
      qc.invalidateQueries({ queryKey: ADMIN_PRODUCT_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Greška pri brisanju proizvoda'
      );
    }
  });
};
