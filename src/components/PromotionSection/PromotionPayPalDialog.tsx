import UserContext from '@green-world/context/UserContext';
import { useAllUserProducts } from '@green-world/hooks/useAllUserProducts';
import {
  useCreatePayPalOrder,
  useCapturePayPalOrder,
  type PaymentTypePromo,
  type CreatePayPalOrderPayload
} from '@green-world/hooks/usePayPalDonation';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';

const PROMO_LABELS: Record<
  PaymentTypePromo,
  { title: string; description: string }
> = {
  PROMOTE_PRODUCT: {
    title: 'Promoviši Proizvode',
    description: 'Istaknite proizvod na vrhu pretrage. Promocija važi 5 dana.'
  },
  PROMOTE_SHOP: {
    title: 'Promoviši Prodavnicu',
    description: 'Povećajte vidljivost prodavnice. Promocija važi 5 dana.'
  },
  INCREASE_CAPACITY: {
    title: 'Povećaj Kapacitet Shopa',
    description: 'Proširite kapacitet za više proizvoda (+25 mesta).'
  },
  PROMO_BUNDLE: {
    title: 'Promotivni Paketi',
    description:
      'Paket: +25 mesta, 5 dana promocija prodavnice, 5 dana promocija za 5 nasumičnih proizvoda.'
  }
};

type Props = {
  open: boolean;
  onClose: () => void;
  promotionType: PaymentTypePromo;
  initialProductId?: string | null;
};

export const PromotionPayPalDialog = ({
  open,
  onClose,
  promotionType,
  initialProductId
}: Props) => {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string;
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  useEffect(() => {
    if (open && promotionType === 'PROMOTE_PRODUCT' && initialProductId) {
      setSelectedProductId(initialProductId);
    }
    if (!open) setSelectedProductId('');
  }, [open, promotionType, initialProductId]);

  const { data: userProducts = [] } = useAllUserProducts();
  const createOrderMutation = useCreatePayPalOrder();
  const captureOrderMutation = useCapturePayPalOrder();

  const loading =
    createOrderMutation.isPending || captureOrderMutation.isPending;
  const errorMsg =
    createOrderMutation.error?.message ||
    captureOrderMutation.error?.message ||
    '';

  const labels = PROMO_LABELS[promotionType];
  const needsProductSelection = promotionType === 'PROMOTE_PRODUCT';
  const targetId =
    promotionType === 'PROMOTE_PRODUCT' ? selectedProductId : (user?._id ?? '');
  const canPay = !!targetId && (!needsProductSelection || !!selectedProductId);

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

  const handleCreateOrder = async (): Promise<string> => {
    const payload: CreatePayPalOrderPayload = {
      type: promotionType,
      targetId
    };
    const out = await createOrderMutation.mutateAsync(payload);
    return out.id;
  };

  const handleClose = () => {
    const wasSuccessful = status === 'Uspešno! Promocija je aktivirana.';
    setStatus('');
    setSelectedProductId('');
    onClose();
    if (wasSuccessful) {
      setTimeout(() => {
        navigate('/profile');
      }, 100);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{labels.title}</DialogTitle>
      <DialogContent sx={{ pt: 1, p: '10px' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {labels.description}
        </Typography>

        {!user?._id ? (
          <Typography color="text.secondary">
            Ulogujte se da biste kupili promociju.
          </Typography>
        ) : (
          <>
            {needsProductSelection && (
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel id="promo-product-label">
                  Izaberite proizvod
                </InputLabel>
                <Select
                  labelId="promo-product-label"
                  value={selectedProductId}
                  label="Izaberite proizvod"
                  onChange={(e) => setSelectedProductId(e.target.value)}
                >
                  <MenuItem value="">
                    <em>—</em>
                  </MenuItem>
                  {userProducts?.map((p) => (
                    <MenuItem key={p._id} value={p._id}>
                      {p.title || p._id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {canPay && (
              <Box sx={{ mt: 1 }}>
                <PayPalScriptProvider options={paypalOptions}>
                  <PayPalButtons
                    style={{ layout: 'vertical' }}
                    disabled={!canPay || loading}
                    createOrder={async () => {
                      setStatus('Kreiram nalog...');
                      const id = await handleCreateOrder();
                      setStatus('Potvrdi uplatu u PayPal prozoru...');
                      return id;
                    }}
                    onApprove={async (data) => {
                      setStatus('Finalizujem uplatu...');
                      await captureOrderMutation.mutateAsync({
                        orderId: data.orderID
                      });
                      setStatus('Uspešno! Promocija je aktivirana.');
                      // Invalidate relevant queries to refresh data
                      queryClient.invalidateQueries({
                        queryKey: ['userDetails']
                      });
                      if (promotionType === 'PROMOTE_PRODUCT') {
                        queryClient.invalidateQueries({
                          queryKey: ['allUserProducts']
                        });
                        queryClient.invalidateQueries({
                          queryKey: ['featured', 'promoted-products']
                        });
                      }
                      if (promotionType === 'PROMOTE_SHOP') {
                        queryClient.invalidateQueries({
                          queryKey: ['featured', 'promoted-shops']
                        });
                      }
                      if (promotionType === 'INCREASE_CAPACITY') {
                        // User details will be refreshed
                      }
                      navigate('/profile');
                    }}
                    onCancel={() => setStatus('Uplata je otkazana.')}
                    onError={() => setStatus('Greška tokom uplate.')}
                  />
                </PayPalScriptProvider>
              </Box>
            )}

            {(status || errorMsg) && (
              <Typography variant="body2" sx={{ mt: 2 }}>
                {errorMsg ? `❌ ${errorMsg}` : status}
              </Typography>
            )}
          </>
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
