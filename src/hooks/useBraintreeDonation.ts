import { request } from '@green-world/utils/api';
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';

type BraintreeDonationPayload = {
  paymentMethodNonce: string;
  amount: number;
  message?: string;
};

type BraintreeDonationResponse = {
  success: boolean;
  transactionId: string;
  status: string;
  amount: string;
  currency: string;
};

type ClientTokenResponse = {
  clientToken: string;
};

export const useBraintreeClientToken = () => {
  return useQuery({
    queryKey: ['braintree', 'client-token'],
    queryFn: async () => {
      const data = await request({
        url: '/braintree/client-token',
        method: 'get'
      });
      return data as ClientTokenResponse;
    },
    staleTime: 1000 * 60 * 5
  });
};

export const useBraintreeDonation = (): UseMutationResult<
  BraintreeDonationResponse,
  Error,
  BraintreeDonationPayload
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['braintree', 'donation'],
    mutationFn: async (payload) => {
      const data = await request({
        url: '/braintree/donation',
        method: 'post',
        data: payload
      });
      return data as BraintreeDonationResponse;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['userDetails'] }),
        queryClient.invalidateQueries({ queryKey: ['allUserProducts'] })
      ]);
    }
  });
};
