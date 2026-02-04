import UserContext from '@green-world/context/UserContext';
import {
  useCreatePayPalOrder,
  useCapturePayPalOrder,
  type CreatePayPalOrderPayload
} from '@green-world/hooks/usePayPalDonation';
import { Typography, Box } from '@mui/material';
import {
  PayPalScriptProvider,
  PayPalButtons,
  FUNDING
} from '@paypal/react-paypal-js';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState, useContext } from 'react';
import { useNavigate } from 'react-router';

const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string;

type Props = {
  bundleId: 'BASIC' | 'STANDARD' | 'PREMIUM';
  productIds: string[];
};

export const PromoBundlePayCardInline = ({ bundleId, productIds }: Props) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  const createOrderMutation = useCreatePayPalOrder();
  const captureOrderMutation = useCapturePayPalOrder();

  const loading =
    createOrderMutation.isPending || captureOrderMutation.isPending;
  const errorMsg =
    createOrderMutation.error?.message ||
    captureOrderMutation.error?.message ||
    '';

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
    setStatus('Finalizujem uplatu...');
    await captureOrderMutation.mutateAsync({ orderId: data.orderID });
    setStatus('Uspešno! Promocija je aktivirana.');
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
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        maxWidth: 520
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Plaćanje karticom putem PayPal-a (iznos u EUR po trenutnom kursu).
      </Typography>

      <PayPalScriptProvider options={paypalOptions}>
        <Box sx={{ maxWidth: 300 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
            Debitna ili kreditna kartica
          </Typography>
          <PayPalButtons
            fundingSource={FUNDING.CARD}
            style={{ layout: 'vertical' }}
            disabled={loading || !user?._id}
            createOrder={async () => {
              setStatus('Kreiram nalog...');
              const id = await handleCreateOrder();
              setStatus('Unesite podatke kartice u PayPal prozoru...');
              return id;
            }}
            onApprove={async (data) => {
              await handleApprove(data);
            }}
            onCancel={() => setStatus('Uplata je otkazana.')}
            onError={() => setStatus('Greška tokom uplate.')}
          />
        </Box>
      </PayPalScriptProvider>

      {(status || errorMsg) && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          {errorMsg ? `❌ ${errorMsg}` : status}
        </Typography>
      )}
    </Box>
  );
};
