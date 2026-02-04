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
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string;

type Props = {
  productIds: string[];
  days: number;
  totalRsd: number;
  onCardPaymentClick?: () => void;
  onCancel?: () => void;
};

export const PromoteProductPayCardInline = ({
  productIds,
  days,
  totalRsd,
  onCardPaymentClick,
  onCancel
}: Props) => {
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
    const payload: CreatePayPalOrderPayload = {
      type: 'PROMOTE_PRODUCT',
      productIds,
      days
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
        Ukupno: <strong>{totalRsd} RSD</strong> ({productIds.length}{' '}
        proizvod(a), {days} dana). Plaćanje karticom putem PayPal-a (iznos u EUR
        po trenutnom kursu).
      </Typography>

      <PayPalScriptProvider options={paypalOptions}>
        <Box sx={{ maxWidth: 300 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
            Debitna ili kreditna kartica
          </Typography>
          <PayPalButtons
            fundingSource={FUNDING.CARD}
            style={{ layout: 'vertical' }}
            disabled={loading || productIds.length === 0}
            createOrder={async () => {
              setStatus('Kreiram nalog...');
              onCardPaymentClick?.();
              const id = await handleCreateOrder();
              setStatus('Unesite podatke kartice u PayPal prozoru...');
              return id;
            }}
            onApprove={async (data) => {
              await handleApprove(data);
            }}
            onCancel={() => {
              setStatus('Uplata je otkazana.');
              onCancel?.();
            }}
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
