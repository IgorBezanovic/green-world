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
  places: number;
};

export const IncreaseCapacityPayInline = ({ places }: Props) => {
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
    const payload: CreatePayPalOrderPayload = {
      type: 'INCREASE_CAPACITY',
      targetId: user._id,
      places
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
      <PayPalScriptProvider options={paypalOptions}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'stretch',
            '& > div': { flex: '1 1 140px', minWidth: 140 }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: '1 1 140px'
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              PayPal
            </Typography>
            <PayPalButtons
              fundingSource={FUNDING.PAYPAL}
              style={{ layout: 'vertical' }}
              disabled={loading || !user?._id || places < 1}
              createOrder={async () => {
                setStatus('Kreiram nalog...');
                const id = await handleCreateOrder();
                setStatus('Potvrdi uplatu u PayPal prozoru...');
                return id;
              }}
              onApprove={async (data) => {
                await handleApprove(data);
              }}
              onCancel={() => setStatus('Uplata je otkazana.')}
              onError={() => setStatus('Greška tokom uplate.')}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flex: '1 1 140px'
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              PayPal Credit
            </Typography>
            <PayPalButtons
              fundingSource={FUNDING.CREDIT}
              style={{ layout: 'vertical' }}
              disabled={loading || !user?._id || places < 1}
              createOrder={async () => {
                setStatus('Kreiram nalog...');
                const id = await handleCreateOrder();
                setStatus('Potvrdi uplatu u PayPal prozoru...');
                return id;
              }}
              onApprove={async (data) => {
                await handleApprove(data);
              }}
              onCancel={() => setStatus('Uplata je otkazana.')}
              onError={() => setStatus('Greška tokom uplate.')}
            />
          </Box>
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
