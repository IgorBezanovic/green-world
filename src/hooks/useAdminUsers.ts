import {
  adminCreateUser,
  adminDeleteUser,
  adminGetUsers,
  adminUpdateUser
} from '@green-world/services/adminApi';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const ADMIN_USER_KEYS = {
  all: ['adminUsers'] as const,
  list: (filters: Record<string, any>) =>
    [...ADMIN_USER_KEYS.all, 'list', filters] as const
};

export const useAdminUsers = (filters: Record<string, any>) =>
  useQuery({
    queryKey: ADMIN_USER_KEYS.list(filters),
    queryFn: () => adminGetUsers(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30
  });

export const useAdminCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, any>) => adminCreateUser(data),
    onSuccess: () => {
      toast.success('Korisnik je uspešno kreiran');
      qc.invalidateQueries({ queryKey: ADMIN_USER_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Greška pri kreiranju korisnika'
      );
    }
  });
};

export const useAdminUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      adminUpdateUser(id, data),
    onSuccess: () => {
      toast.success('Korisnik je ažuriran');
      qc.invalidateQueries({ queryKey: ADMIN_USER_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Greška pri ažuriranju korisnika'
      );
    }
  });
};

export const useAdminDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminDeleteUser(id),
    onSuccess: () => {
      toast.success('Korisnik je obrisan');
      qc.invalidateQueries({ queryKey: ADMIN_USER_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Greška pri brisanju korisnika'
      );
    }
  });
};
