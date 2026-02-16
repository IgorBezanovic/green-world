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
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string;

type Props = {
  productIds: string[];
  days: number;
};

export const PromoteProductPayInline = ({ productIds, days }: Props) => {
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
    const payload: CreatePayPalOrderPayload = {
      type: 'PROMOTE_PRODUCT',
      productIds,
      days
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
    navigate('/profile');
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <PayPalButtons
        fundingSource={FUNDING.PAYPAL}
        style={{ layout: 'vertical' }}
        disabled={loading || productIds.length === 0}
        createOrder={async () => {
          const id = await handleCreateOrder();
          return id;
        }}
        onApprove={async (data) => {
          await handleApprove(data);
        }}
        onError={() => toast.error('Greška tokom uplate.')}
      />
    </PayPalScriptProvider>
  );
};
