import {
  useCreateRaiffeisenOrder,
  useCheckRaiffeisenOrder
} from '@green-world/hooks/useRaiffeisenDonation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  Box,
  CircularProgress
} from '@mui/material';
import { CreditCard } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

type Props = { open: boolean; onClose: () => void };

export const DonateRaiffeisenDialog = ({ open, onClose }: Props) => {
  const [amountRsd, setAmountRsd] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const minRsd = 500;
  const rsdNumber = Number(amountRsd || 0);
  const isValid = Number.isFinite(rsdNumber) && rsdNumber >= minRsd;

  const createOrderMutation = useCreateRaiffeisenOrder();
  const checkOrderMutation = useCheckRaiffeisenOrder();

  const loading = createOrderMutation.isPending || checkOrderMutation.isPending;
  const errorMsg =
    createOrderMutation.error?.message ||
    checkOrderMutation.error?.message ||
    '';

  // Proveri status narudžbine kada se dialog otvori (nakon povratka sa plaćanja)
  useEffect(() => {
    if (!open) return;

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('raiffeisenOrderId');
    const paymentStatus = urlParams.get('status');

    if (orderId) {
      // Čistimo URL parametre
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, '', newUrl);

      if (paymentStatus === 'success') {
        setStatus('Proveravam status plaćanja...');
        checkOrderMutation.mutate(
          { orderId },
          {
            onSuccess: (data) => {
              if (data.status === 'APPROVED' || data.status === 'COMPLETED') {
                setStatus('✅ Hvala! Vaša donacija je uspešno primljena.');
              } else {
                setStatus(`Status plaćanja: ${data.status}`);
              }
            },
            onError: () => {
              setStatus('❌ Greška prilikom provere statusa plaćanja.');
            }
          }
        );
      } else if (paymentStatus === 'cancel') {
        setStatus('Plaćanje je otkazano.');
      } else if (paymentStatus === 'fail') {
        setStatus('❌ Plaćanje nije uspelo.');
      }
    }
  }, [open, checkOrderMutation]);

  const handlePayment = useCallback(async () => {
    if (!isValid) return;

    setIsRedirecting(true);
    setStatus('Priprema plaćanja...');

    const currentUrl = window.location.origin + window.location.pathname;
    const successUrl = `${currentUrl}?raiffeisenOrderId={orderId}&status=success`;
    const cancelUrl = `${currentUrl}?raiffeisenOrderId={orderId}&status=cancel`;
    const failUrl = `${currentUrl}?raiffeisenOrderId={orderId}&status=fail`;

    try {
      const result = await createOrderMutation.mutateAsync({
        amountRsd: rsdNumber,
        message: message.trim() || undefined,
        successUrl,
        cancelUrl,
        failUrl
      });

      // Preusmeri korisnika na Raiffeisen payment formu
      window.location.href = result.paymentUrl;
    } catch {
      setIsRedirecting(false);
      setStatus('❌ Greška prilikom pripreme plaćanja.');
    }
  }, [isValid, rsdNumber, message, createOrderMutation]);

  const handleClose = () => {
    setStatus('');
    setAmountRsd('');
    setMessage('');
    setIsRedirecting(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CreditCard size={24} />
        Doniraj - Karticom u dinarima (RSD)
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Podržite razvoj Zelenog Sveta sigurnim plaćanjem putem Raiffeisen
          banke. Plaćanje se vrši u dinarima (RSD) sa podrškom za sve domaće
          kartice.
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mb: 2, width: '100%' }}
        >
          {[500, 1000, 2000].map((v) => (
            <Button
              key={v}
              variant="outlined"
              size="small"
              sx={{ minWidth: 100 }}
              onClick={() => setAmountRsd(String(v))}
              disabled={loading || isRedirecting}
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
          disabled={loading || isRedirecting}
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
          disabled={loading || isRedirecting}
        />

        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            border: 1,
            borderColor: 'divider'
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Detalji plaćanja:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {' '}
            Iznos:{' '}
            <strong>
              {rsdNumber > 0 ? `${rsdNumber.toLocaleString()} RSD` : '-'}
            </strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Primalac: Zeleni Svet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Valuta: RSD (Srpski dinar)
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{ mt: 3 }}
          disabled={!isValid || loading || isRedirecting}
          onClick={handlePayment}
          startIcon={
            isRedirecting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <CreditCard size={20} />
            )
          }
        >
          {isRedirecting ? 'Preusmeravam...' : 'Plati karticom'}
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 2, textAlign: 'center' }}
        >
          Plaćanje je procesirano sigurno putem Raiffeisen banke. Podržane
          kartice: Visa, Mastercard, DinaCard.
        </Typography>

        {(status || errorMsg) && (
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              p: 1.5,
              bgcolor: errorMsg ? 'error.light' : 'success.light',
              color: errorMsg ? 'error.contrastText' : 'success.contrastText',
              borderRadius: 1
            }}
          >
            {errorMsg ? `❌ ${errorMsg}` : status}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading || isRedirecting}>
          Zatvori
        </Button>
      </DialogActions>
    </Dialog>
  );
};
