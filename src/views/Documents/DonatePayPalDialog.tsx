import {
  useCreatePayPalOrder,
  useCapturePayPalOrder
} from '@green-world/hooks/usePayPalDonation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack
} from '@mui/material';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useMemo, useState } from 'react';

type Props = { open: boolean; onClose: () => void };

export const DonatePayPalDialog = ({ open, onClose }: Props) => {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string;

  const [amountRsd, setAmountRsd] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const minRsd = 500;
  const rsdNumber = Number(amountRsd || 0);
  const isValid = Number.isFinite(rsdNumber) && rsdNumber >= minRsd;

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
      intent: 'capture',
      components: 'buttons'
    }),
    [clientId]
  );

  return (
    <Dialog
      open={open}
      onClose={() => {
        setStatus('');
        onClose();
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Doniraj</DialogTitle>
      <DialogContent sx={{ pt: 8, p: '10px' }}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mb: 1, width: '100%' }}
        >
          {[500, 1000, 2000].map((v) => (
            <Button
              key={v}
              variant="outlined"
              size="small"
              sx={{ minWidth: 135 }}
              onClick={() => setAmountRsd(String(v))}
            >
              {v} RSD
            </Button>
          ))}
        </Stack>

        <TextField
          label="Iznos (RSD)"
          value={amountRsd}
          onChange={(e) => {
            const v = e.target.value.replace(/[^\d]/g, '');
            setAmountRsd(v);
          }}
          fullWidth
          margin="dense"
          inputProps={{ inputMode: 'numeric' }}
          helperText={`Minimum ${minRsd} RSD`}
        />

        <TextField
          label="Poruka (opciono)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          margin="dense"
          multiline
          minRows={3}
          inputProps={{ maxLength: 500 }}
        />

        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 1, mb: 2, opacity: 0.8 }}
        >
          Napomena: PayPal naplatu izvršava u EUR (RSD se preračunava).
        </Typography>

        <PayPalScriptProvider options={paypalOptions}>
          <PayPalButtons
            style={{ layout: 'vertical' }}
            disabled={!isValid || loading}
            createOrder={async () => {
              setStatus('Kreiram nalog...');
              const out = await createOrderMutation.mutateAsync({
                amountRsd: rsdNumber,
                message
              });
              setStatus('Potvrdi uplatu u PayPal prozoru...');
              return out.id;
            }}
            onApprove={async (data) => {
              setStatus('Finalizujem uplatu...');
              await captureOrderMutation.mutateAsync({ orderId: data.orderID });
              setStatus('✅ Hvala! Donacija je uspešna.');
            }}
            onCancel={() => setStatus('Uplata je otkazana.')}
            onError={(err) => {
              console.error(err);
              setStatus('❌ Greška tokom uplate.');
            }}
          />
        </PayPalScriptProvider>

        {(status || errorMsg) && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {errorMsg ? `❌ ${errorMsg}` : status}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Zatvori
        </Button>
      </DialogActions>
    </Dialog>
  );
};
