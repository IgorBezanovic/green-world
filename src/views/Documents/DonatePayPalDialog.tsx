'use client';

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
  Stack,
  Box
} from '@mui/material';
import {
  PayPalScriptProvider,
  PayPalButtons,
  FUNDING
} from '@paypal/react-paypal-js';
import { useMemo, useState } from 'react';

type Props = { open: boolean; onClose: () => void };

export const DonatePayPalDialog = ({ open, onClose }: Props) => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string;

  const [amountRsd, setAmountRsd] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isCardPaymentActive, setIsCardPaymentActive] = useState(false);

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
      components: 'buttons',
      locale: 'en_RS'
    }),
    [clientId]
  );

  const handleCreateOrder = async () => {
    setStatus('Kreiram nalog...');
    const out = await createOrderMutation.mutateAsync({
      type: 'DONATION',
      amountRsd: rsdNumber,
      message
    });
    return out.id;
  };

  const handleApprove = async (orderID: string) => {
    setStatus('Finalizujem uplatu...');
    await captureOrderMutation.mutateAsync({ orderId: orderID });
    setStatus('✅ Hvala! Donacija je uspešna.');
    setIsCardPaymentActive(false);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setStatus('');
        setIsCardPaymentActive(false);
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
              disabled={isCardPaymentActive}
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
          disabled={isCardPaymentActive}
          fullWidth
          margin="dense"
          slotProps={{ htmlInput: { inputMode: 'numeric' } }}
          helperText={`Minimum ${minRsd} RSD`}
        />

        <TextField
          label="Poruka (opciono)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isCardPaymentActive}
          fullWidth
          margin="dense"
          multiline
          minRows={3}
          slotProps={{ htmlInput: { maxLength: 500 } }}
        />

        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 1, mb: 2, opacity: 0.8 }}
        >
          Napomena: PayPal naplatu izvršava u EUR (RSD se preračunava).
        </Typography>

        <PayPalScriptProvider options={paypalOptions}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, display: 'block' }}
              >
                PayPal
              </Typography>
              <PayPalButtons
                fundingSource={FUNDING.PAYPAL}
                style={{ layout: 'vertical' }}
                disabled={!isValid || loading || isCardPaymentActive}
                createOrder={async () => {
                  const id = await handleCreateOrder();
                  setStatus('Potvrdi uplatu u PayPal prozoru...');
                  return id;
                }}
                onApprove={async (data) => {
                  await handleApprove(data.orderID);
                }}
                onCancel={() => setStatus('Uplata je otkazana.')}
                onError={(err) => {
                  console.error(err);
                  setStatus('❌ Greška tokom uplate.');
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, display: 'block' }}
              >
                Debitna ili kreditna kartica
              </Typography>
              <PayPalButtons
                fundingSource={FUNDING.CARD}
                style={{ layout: 'vertical' }}
                disabled={!isValid || loading}
                createOrder={async () => {
                  setIsCardPaymentActive(true);
                  const id = await handleCreateOrder();
                  setStatus('Unesite podatke kartice u PayPal prozoru...');
                  return id;
                }}
                onApprove={async (data) => {
                  await handleApprove(data.orderID);
                }}
                onCancel={() => {
                  setStatus('Uplata je otkazana.');
                  setIsCardPaymentActive(false);
                }}
                onError={(err) => {
                  console.error(err);
                  setStatus('❌ Greška tokom uplate.');
                  setIsCardPaymentActive(false);
                }}
              />
            </Box>
          </Box>
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
