import UserContext from '@green-world/context/UserContext';
import {
  useCreatePayPalOrder,
  useCapturePayPalOrder,
  type CreatePayPalOrderPayload
} from '@green-world/hooks/usePayPalDonation';
import {
  PayPalScriptProvider,
  PayPalButtons,
  FUNDING
} from '@paypal/react-paypal-js';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useContext } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string;

type Props = {
  bundleId: 'BASIC' | 'STANDARD' | 'PREMIUM';
  productIds: string[];
  onCardPaymentClick: () => void;
  onCancel: () => void;
};

export const PromoBundlePayInline = ({
  bundleId,
  productIds,
  onCardPaymentClick,
  onCancel
}: Props) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const createOrderMutation = useCreatePayPalOrder();
  const captureOrderMutation = useCapturePayPalOrder();

  const loading =
    createOrderMutation.isPending || captureOrderMutation.isPending;

  const paypalOptions = useMemo(
    () => ({
      clientId,
      currency: 'EUR',
      intent: 'capture' as const,
      components: 'buttons',
      locale: 'en_RS'
    }),
    []
  );

  const handleCreateOrder = async (): Promise<string> => {
    if (!user?._id) {
      throw new Error('User not logged in');
    }
    if (!productIds || productIds.length === 0) {
      throw new Error('Product selection required');
    }
    const payload: CreatePayPalOrderPayload = {
      type: 'PROMO_BUNDLE',
      targetId: user._id,
      bundleId,
      productIds
    };
    const out = await createOrderMutation.mutateAsync(payload);
    return out.id;
  };

  const handleApprove = async (data: { orderID: string }) => {
    await captureOrderMutation.mutateAsync({ orderId: data.orderID });
    toast.success('Uspešno! Promocija je aktivirana.');
    // Invalidate relevant queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['userDetails'] });
    queryClient.invalidateQueries({ queryKey: ['allUserProducts'] });
    queryClient.invalidateQueries({
      queryKey: ['featured', 'promoted-products']
    });
    queryClient.invalidateQueries({
      queryKey: ['featured', 'promoted-shops']
    });
    navigate('/profile');
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <PayPalButtons
        fundingSource={FUNDING.PAYPAL}
        style={{ layout: 'vertical' }}
        disabled={loading || !user?._id}
        createOrder={async () => {
          onCardPaymentClick?.();
          const id = await handleCreateOrder();
          return id;
        }}
        onApprove={async (data) => {
          await handleApprove(data);
        }}
        onCancel={onCancel}
      />
    </PayPalScriptProvider>
  );
};
