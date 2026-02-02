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
import { useMemo, useState } from 'react';

const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string;

type Props = {
  productIds: string[];
  days: number;
  totalRsd: number;
};

export const PromoteProductPayCardInline = ({
  productIds,
  days,
  totalRsd
}: Props) => {
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
