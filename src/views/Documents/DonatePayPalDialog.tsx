import {
  useBraintreeClientToken,
  useBraintreeDonation
} from '@green-world/hooks/useBraintreeDonation';
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
  Box,
  CircularProgress
} from '@mui/material';
import {
  PayPalScriptProvider,
  PayPalButtons,
  FUNDING
} from '@paypal/react-paypal-js';
import braintree from 'braintree-web';
import { useEffect, useMemo, useRef, useState } from 'react';

type Props = { open: boolean; onClose: () => void };

export const DonatePayPalDialog = ({ open, onClose }: Props) => {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string;

  const [amountRsd, setAmountRsd] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isCardPaymentActive, setIsCardPaymentActive] = useState(false);
  const [isBraintreeActive, setIsBraintreeActive] = useState(false);
  const [braintreeError, setBraintreeError] = useState<string>('');
  const [fieldValidity, setFieldValidity] = useState({
    number: false,
    expirationDate: false,
    cvv: false
  });
  const braintreeInstanceRef = useRef<braintree.HostedFields | null>(null);

  const minRsd = 500;
  const rsdNumber = Number(amountRsd || 0);
  const isValid = Number.isFinite(rsdNumber) && rsdNumber >= minRsd;

  const createOrderMutation = useCreatePayPalOrder();
  const captureOrderMutation = useCapturePayPalOrder();
  const braintreeDonationMutation = useBraintreeDonation();
  const { data: clientTokenData, isLoading: isClientTokenLoading } =
    useBraintreeClientToken();

  const loading =
    createOrderMutation.isPending ||
    captureOrderMutation.isPending ||
    braintreeDonationMutation.isPending;
  const errorMsg =
    createOrderMutation.error?.message ||
    captureOrderMutation.error?.message ||
    braintreeDonationMutation.error?.message ||
    braintreeError ||
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

  // Initialize Braintree Hosted Fields when activated
  useEffect(() => {
    if (!isBraintreeActive || !clientTokenData?.clientToken || !open) {
      return;
    }

    let hostedFieldsInstance: braintree.HostedFields | null = null;

    const setupBraintree = async () => {
      try {
        setBraintreeError('');
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
              selector: '#card-number',
              placeholder: '4111 1111 1111 1111'
            },
            cvv: {
              selector: '#cvv',
              placeholder: '123'
            },
            expirationDate: {
              selector: '#expiration-date',
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
        setBraintreeError(
          err.message || 'Greška pri inicijalizaciji Braintree'
        );
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
  }, [isBraintreeActive, clientTokenData?.clientToken, open]);

  const handleBraintreeSubmit = async () => {
    const hostedFields = braintreeInstanceRef.current;
    if (!hostedFields) {
      setBraintreeError('Braintree nije inicijalizovan');
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
      setBraintreeError(`Proverite sledeća polja: ${invalidFields.join(', ')}`);
      return;
    }

    setStatus('Obrada uplate...');
    setBraintreeError('');

    try {
      const { nonce } = await hostedFields.tokenize();
      await braintreeDonationMutation.mutateAsync({
        paymentMethodNonce: nonce,
        amount: rsdNumber,
        message
      });
      setStatus('✅ Hvala! Donacija je uspešna.');
      setIsBraintreeActive(false);
    } catch (err: any) {
      console.error('Braintree payment error:', err);
      setBraintreeError(err.message || 'Greška tokom uplate karticom');
      setStatus('');
    }
  };

  const resetBraintree = () => {
    setIsBraintreeActive(false);
    setBraintreeError('');
    setFieldValidity({ number: false, expirationDate: false, cvv: false });
  };

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
              disabled={isCardPaymentActive || isBraintreeActive}
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
          disabled={isCardPaymentActive || isBraintreeActive}
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

        {/* Braintree Card Payment */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 0.5, display: 'block' }}
          >
            Plaćanje karticom u dinarima (RSD)
          </Typography>

          {!isBraintreeActive ? (
            <Button
              variant="contained"
              fullWidth
              disabled={!isValid || loading || isClientTokenLoading}
              onClick={() => setIsBraintreeActive(true)}
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
          ) : (
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
                Iznos: <strong>{rsdNumber.toLocaleString()} RSD</strong>
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  sx={{ mb: 0.5, display: 'block' }}
                >
                  Broj kartice{' '}
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
                  id="card-number"
                  sx={{
                    border: '2px solid',
                    borderColor: fieldValidity.number
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

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ mb: 0.5, display: 'block' }}
                  >
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
                    id="expiration-date"
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
                  <Typography
                    variant="caption"
                    sx={{ mb: 0.5, display: 'block' }}
                  >
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
                    id="cvv"
                    sx={{
                      border: '2px solid',
                      borderColor: fieldValidity.cvv
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
              </Stack>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleBraintreeSubmit}
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
                    `Plati ${rsdNumber.toLocaleString()} RSD`
                  )}
                </Button>
                <Button
                  variant="outlined"
                  onClick={resetBraintree}
                  disabled={braintreeDonationMutation.isPending}
                >
                  Otkaži
                </Button>
              </Stack>
            </Box>
          )}
        </Box>

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
                disabled={!isValid || loading || isBraintreeActive}
                createOrder={async () => {
                  setStatus('Kreiram nalog...');
                  const out = await createOrderMutation.mutateAsync({
                    type: 'DONATION',
                    amountRsd: rsdNumber,
                    message
                  });
                  setStatus('Potvrdi uplatu u PayPal prozoru...');
                  return out.id;
                }}
                onApprove={async (data) => {
                  setStatus('Finalizujem uplatu...');
                  await captureOrderMutation.mutateAsync({
                    orderId: data.orderID
                  });
                  setStatus('✅ Hvala! Donacija je uspešna.');
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
                disabled={!isValid || loading || isBraintreeActive}
                createOrder={async () => {
                  setStatus('Kreiram nalog...');
                  setIsCardPaymentActive(true);
                  const out = await createOrderMutation.mutateAsync({
                    type: 'DONATION',
                    amountRsd: rsdNumber,
                    message
                  });
                  setStatus('Unesite podatke kartice u PayPal prozoru...');
                  return out.id;
                }}
                onApprove={async (data) => {
                  setStatus('Finalizujem uplatu...');
                  await captureOrderMutation.mutateAsync({
                    orderId: data.orderID
                  });
                  setStatus('✅ Hvala! Donacija je uspešna.');
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
