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
  places: number;
};

export const IncreaseCapacityPayInline = ({ places }: Props) => {
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
    const payload: CreatePayPalOrderPayload = {
      type: 'INCREASE_CAPACITY',
      targetId: user._id,
      places
    };
    const out = await createOrderMutation.mutateAsync(payload);
    return out.id;
  };

  const handleApprove = async (data: { orderID: string }) => {
    await captureOrderMutation.mutateAsync({ orderId: data.orderID });
    toast.success('Uspešno! Promocija je aktivirana.');
    queryClient.invalidateQueries({ queryKey: ['userDetails'] });
    navigate('/profile');
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <PayPalButtons
        fundingSource={FUNDING.PAYPAL}
        style={{ layout: 'vertical' }}
        disabled={loading || !user?._id || places < 1}
        createOrder={async () => {
          const id = await handleCreateOrder();
          return id;
        }}
        onApprove={async (data) => {
          await handleApprove(data);
        }}
      />
    </PayPalScriptProvider>
  );
};
