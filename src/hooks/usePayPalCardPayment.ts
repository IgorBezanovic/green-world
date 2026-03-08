import { request } from '@green-world/utils/api';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

type PayPalCardPaymentPayload = {
  cardNumber: string;
  expirationMonth: string;
  expirationYear: string;
  cvv: string;
  amount: number;
  message?: string;
};

type PayPalCardPaymentResponse = {
  success: boolean;
  transactionId: string;
  status: string;
  amount: string;
  currency: string;
  requiresAction?: boolean;
  approvalUrl?: string;
  orderId?: string;
  message?: string;
};

/**
 * Hook for PayPal direct card payment (replaces Braintree card payment)
 * Uses PayPal REST API for processing card payments directly
 */
export const usePayPalCardPayment = (): UseMutationResult<
  PayPalCardPaymentResponse,
  Error,
  PayPalCardPaymentPayload
> => {
  return useMutation({
    mutationKey: ['paypal', 'card-payment'],
    mutationFn: async (payload) => {
      const res = await request({
        url: '/paypal/card-payment',
        method: 'post',
        data: payload
      });

      return res as PayPalCardPaymentResponse;
    }
  });
};
