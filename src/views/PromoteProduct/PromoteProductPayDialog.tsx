import {
  useCreatePayPalOrder,
  useCapturePayPalOrder,
  type CreatePayPalOrderPayload
} from '@green-world/hooks/usePayPalDonation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string;

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  productIds: string[];
  days: number;
  totalRsd: number;
};

export const PromoteProductPayDialog = ({
  open,
  onClose,
  onSuccess,
  productIds,
  days,
  totalRsd
}: Props) => {
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
    const payload: CreatePayPalOrderPayload = {
      type: 'PROMOTE_PRODUCT',
      productIds,
      days
    };
    const out = await createOrderMutation.mutateAsync(payload);
    return out.id;
  };

  const handleClose = () => {
    setStatus('');
    onClose();
  };

  const handleApprove = async (data: { orderID: string }) => {
    setStatus('Finalizujem uplatu...');
    await captureOrderMutation.mutateAsync({ orderId: data.orderID });
    setStatus('Uspešno! Promocija je aktivirana.');
    onSuccess?.();
    // Invalidate relevant queries to refresh data
    queryClient.invalidateQueries({ queryKey: ['userDetails'] });
    queryClient.invalidateQueries({ queryKey: ['allUserProducts'] });
    queryClient.invalidateQueries({
      queryKey: ['featured', 'promoted-products']
    });
    navigate('/profile');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Plaćanje promocije proizvoda</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ukupno: <strong>{totalRsd} RSD</strong> ({productIds.length}{' '}
          proizvod(a), {days} dana). Plaćanje putem PayPal-a (iznos u EUR po
          trenutnom kursu).
        </Typography>

        <Box sx={{ mt: 1 }}>
          <PayPalScriptProvider options={paypalOptions}>
            <PayPalButtons
              style={{ layout: 'vertical' }}
              disabled={loading || productIds.length === 0}
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
          </PayPalScriptProvider>
        </Box>

        {(status || errorMsg) && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            {errorMsg ? `❌ ${errorMsg}` : status}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Zatvori
        </Button>
      </DialogActions>
    </Dialog>
  );
};
