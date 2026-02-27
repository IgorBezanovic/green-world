import {
  useBraintreeClientToken,
  useBraintreeDonation
} from '@green-world/hooks/useBraintreeDonation';
import {
  Button,
  Typography,
  Stack,
  Box,
  CircularProgress
} from '@mui/material';
import braintree from 'braintree-web';
import { useEffect, useRef, useState } from 'react';

type Props = {
  amount: number;
  message?: string;
  isValid?: boolean;
  disabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
};

export const BraintreeCardPayment = ({
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
  const [fieldValidity, setFieldValidity] = useState({
    number: false,
    expirationDate: false,
    cvv: false
  });
  const braintreeInstanceRef = useRef<braintree.HostedFields | null>(null);

  const braintreeDonationMutation = useBraintreeDonation();
  const { data: clientTokenData, isLoading: isClientTokenLoading } =
    useBraintreeClientToken();

  const isLoading = braintreeDonationMutation.isPending || isClientTokenLoading;

  // Initialize Braintree Hosted Fields when activated
  useEffect(() => {
    if (!isActive || !clientTokenData?.clientToken) {
      return;
    }

    let hostedFieldsInstance: braintree.HostedFields | null = null;

    const setupBraintree = async () => {
      try {
        setError('');
        const clientInstance = await braintree.client.create({
          authorization: clientTokenData.clientToken
        });

        hostedFieldsInstance = await braintree.hostedFields.create({
          client: clientInstance,
          styles: {
            input: {
              'font-size': '16px',
              'font-family': 'sans-serif'
            },
            ':focus': {
              color: 'black'
            },
            '.valid': {
              color: 'green'
            },
            '.invalid': {
              color: 'red'
            }
          },
          fields: {
            number: {
              selector: '#braintree-card-number',
              placeholder: '4111 1111 1111 1111',
              maxlength: 16
            },
            cvv: {
              selector: '#braintree-cvv',
              placeholder: '123'
            },
            expirationDate: {
              selector: '#braintree-expiration-date',
              placeholder: 'MM/YY'
            }
          }
        });

        braintreeInstanceRef.current = hostedFieldsInstance;

        // Add event listeners for field validity tracking
        hostedFieldsInstance.on('validityChange', (event) => {
          setFieldValidity({
            number: event.fields.number?.isValid ?? false,
            expirationDate: event.fields.expirationDate?.isValid ?? false,
            cvv: event.fields.cvv?.isValid ?? false
          });
        });
      } catch (err: any) {
        console.error('Braintree setup error:', err);
        setError(err.message || 'Greška pri inicijalizaciji Braintree');
        onError?.(err.message || 'Greška pri inicijalizaciji Braintree');
      }
    };

    setupBraintree();

    return () => {
      if (hostedFieldsInstance) {
        hostedFieldsInstance.teardown().catch((err) => {
          console.error('Braintree teardown error:', err);
        });
        braintreeInstanceRef.current = null;
      }
    };
  }, [isActive, clientTokenData?.clientToken, onError]);

  const handleSubmit = async () => {
    const hostedFields = braintreeInstanceRef.current;
    if (!hostedFields) {
      setError('Braintree nije inicijalizovan');
      onError?.('Braintree nije inicijalizovan');
      return;
    }

    // Check field validity before attempting to tokenize
    const state = hostedFields.getState();
    const invalidFields: string[] = [];

    if (!state.fields.number.isValid) {
      invalidFields.push('broj kartice');
    }
    if (!state.fields.expirationDate.isValid) {
      invalidFields.push('datum isteka');
    }
    if (!state.fields.cvv.isValid) {
      invalidFields.push('CVV');
    }

    if (invalidFields.length > 0) {
      const errorMsg = `Proverite sledeća polja: ${invalidFields.join(', ')}`;
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setError('');

    try {
      const { nonce } = await hostedFields.tokenize();
      await braintreeDonationMutation.mutateAsync({
        paymentMethodNonce: nonce,
        amount,
        message
      });
      setIsActive(false);
      resetFields();
      onSuccess?.();
    } catch (err: any) {
      console.error('Braintree payment error:', err);
      const errorMsg = err.message || 'Greška tokom uplate karticom';
      setError(errorMsg);
      onError?.(errorMsg);
    }
  };

  const handleCancel = () => {
    setIsActive(false);
    setError('');
    setFieldValidity({ number: false, expirationDate: false, cvv: false });
    onCancel?.();
  };

  const resetFields = () => {
    setFieldValidity({ number: false, expirationDate: false, cvv: false });
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
        {isClientTokenLoading ? (
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

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
          Broj kartice (maks. 16 cifara){' '}
          {fieldValidity.number && (
            <Typography
              component="span"
              sx={{ color: 'success.main', fontSize: 'inherit' }}
            >
              ✓
            </Typography>
          )}
        </Typography>
        <Box
          id="braintree-card-number"
          sx={{
            border: '2px solid',
            borderColor: fieldValidity.number ? 'success.main' : 'divider',
            borderRadius: 1,
            p: 1.5,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'background.default',
            transition: 'border-color 0.3s ease'
          }}
        />
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
            Datum isteka (MM/YY){' '}
            {fieldValidity.expirationDate && (
              <Typography
                component="span"
                sx={{ color: 'success.main', fontSize: 'inherit' }}
              >
                ✓
              </Typography>
            )}
          </Typography>
          <Box
            id="braintree-expiration-date"
            sx={{
              border: '2px solid',
              borderColor: fieldValidity.expirationDate
                ? 'success.main'
                : 'divider',
              borderRadius: 1,
              p: 1.5,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'background.default',
              transition: 'border-color 0.3s ease'
            }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
            CVV{' '}
            {fieldValidity.cvv && (
              <Typography
                component="span"
                sx={{ color: 'success.main', fontSize: 'inherit' }}
              >
                ✓
              </Typography>
            )}
          </Typography>
          <Box
            id="braintree-cvv"
            sx={{
              border: '2px solid',
              borderColor: fieldValidity.cvv ? 'success.main' : 'divider',
              borderRadius: 1,
              p: 1.5,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'background.default',
              transition: 'border-color 0.3s ease'
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
          disabled={
            braintreeDonationMutation.isPending ||
            !fieldValidity.number ||
            !fieldValidity.expirationDate ||
            !fieldValidity.cvv
          }
        >
          {braintreeDonationMutation.isPending ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            `Plati ${amount.toLocaleString()} RSD`
          )}
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={braintreeDonationMutation.isPending}
        >
          Otkaži
        </Button>
      </Stack>
    </Box>
  );
};
