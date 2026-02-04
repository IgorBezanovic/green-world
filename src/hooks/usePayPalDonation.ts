import { request } from '@green-world/utils/api';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

export type PaymentTypePromo =
  | 'PROMOTE_PRODUCT'
  | 'PROMOTE_SHOP'
  | 'INCREASE_CAPACITY'
  | 'PROMO_BUNDLE';

type CreatePayPalOrderPayloadDonation = {
  type: 'DONATION';
  amountRsd: number;
  message?: string;
};

type CreatePayPalOrderPayloadPromo = {
  type: PaymentTypePromo;
  targetId: string;
};

type CreatePayPalOrderPayloadPromoProducts = {
  type: 'PROMOTE_PRODUCT';
  productIds: string[];
  days: number;
};

type CreatePayPalOrderPayloadPromoShop = {
  type: 'PROMOTE_SHOP';
  targetId: string;
  days: number;
};

type CreatePayPalOrderPayloadIncreaseCapacity = {
  type: 'INCREASE_CAPACITY';
  targetId: string;
  places: number;
};

type CreatePayPalOrderPayloadPromoBundle = {
  type: 'PROMO_BUNDLE';
  targetId: string;
  bundleId: 'BASIC' | 'STANDARD' | 'PREMIUM';
  productIds: string[];
};

export type CreatePayPalOrderPayload =
  | CreatePayPalOrderPayloadDonation
  | CreatePayPalOrderPayloadPromo
  | CreatePayPalOrderPayloadPromoProducts
  | CreatePayPalOrderPayloadPromoShop
  | CreatePayPalOrderPayloadIncreaseCapacity
  | CreatePayPalOrderPayloadPromoBundle;

type CreatePayPalOrderResponse = {
  id: string;
  amountEur?: string;
};

type CapturePayPalOrderPayload = { orderId: string };

type CapturePayPalOrderResponse = {
  status: string;
  data: unknown;
  payment?: unknown;
};

export const useCreatePayPalOrder = (): UseMutationResult<
  CreatePayPalOrderResponse,
  Error,
  CreatePayPalOrderPayload
> => {
  return useMutation({
    mutationKey: ['paypal', 'create-order'],
    mutationFn: async (payload) => {
      const body =
        payload.type === 'DONATION'
          ? {
              type: 'DONATION' as const,
              amountRsd: payload.amountRsd,
              message: payload.message?.trim() || undefined
            }
          : payload.type === 'PROMOTE_PRODUCT' &&
              'productIds' in payload &&
              Array.isArray(payload.productIds)
            ? {
                type: 'PROMOTE_PRODUCT' as const,
                targetId: payload.productIds[0],
                productIds: payload.productIds,
                days: payload.days
              }
            : payload.type === 'PROMOTE_SHOP' &&
                'days' in payload &&
                typeof payload.days === 'number'
              ? {
                  type: 'PROMOTE_SHOP' as const,
                  targetId: payload.targetId,
                  days: payload.days
                }
              : payload.type === 'INCREASE_CAPACITY' &&
                  'places' in payload &&
                  typeof payload.places === 'number'
                ? {
                    type: 'INCREASE_CAPACITY' as const,
                    targetId: payload.targetId,
                    places: payload.places
                  }
                : payload.type === 'PROMO_BUNDLE' &&
                    'bundleId' in payload &&
                    typeof payload.bundleId === 'string' &&
                    Array.isArray(payload.productIds)
                  ? {
                      type: 'PROMO_BUNDLE' as const,
                      targetId: payload.targetId,
                      bundleId: payload.bundleId,
                      productIds: payload.productIds
                    }
                  : {
                      type: payload.type,
                      targetId: (payload as CreatePayPalOrderPayloadPromo)
                        .targetId
                    };

      const res = await request({
        url: '/paypal/create-order',
        method: 'post',
        data: body
      });

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
