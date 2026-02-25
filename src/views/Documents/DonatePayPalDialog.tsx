import { useBraintreeClientToken } from '@green-world/hooks/useBraintree';
import {
  useCreatePayPalOrder,
  useCapturePayPalOrder
} from '@green-world/hooks/usePayPalDonation';
import { request } from '@green-world/utils/api';
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
  Tabs,
  Tab
} from '@mui/material';
import {
  PayPalScriptProvider,
  PayPalButtons,
  FUNDING
} from '@paypal/react-paypal-js';
import { useQueryClient } from '@tanstack/react-query';
import dropin from 'braintree-web-drop-in';
import { useMemo, useState, useRef, useEffect } from 'react';

type Props = { open: boolean; onClose: () => void };

const minRsd = 500;

export const DonatePayPalDialog = ({ open, onClose }: Props) => {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string;
  const useBraintreeEnv = import.meta.env.VITE_BRAINTREE_ENABLED !== 'false';

  const [amountRsd, setAmountRsd] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [paymentTab, setPaymentTab] = useState<'braintree' | 'paypal'>(
    useBraintreeEnv ? 'braintree' : 'paypal'
  );
  const braintreeContainerRef = useRef<HTMLDivElement>(null);
  const braintreeInstanceRef = useRef<{
    requestPaymentMethod: () => Promise<{ nonce: string }>;
    teardown: () => Promise<void>;
  } | null>(null);
  const [braintreeReady, setBraintreeReady] = useState(false);

  const rsdNumber = Number(amountRsd || 0);
  const isValid = Number.isFinite(rsdNumber) && rsdNumber >= minRsd;

  const queryClient = useQueryClient();
  const createOrderMutation = useCreatePayPalOrder();
  const captureOrderMutation = useCapturePayPalOrder();
  const braintreeTokenQuery = useBraintreeClientToken(
    open && paymentTab === 'braintree' && isValid
  );
  const [braintreeSubmitting, setBraintreeSubmitting] = useState(false);

  // Uvek svež token kada se dijalog otvori (kao na /donation), da ne koristimo keširani
  useEffect(() => {
    if (open && paymentTab === 'braintree') {
      queryClient.invalidateQueries({
        queryKey: ['braintree', 'client-token']
      });
    }
  }, [open, paymentTab, queryClient]);

  const loading =
    createOrderMutation.isPending ||
    captureOrderMutation.isPending ||
    braintreeSubmitting;
  const errorMsg =
    createOrderMutation.error?.message ||
    captureOrderMutation.error?.message ||
    braintreeTokenQuery.error?.message ||
    '';

  const paypalOptions = useMemo(
    () => ({
      clientId,
      currency: 'EUR',
      intent: 'capture' as const,
      components: 'buttons',
      locale: 'en_RS'
    }),
    [clientId]
  );

  // Logika iz Donation.tsx: dropin.create u kontejneru kada imamo token i validan iznos
  useEffect(() => {
    if (
      paymentTab !== 'braintree' ||
      !braintreeTokenQuery.data ||
      !isValid ||
      !braintreeContainerRef.current
    ) {
      setBraintreeReady(false);
      return;
    }
    const wrapper = braintreeContainerRef.current;
    const container = document.createElement('div');
    wrapper.innerHTML = '';
    wrapper.appendChild(container);
    let mounted = true;
    let dropinInstance: {
      requestPaymentMethod: () => Promise<{ nonce: string }>;
      teardown: () => Promise<void>;
    } | null = null;
    const dropinOptions = {
      authorization: braintreeTokenQuery.data,
      container,
      locale: 'en_US' as const,
      translations: {
        payingWith: 'Plaćanje karticom',
        chooseAnotherWayToPay: '',
        cardNumberLabel: 'Broj kartice',
        expirationDateLabel: 'Datum isteka',
        expirationDateLabelSubheading: '(MM/GG)',
        expirationDatePlaceholder: 'MM/GG',
        cvvLabel: 'CVV',
        cvvThreeDigitLabelSubheading: '(3 cifre)',
        cvvFourDigitLabelSubheading: '(4 cifre)',
        cardholderNameLabel: 'Ime na kartici',
        cardholderNamePlaceholder: 'Ime na kartici',
        postalCodeLabel: 'Poštanski broj',
        payWithCard: 'Plati karticom',
        saveCardLabel: 'Sačuvaj karticu',
        fieldEmptyForNumber: 'Unesite broj kartice.',
        fieldEmptyForExpirationDate: 'Unesite datum isteka.',
        fieldEmptyForCvv: 'Unesite CVV.',
        fieldInvalidForNumber: 'Broj kartice nije ispravan.',
        fieldInvalidForExpirationDate: 'Datum isteka nije ispravan.',
        fieldInvalidForCvv: 'CVV nije ispravan.',
        genericError: 'Došlo je do greške. Pokušajte ponovo.',
        hostedFieldsFailedTokenizationError:
          'Proverite podatke i pokušajte ponovo.'
      },
      paymentOptionPriority: ['card'],
      paypal: false,
      paypalCredit: false,
      currency: 'RSD'
    };

    dropin
      .create(dropinOptions as any)
      .then((inst) => {
        if (mounted) {
          dropinInstance = inst;
          braintreeInstanceRef.current = inst;
          setBraintreeReady(true);
          // Sakrivanje reda "Choose another way to pay" (tekst je već prazan preko translations)
          setTimeout(() => {
            container.querySelectorAll('a').forEach((a) => {
              if (!(a as HTMLElement).textContent?.trim()) {
                const row =
                  (a as HTMLElement).closest(
                    '[class*="option"], [class*="way"]'
                  ) ?? a.parentElement;
                if (row) (row as HTMLElement).style.display = 'none';
              }
            });
          }, 150);
        } else {
          inst.teardown();
        }
      })
      .catch((err) => {
        if (mounted) {
          const msg = err instanceof Error ? err.message : String(err);
          setStatus(`❌ Greška pri učitavanju: ${msg}`);
        }
      });
    return () => {
      mounted = false;
      if (dropinInstance) {
        dropinInstance.teardown();
        dropinInstance = null;
      }
      braintreeInstanceRef.current = null;
      setBraintreeReady(false);
      if (wrapper) wrapper.innerHTML = '';
    };
  }, [paymentTab, braintreeTokenQuery.data, isValid]);

  const braintreeSubmitInProgressRef = useRef(false);
  const handleBraintreePay = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isValid || !braintreeInstanceRef.current) return;
    if (braintreeSubmitInProgressRef.current) return;
    braintreeSubmitInProgressRef.current = true;
    setStatus('Obrada plaćanja...');
    setBraintreeSubmitting(true);
    try {
      const { nonce } =
        await braintreeInstanceRef.current.requestPaymentMethod();
      setStatus('Šaljem na server...');
      const amountNum = Number(amountRsd || 0);
      const data = (await request({
        url: '/braintree/checkout',
        method: 'post',
        data: { paymentMethodNonce: nonce, amount: amountNum }
      })) as { success?: boolean; transactionId?: string; message?: string };
      if (data.success && data.transactionId) {
        setStatus('✅ Hvala! Donacija je uspešna.');
      } else {
        const msg = data.message || 'Greška tokom uplate.';
        const friendly =
          msg === 'Do Not Honor'
            ? 'Kartica je odbijena od strane banke. Pokušajte drugu karticu ili kontaktirajte banku.'
            : msg;
        setStatus('❌ ' + friendly);
      }
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Greška tokom uplate.';
      const friendly =
        raw.includes('Do Not Honor') || raw.includes('do not honor')
          ? 'Kartica je odbijena od strane banke. Pokušajte drugu karticu ili kontaktirajte banku.'
          : raw;
      setStatus('❌ ' + friendly);
    } finally {
      setBraintreeSubmitting(false);
      braintreeSubmitInProgressRef.current = false;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setStatus('');
        setBraintreeReady(false);
        braintreeInstanceRef.current = null;
        onClose();
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Doniraj</DialogTitle>
      <DialogContent sx={{ pt: 2, p: '10px' }}>
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
              sx={{ minWidth: 100 }}
              onClick={() => setAmountRsd(String(v))}
              disabled={loading}
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
          disabled={loading}
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
          minRows={2}
          inputProps={{ maxLength: 500 }}
        />

        {useBraintreeEnv && (
          <Tabs
            value={paymentTab}
            onChange={(_, v) => {
              setPaymentTab(v);
              if (v !== 'braintree') setBraintreeReady(false);
            }}
            sx={{ mt: 1, minHeight: 36 }}
          >
            <Tab label="RSD (Braintree)" value="braintree" />
            <Tab label="EUR (PayPal)" value="paypal" />
          </Tabs>
        )}

        {paymentTab === 'braintree' && useBraintreeEnv ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Ukupno: <strong>{rsdNumber.toLocaleString('sr-RS')} RSD</strong>
            </Typography>
            {rsdNumber >= 2000 && rsdNumber < 3000 && (
              <Typography
                variant="caption"
                color="warning.main"
                sx={{ display: 'block', mb: 1 }}
              >
                U Braintree test (sandbox) režimu iznosi 2000–2999 RSD namerno
                se odbijaju (simulacija odbijanja). Za uspešan test koristite
                npr. 500 ili 1000, ili 3000+ RSD.
              </Typography>
            )}
            {braintreeTokenQuery.isLoading && (
              <Typography variant="body2" color="text.secondary">
                Učitavam...
              </Typography>
            )}
            {braintreeTokenQuery.data && isValid && (
              <form onSubmit={handleBraintreePay} id="braintree-payment-form">
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 1 }}
                >
                  Unesite podatke kartice ispod, zatim kliknite Plati.
                </Typography>
                <Box
                  ref={braintreeContainerRef}
                  sx={{ minHeight: 200, my: 1 }}
                />
                {!braintreeReady && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    Unesite broj kartice, datum isteka i CVV da bi dugme Plati
                    postalo aktivno.
                  </Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={
                    loading || braintreeTokenQuery.isLoading || !braintreeReady
                  }
                >
                  Plati {rsdNumber.toLocaleString('sr-RS')} RSD
                </Button>
              </form>
            )}
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            {paymentTab === 'paypal' && (
              <Typography
                variant="caption"
                sx={{ display: 'block', mb: 1, opacity: 0.8 }}
              >
                PayPal naplatu izvršava u EUR (RSD se preračunava).
              </Typography>
            )}
            <PayPalScriptProvider options={paypalOptions}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                    disabled={!isValid || loading}
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
                    disabled={!isValid || loading}
                    createOrder={async () => {
                      setStatus('Kreiram nalog...');
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
                    onCancel={() => setStatus('Uplata je otkazana.')}
                    onError={(err) => {
                      console.error(err);
                      setStatus('❌ Greška tokom uplate.');
                    }}
                  />
                </Box>
              </Box>
            </PayPalScriptProvider>
          </Box>
        )}

        {(status || errorMsg) && (
          <Typography variant="body2" sx={{ mt: 2 }}>
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
