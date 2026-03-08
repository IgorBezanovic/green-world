import { usePayPalCardPayment } from '@green-world/hooks/usePayPalCardPayment';
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

export const PayPalCardPayment = ({
  amount,
  message = '',
  isValid = true,
  disabled = false,
  onSuccess,
  onError,
  onCancel
}: Props) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string>('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationMonth, setExpirationMonth] = useState('');
  const [expirationYear, setExpirationYear] = useState('');
  const [cvv, setCvv] = useState('');

  const payPalCardMutation = usePayPalCardPayment();
  const isLoading = payPalCardMutation.isPending;

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  // Check if all fields are valid
  const isCardNumberValid =
    cardNumber.replace(/\s/g, '').length >= 13 &&
    cardNumber.replace(/\s/g, '').length <= 16;
  const isExpirationValid =
    expirationMonth.length === 2 && expirationYear.length === 2;
  const isCvvValid = cvv.length >= 3 && cvv.length <= 4;
  const allFieldsValid = isCardNumberValid && isExpirationValid && isCvvValid;

  const handleSubmit = async () => {
    if (!allFieldsValid) {
      const invalidFields: string[] = [];
      if (!isCardNumberValid) invalidFields.push('broj kartice');
      if (!isExpirationValid) invalidFields.push('datum isteka');
      if (!isCvvValid) invalidFields.push('CVV');
      const errorMsg = `Proverite sledeća polja: ${invalidFields.join(', ')}`;
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setError('');

    try {
      const result = await payPalCardMutation.mutateAsync({
        cardNumber,
        expirationMonth,
        expirationYear,
        cvv,
        amount,
        message
      });

      if (result.requiresAction && result.approvalUrl) {
        // 3D Secure required, redirect to approval URL
        window.location.href = result.approvalUrl;
        return;
      }

      if (result.success) {
        setIsActive(false);
        resetFields();
        onSuccess?.();
      }
    } catch (err: any) {
      console.error('PayPal card payment error:', err);
      const errorMsg = err.message || 'Greška tokom uplate karticom';
      setError(errorMsg);
      onError?.(errorMsg);
    }
  };

  const handleCancel = () => {
    setIsActive(false);
    setError('');
    resetFields();
    onCancel?.();
  };

  const resetFields = () => {
    setCardNumber('');
    setExpirationMonth('');
    setExpirationYear('');
    setCvv('');
  };

  if (!isActive) {
    return (
      <Button
        variant="contained"
        fullWidth
        disabled={!isValid || disabled || isLoading}
        onClick={() => setIsActive(true)}
        sx={{
          backgroundColor: '#2c3e50',
          '&:hover': { backgroundColor: '#34495e' },
          py: 1.5
        }}
      >
        {isLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          'Plati karticom u RSD'
        )}
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
      </Typography>

      {/* Card Number */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
          Broj kartice (maks. 16 cifara){' '}
          {isCardNumberValid && (
            <Typography
              component="span"
              sx={{ color: 'success.main', fontSize: 'inherit' }}
            >
              ✓
            </Typography>
          )}
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="4111 1111 1111 1111"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          disabled={isLoading}
          inputProps={{ inputMode: 'numeric' }}
          sx={{
            '& .MuiOutlinedInput-root': {
              border: '2px solid',
              borderColor: isCardNumberValid ? 'success.main' : 'divider',
              borderRadius: 1,
              transition: 'border-color 0.3s ease'
            }
          }}
        />
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        {/* Expiration Date */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
            Datum isteka (MM/YY){' '}
            {isExpirationValid && (
              <Typography
                component="span"
                sx={{ color: 'success.main', fontSize: 'inherit' }}
              >
                ✓
              </Typography>
            )}
          </Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              size="small"
              placeholder="MM"
              value={expirationMonth}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 2);
                if (parseInt(value) <= 12 || value.length < 2) {
                  setExpirationMonth(value);
                }
              }}
              disabled={isLoading}
              inputProps={{ inputMode: 'numeric', maxLength: 2 }}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  border: '2px solid',
                  borderColor:
                    expirationMonth.length === 2 ? 'success.main' : 'divider',
                  borderRadius: 1,
                  transition: 'border-color 0.3s ease'
                }
              }}
            />
            <TextField
              size="small"
              placeholder="YY"
              value={expirationYear}
              onChange={(e) =>
                setExpirationYear(e.target.value.replace(/\D/g, '').slice(0, 2))
              }
              disabled={isLoading}
              inputProps={{ inputMode: 'numeric', maxLength: 2 }}
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  border: '2px solid',
                  borderColor:
                    expirationYear.length === 2 ? 'success.main' : 'divider',
                  borderRadius: 1,
                  transition: 'border-color 0.3s ease'
                }
              }}
            />
          </Stack>
        </Box>

        {/* CVV */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
            CVV{' '}
            {isCvvValid && (
              <Typography
                component="span"
                sx={{ color: 'success.main', fontSize: 'inherit' }}
              >
                ✓
              </Typography>
            )}
          </Typography>
          <TextField
            size="small"
            placeholder="123"
            value={cvv}
            onChange={(e) =>
              setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
            }
            disabled={isLoading}
            inputProps={{ inputMode: 'numeric', maxLength: 4 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                border: '2px solid',
                borderColor: isCvvValid ? 'success.main' : 'divider',
                borderRadius: 1,
                transition: 'border-color 0.3s ease'
              }
            }}
          />
        </Box>
      </Stack>

      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          ❌ {error}
        </Typography>
      )}

      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={isLoading || !allFieldsValid}
          sx={{
            backgroundColor: '#2c3e50',
            '&:hover': { backgroundColor: '#34495e' }
          }}
        >
          {isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            `Plati ${amount.toLocaleString()} RSD`
          )}
        </Button>
        <Button variant="outlined" onClick={handleCancel} disabled={isLoading}>
          Otkaži
        </Button>
      </Stack>
    </Box>
  );
};
