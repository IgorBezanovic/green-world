import { request } from '@green-world/utils/api';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

type CreatePayPalOrderPayload = {
  amountRsd: number;
  message?: string;
};

type CreatePayPalOrderResponse = {
  id: string;
};

type CapturePayPalOrderPayload = { orderId: string };

type CapturePayPalOrderResponse = {
  status: string;
  data: unknown;
};

export const useCreatePayPalOrder = (): UseMutationResult<
  CreatePayPalOrderResponse,
  Error,
  CreatePayPalOrderPayload
> => {
  return useMutation({
    mutationKey: ['paypal', 'create-order'],
    mutationFn: async (payload) => {
      const res = await request({
        url: '/paypal/create-order',
        method: 'post',
        data: {
          amountRsd: payload.amountRsd,
          // ✅ ne šalji prazno
          message: payload.message?.trim() || undefined
        }
      });

      // Ako request() vraća { data }, otkomentariši:
      // const data = res?.data ?? res;
      const data = res;

      if (!data?.id) {
        throw new Error('Create order: missing id in response');
      }

      return data as CreatePayPalOrderResponse;
    }
  });
};

export const useCapturePayPalOrder = (): UseMutationResult<
  CapturePayPalOrderResponse,
  Error,
  CapturePayPalOrderPayload
> => {
  return useMutation({
    mutationKey: ['paypal', 'capture-order'],
    mutationFn: async (payload) => {
      const res = await request({
        url: '/paypal/capture-order',
        method: 'post',
        data: payload // { orderID }
      });

      // Ako request() vraća { data }, otkomentariši:
      // const data = res?.data ?? res;
      const data = res;

      return data as CapturePayPalOrderResponse;
    }
  });
};
