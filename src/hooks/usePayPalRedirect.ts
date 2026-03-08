import { request } from '@green-world/utils/api';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

type CreatePayPalRedirectPayload = {
  type: 'DONATION';
  amountRsd: number;
  message?: string;
  returnUrl: string;
  cancelUrl: string;
};

type CreatePayPalRedirectResponse = {
  orderId: string;
  approvalUrl: string;
};

/**
 * Hook to create PayPal order with redirect flow (no PayPal buttons)
 * Used for background PayPal payment processing
 */
export const useCreatePayPalRedirect = (): UseMutationResult<
  CreatePayPalRedirectResponse,
  Error,
  CreatePayPalRedirectPayload
> => {
  return useMutation({
    mutationKey: ['paypal', 'create-redirect'],
    mutationFn: async (payload) => {
      const res = await request({
        url: '/paypal/create-order-redirect',
        method: 'post',
        data: payload
      });

      if (!res?.orderId || !res?.approvalUrl) {
        throw new Error('Missing orderId or approvalUrl in response');
      }

      return res as CreatePayPalRedirectResponse;
    }
  });
};

type CapturePayPalOrderPayload = { orderId: string };

type CapturePayPalOrderResponse = {
  status: string;
  data: unknown;
  payment?: unknown;
};

/**
 * Hook to capture PayPal order after user returns from PayPal
 */
export const useCapturePayPalRedirect = (): UseMutationResult<
  CapturePayPalOrderResponse,
  Error,
  CapturePayPalOrderPayload
> => {
  return useMutation({
    mutationKey: ['paypal', 'capture-redirect'],
    mutationFn: async (payload) => {
      const res = await request({
        url: '/paypal/capture-order',
        method: 'post',
        data: payload
      });

      return res as CapturePayPalOrderResponse;
    }
  });
};
