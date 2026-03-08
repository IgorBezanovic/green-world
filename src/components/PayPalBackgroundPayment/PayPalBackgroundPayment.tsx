import {
  useCreatePayPalRedirect,
  useCapturePayPalRedirect
} from '@green-world/hooks/usePayPalRedirect';
import {
  Button,
  Typography,
  Stack,
  Box,
  CircularProgress,
  TextField
} from '@mui/material';
import { useState } from 'react';

type Props = {
  amount: number;
  message?: string;
  isValid?: boolean;
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
};

export const PayPalBackgroundPayment = ({
  amount,
  message = '',
  isValid = true,
  disabled = false,
  onSuccess,
  onError,
  onCancel
}: Props) => {
  const [email, setEmail] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string>('');

  const createOrderMutation = useCreatePayPalRedirect();
  const captureOrderMutation = useCapturePayPalRedirect();

  const isLoading =
    createOrderMutation.isPending || captureOrderMutation.isPending;

  const handleStartPayment = async () => {
    if (!email || !email.includes('@')) {
      setError('Unesite validan email');
      onError?.('Unesite validan email');
      return;
    }

    setError('');

    try {
      // Build return and cancel URLs
      const currentUrl = window.location.href;
      const returnUrl = `${currentUrl}?paypal_success=true`;
      const cancelUrl = `${currentUrl}?paypal_cancel=true`;

      const result = await createOrderMutation.mutateAsync({
        type: 'DONATION',
        amountRsd: amount,
        message,
        returnUrl,
        cancelUrl
      });

      // Redirect to PayPal for approval
      window.location.href = result.approvalUrl;
    } catch (err: any) {
      console.error('PayPal redirect error:', err);
      const errorMsg = err.message || 'Greška pri kreiranju PayPal naloga';
      setError(errorMsg);
      onError?.(errorMsg);
    }
  };

  const handleCancel = () => {
    setIsActive(false);
    setError('');
    setEmail('');
    onCancel?.();
  };

  // Check URL params for PayPal return
  const urlParams = new URLSearchParams(window.location.search);
  const paypalSuccess = urlParams.get('paypal_success');
  const paypalCancel = urlParams.get('paypal_cancel');
  const orderId = urlParams.get('token'); // PayPal returns token as orderId

  // Handle PayPal return
  if (
    paypalSuccess &&
    orderId &&
    !captureOrderMutation.isPending &&
    !captureOrderMutation.isSuccess
  ) {
    // Capture the order
    captureOrderMutation.mutate(
      { orderId },
      {
        onSuccess: () => {
          // Clean URL params
          window.history.replaceState({}, '', window.location.pathname);
          onSuccess?.();
        },
        onError: (err: any) => {
          const errorMsg = err.message || 'Greška pri završavanju uplate';
          setError(errorMsg);
          onError?.(errorMsg);
        }
      }
    );
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Finalizujem uplatu...
        </Typography>
      </Box>
    );
  }

  if (paypalCancel) {
    // Clean URL params
    window.history.replaceState({}, '', window.location.pathname);
  }

  if (!isActive) {
    return (
      <Button
        variant="contained"
        fullWidth
        disabled={!isValid || disabled || isLoading}
        onClick={() => setIsActive(true)}
        sx={{
          backgroundColor: '#0070ba',
          '&:hover': { backgroundColor: '#005ea6' },
          py: 1.5
        }}
      >
        Plati putem PayPal-a
      </Button>
    );
  }

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        p: 2,
        backgroundColor: 'background.paper'
      }}
    >
      <Typography variant="body2" sx={{ mb: 2 }}>
        Iznos: <strong>{amount.toLocaleString()} RSD</strong>
        <Typography
          component="span"
          variant="caption"
          sx={{ display: 'block', color: 'text.secondary' }}
        >
          (konvertuje se u EUR)
        </Typography>
      </Typography>

      <TextField
        label="PayPal email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="dense"
        size="small"
        placeholder="vas@email.com"
        disabled={isLoading}
      />

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1, mb: 1 }}>
          ❌ {error}
        </Typography>
      )}

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleStartPayment}
          disabled={isLoading || !email || !email.includes('@')}
          sx={{
            backgroundColor: '#0070ba',
            '&:hover': { backgroundColor: '#005ea6' }
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Nastavi na PayPal'
          )}
        </Button>
        <Button variant="outlined" onClick={handleCancel} disabled={isLoading}>
          Otkaži
        </Button>
      </Stack>

      <Typography
        variant="caption"
        sx={{ display: 'block', mt: 1, color: 'text.secondary' }}
      >
        Bićete preusmereni na PayPal za potvrdu uplate
      </Typography>
    </Box>
  );
};
