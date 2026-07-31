import {
  adminApproveVerification,
  adminGetVerificationFailures,
  adminRequestVerificationChange,
  type AdminVerificationEntityType
} from '@green-world/services/adminApi';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const ADMIN_VERIFICATION_KEYS = {
  all: ['adminVerificationFailures'] as const,
  list: (filters: Record<string, any>) =>
    [...ADMIN_VERIFICATION_KEYS.all, 'list', filters] as const
};

export const useAdminVerificationFailures = (filters: Record<string, any>) =>
  useQuery({
    queryKey: ADMIN_VERIFICATION_KEYS.list(filters),
    queryFn: () => adminGetVerificationFailures(filters),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30
  });

export const useAdminApproveVerification = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      entityType,
      id
    }: {
      entityType: AdminVerificationEntityType;
      id: string;
    }) => adminApproveVerification(entityType, id),
    onSuccess: () => {
      toast.success('Verifikacija je odobrena');
      qc.invalidateQueries({ queryKey: ADMIN_VERIFICATION_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Greška pri odobravanju verifikacije'
      );
    }
  });
};

export const useAdminRequestVerificationChange = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      entityType,
      id,
      message,
      locale
    }: {
      entityType: AdminVerificationEntityType;
      id: string;
      message: string;
      locale: 'sr' | 'en' | 'ru';
    }) => adminRequestVerificationChange(entityType, id, message, locale),
    onSuccess: (data) => {
      toast.success(
        data?.email
          ? `Zahtev za izmenu poslat na ${data.email}`
          : 'Zahtev za izmenu je poslat'
      );
      qc.invalidateQueries({ queryKey: ADMIN_VERIFICATION_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Greška pri slanju zahteva za izmenu'
      );
    }
  });
};
