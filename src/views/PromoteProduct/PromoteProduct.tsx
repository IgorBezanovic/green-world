import { AppBreadcrumbs, MetaTags } from '@green-world/components';
import UserContext from '@green-world/context/UserContext';
import { useAllUserProducts } from '@green-world/hooks/useAllUserProducts';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowLeft, Info, MapPin, Sparkles, TrendingUp, X } from 'lucide-react';
import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { PromoteProductPayCardInline } from './PromoteProductPayCardInline';
import { PromoteProductPayInline } from './PromoteProductPayInline';

const PRICE_PER_DAY_PER_PRODUCT_RSD = 50;

const pages = [
  { label: 'Početna', route: '/' },
  { label: 'Promocija proizvoda', route: '/promote-product' }
];

export const PromoteProduct = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useContext(UserContext);
  const { data: userProducts = [], isLoading: productsLoading } =
    useAllUserProducts();

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [days, setDays] = useState<number>(5);
  const [isCardPaymentActive, setIsCardPaymentActive] = useState(false);

  const totalRsd = useMemo(
    () =>
      selectedProductIds.length > 0 && days > 0
        ? PRICE_PER_DAY_PER_PRODUCT_RSD * days * selectedProductIds.length
        : 0,
    [selectedProductIds.length, days]
  );

  const canPay =
    user?._id && selectedProductIds.length > 0 && days >= 1 && days <= 365;

  const handleProductChange = (event: { target: { value: unknown } }) => {
    const value = event.target.value;
    setSelectedProductIds(
      typeof value === 'string' ? value.split(',') : (value as string[])
    );
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    if (!Number.isNaN(v) && v >= 1 && v <= 365) setDays(v);
  };

  if (!user?._id) {
    return (
      <Box
        sx={{
          width: '100%',
          backgroundColor: 'background.paper',
          minHeight: 'calc(100vh - 360px)'
        }}
      >
        <MetaTags
          title="Promocija proizvoda | Zeleni svet"
          description="Istaknite svoje proizvode na vrhu pretrage. Informacije o promociji proizvoda na Zelenom svetu."
        />
        <Box
          sx={(t) => ({
            maxWidth: '900px',
            width: '100%',
            mx: 'auto',
            px: 2,
            py: 4,
            [t.breakpoints.up('sm')]: { px: 3 }
          })}
        >
          <AppBreadcrumbs pages={pages} />
          <Divider sx={{ my: 2 }} />
          <Alert severity="info">
            Morate biti ulogovani da biste kupili promociju proizvoda.{' '}
            <Button
              size="small"
              onClick={() => navigate('/login')}
              sx={{ mt: 1 }}
            >
              Prijavi se
            </Button>
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags
        title="Promocija proizvoda | Zeleni svet"
        description="Istaknite svoje proizvode na vrhu pretrage. Izaberite proizvode, broj dana i platite. 50 RSD po danu po proizvodu."
      />
      <Box
        sx={(t) => ({
          maxWidth: '900px',
          width: '100%',
          mx: 'auto',
          px: 2,
          py: 4,
          [t.breakpoints.up('sm')]: { px: 3 }
        })}
      >
        <AppBreadcrumbs pages={pages} />
        <Divider sx={{ my: 2 }} />

        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Nazad
        </Button>

        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
        >
          <Sparkles color={theme.palette.success.main} size={28} />
          Promocija proizvoda
        </Typography>

        <Card
          variant="outlined"
          sx={{
            borderColor: 'success.light',
            bgcolor: 'success.light',
            mb: 4
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
            >
              <Info size={20} />
              Šta dobijate promocijom?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Promovisani proizvodi pojavljuju se na{' '}
              <strong>vrhu rezultata pretrage</strong> i na početnoj stranici u
              sekciji istaknutih proizvoda. Veća vidljivost znači više poseta i
              veću šansu za prodaju.
            </Typography>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
            >
              <MapPin size={20} />
              Gde će proizvodi biti promovisani?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Na <strong>stranici pretrage (search)</strong>, u izabranim
              kategorijama, kao i u <strong>Featured</strong> sekciji na
              početnoj stranici — u zavisnosti od podešavanja platforme.
            </Typography>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
            >
              <TrendingUp size={20} />
              Cena
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{PRICE_PER_DAY_PER_PRODUCT_RSD} RSD</strong> po danu po
              proizvodu. Izaberite proizvode i broj dana ispod, pa platite putem
              PayPal-a (iznos u EUR po trenutnom kursu).
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Izaberite proizvode i trajanje
        </Typography>

        {productsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : userProducts.length === 0 ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Nemate nijedan proizvod. Dodajte proizvode u svojoj prodavnici pa ih
            možete promovisati.
          </Alert>
        ) : (
          <>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="promote-products-label">
                Proizvodi za promociju
              </InputLabel>

              <Select
                labelId="promote-products-label"
                label="Proizvodi za promociju"
                multiple
                value={selectedProductIds}
                onChange={handleProductChange}
                disabled={isCardPaymentActive}
                renderValue={(ids) =>
                  ids
                    .map(
                      (id) =>
                        userProducts.find((p) => p._id === id)?.title ?? id
                    )
                    .join(', ')
                }
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 400
                    }
                  }
                }}
              >
                {userProducts.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    <Checkbox
                      checked={selectedProductIds.indexOf(p._id) > -1}
                    />
                    <ListItemText
                      primary={p.title || 'Bez naslova'}
                      secondary={p.price ? `${p.price} RSD` : undefined}
                    />
                  </MenuItem>
                ))}
              </Select>

              <FormHelperText>
                Možete izabrati jedan ili više proizvoda
              </FormHelperText>
            </FormControl>

            {isMobile && selectedProductIds.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<X size={18} />}
                onClick={() => setSelectedProductIds([])}
                fullWidth
                sx={{ mb: 3 }}
              >
                Očisti izbor
              </Button>
            )}

            <TextField
              fullWidth
              label="Broj dana"
              type="number"
              value={days}
              onChange={handleDaysChange}
              disabled={isCardPaymentActive}
              inputProps={{ min: 1, max: 365 }}
              helperText="Trajanje promocije (1–365 dana)"
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
            />

            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  Ukupno za plaćanje
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {selectedProductIds.length} proizvod(a) × {days} dana ×{' '}
                  {PRICE_PER_DAY_PER_PRODUCT_RSD} RSD ={' '}
                  <strong>{totalRsd} RSD</strong>
                </Typography>

                {canPay && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 3,
                      mt: 2,
                      '& > *': { flex: '1 1 280px', minWidth: 280 }
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        PayPal
                      </Typography>
                      <PromoteProductPayInline
                        productIds={selectedProductIds}
                        days={days}
                        totalRsd={totalRsd}
                      />
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Debitna ili kreditna kartica
                      </Typography>
                      <PromoteProductPayCardInline
                        productIds={selectedProductIds}
                        days={days}
                        totalRsd={totalRsd}
                        onCardPaymentClick={() => setIsCardPaymentActive(true)}
                        onCancel={() => setIsCardPaymentActive(false)}
                      />
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </Box>
  );
};
