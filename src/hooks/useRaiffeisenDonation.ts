import { request } from '@green-world/utils/api';
import {
  useMutation,
  UseMutationResult,
  useQueryClient
} from '@tanstack/react-query';

type CreateRaiffeisenOrderPayload = {
  amountRsd: number;
  message?: string;
  successUrl: string;
  cancelUrl: string;
  failUrl: string;
};

type CreateRaiffeisenOrderResponse = {
  orderId: string;
  paymentUrl: string;
  merchantOrderReference: string;
};

type CheckRaiffeisenOrderPayload = {
  orderId: string;
};

type CheckRaiffeisenOrderResponse = {
  status: string;
  orderId: string;
  amount: number;
  currency: string;
};

export const useCreateRaiffeisenOrder = (): UseMutationResult<
  CreateRaiffeisenOrderResponse,
  Error,
  CreateRaiffeisenOrderPayload
> => {
  return useMutation({
    mutationKey: ['raiffeisen', 'create-order'],
    mutationFn: async (payload) => {
      const res = await request({
        url: '/raiffeisen/create-order',
        method: 'post',
        data: payload
      });

      if (!res?.paymentUrl) {
        throw new Error('Neuspešno kreiranje narudžbine za plaćanje');
      }

      return res as CreateRaiffeisenOrderResponse;
    }
  });
};

export const useCheckRaiffeisenOrder = (): UseMutationResult<
  CheckRaiffeisenOrderResponse,
  Error,
  CheckRaiffeisenOrderPayload
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['raiffeisen', 'check-order'],
    mutationFn: async (payload) => {
      const res = await request({
        url: '/raiffeisen/check-order',
        method: 'post',
        data: payload
      });

      return res as CheckRaiffeisenOrderResponse;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userDetails'] }),
        queryClient.invalidateQueries({ queryKey: ['allUserProducts'] }),
        queryClient.invalidateQueries({ queryKey: ['allProducts'] }),
        queryClient.invalidateQueries({ queryKey: ['featured'] })
      ]);
    }
  });
};
