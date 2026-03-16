import {
  contactServiceProvider,
  createService,
  deleteService,
  getServiceById,
  getServices,
  updateService
} from '@green-world/services/serviceApi';
import type {
  ServiceListing,
  ServiceListingFiltersParams
} from '@green-world/utils/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const SERVICE_KEYS = {
  all: ['services'] as const,
  list: (filters?: ServiceListingFiltersParams) =>
    [...SERVICE_KEYS.all, 'list', filters] as const,
  detail: (id: string) => [...SERVICE_KEYS.all, 'detail', id] as const
};

export const useGetServices = (filters?: ServiceListingFiltersParams) => {
  return useQuery({
    queryKey: SERVICE_KEYS.list(filters),
    queryFn: () => getServices(filters)
  });
};

export const useGetServiceById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: SERVICE_KEYS.detail(id),
    queryFn: () => getServiceById(id),
    enabled: !!id && enabled
  });
};

export const useCreateServiceListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ServiceListing>) => createService(data),
    onSuccess: () => {
      toast.success('Usluga je uspešno kreirana');
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Greška pri kreiranju usluge'
      );
    }
  });
};

export const useUpdateServiceListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceListing> }) =>
      updateService(id, data),
    onSuccess: (_, variables) => {
      toast.success('Usluga je uspešno ažurirana');
      queryClient.invalidateQueries({
        queryKey: SERVICE_KEYS.detail(variables.id)
      });
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Greška pri ažuriranju usluge'
      );
    }
  });
};

export const useDeleteServiceListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: () => {
      toast.success('Usluga je uspešno obrisana');
      queryClient.invalidateQueries({ queryKey: SERVICE_KEYS.all });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Greška pri brisanju usluge');
    }
  });
};

export const useContactServiceProvider = () => {
  return useMutation({
    mutationFn: ({
      id,
      message,
      phone
    }: {
      id: string;
      message: string;
      phone: string;
    }) => contactServiceProvider(id, { message, phone }),
    onSuccess: () => {
      toast.success('Poruka je uspešno poslata pružaocu usluge');
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || 'Greška prilikom slanja poruke'
      );
    }
  });
};
