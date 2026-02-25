import { request } from '@green-world/utils/api';
import {
  useQuery,
  useMutation,
  UseMutationResult
} from '@tanstack/react-query';

export const useBraintreeClientToken = (enabled = true) => {
  return useQuery({
    queryKey: ['braintree', 'client-token'],
    queryFn: async () => {
      const res = await request({
        url: '/braintree/client-token',
        method: 'get'
      });
      return (res as { clientToken: string }).clientToken;
    },
    enabled
  });
};

type BraintreeTransactionPayload = {
  paymentMethodNonce: string;
  amount: number;
  type: 'DONATION';
  message?: string;
};

type BraintreeTransactionResponse = {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
};

export const useBraintreeTransaction = (): UseMutationResult<
  BraintreeTransactionResponse,
  Error,
  BraintreeTransactionPayload
> => {
  return useMutation({
    mutationKey: ['braintree', 'transaction'],
    mutationFn: async (payload) => {
      const res = await request({
        url: '/braintree/transaction',
        method: 'post',
        data: payload
      });
      return res as BraintreeTransactionResponse;
    }
  });
};
