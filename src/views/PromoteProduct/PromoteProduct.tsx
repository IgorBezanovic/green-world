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
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowLeft,
  Check,
  Info,
  MapPin,
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { PromoteProductPayCardInline } from './PromoteProductPayCardInline';
import { PromoteProductPayInline } from './PromoteProductPayInline';

const PRICE_PER_DAY_PER_PRODUCT_RSD = 50;

const PRODUCT_PACKAGES: Array<{
  id: string;
  name: string;
  days: number;
  pricePerProductRsd: number;
  description: string;
  popular?: boolean;
}> = [
  {
    id: '7',
    name: '7 dana',
    days: 7,
    pricePerProductRsd: 600,
    description: 'Kratka promocija'
  },
  {
    id: '14',
    name: '14 dana',
    days: 14,
    pricePerProductRsd: 1000,
    description: 'Dve nedelje',
    popular: true
  },
  {
    id: '28',
    name: '28 dana',
    days: 28,
    pricePerProductRsd: 1600,
    description: 'Najpovoljnije po danu'
  }
];

const pages = [
  { label: 'Početna', route: '/' },
  { label: 'Promocija proizvoda', route: '/promote-product' }
];

export const PromoteProduct = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useContext(UserContext);
  const { data: userProducts = [], isLoading: productsLoading } =
    useAllUserProducts();

  const productIdToPromote = (location.state as { promoteProductId?: string })
    ?.promoteProductId;

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  useEffect(() => {
    if (!productIdToPromote || userProducts.length === 0) return;
    const belongsToUser = userProducts.some(
      (p) => p._id === productIdToPromote
    );
    if (!belongsToUser) return;
    setSelectedProductIds((prev) =>
      prev.includes(productIdToPromote) ? prev : [...prev, productIdToPromote]
    );
    navigate(location.pathname, { replace: true, state: {} });
  }, [productIdToPromote, userProducts, navigate, location.pathname]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    PRODUCT_PACKAGES[0].id
  );
  const [isCardPaymentActive, setIsCardPaymentActive] = useState(false);

  const selectedPackage =
    PRODUCT_PACKAGES.find((p) => p.id === selectedPackageId) ??
    PRODUCT_PACKAGES[0];
  const days = selectedPackage.days;
  const totalRsd = useMemo(
    () =>
      selectedProductIds.length > 0
        ? selectedPackage.pricePerProductRsd * selectedProductIds.length
        : 0,
    [selectedProductIds.length, selectedPackage.pricePerProductRsd]
  );

  const canPay = user?._id && selectedProductIds.length > 0;

  const handleProductChange = (event: { target: { value: unknown } }) => {
    const value = event.target.value;
    setSelectedProductIds(
      typeof value === 'string' ? value.split(',') : (value as string[])
    );
  };
  console.log(user._id);
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

            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Izaberite paket trajanja
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: 'repeat(1, 1fr)',
                '@media (min-width: 600px)': {
                  gridTemplateColumns: 'repeat(3, 1fr)'
                },
                mb: 3
              }}
            >
              {PRODUCT_PACKAGES.map((pkg) => (
                <Card
                  key={pkg.id}
                  variant="outlined"
                  sx={{
                    borderColor:
                      selectedPackageId === pkg.id
                        ? 'primary.main'
                        : pkg.popular
                          ? 'warning.main'
                          : 'divider',
                    borderWidth: pkg.popular ? 2 : 1,
                    position: 'relative',
                    cursor: isCardPaymentActive ? 'default' : 'pointer',
                    opacity: isCardPaymentActive ? 0.7 : 1,
                    transition: 'all 0.2s',
                    pointerEvents: isCardPaymentActive ? 'none' : 'auto',
                    '&:hover': isCardPaymentActive
                      ? {}
                      : {
                          boxShadow: 4,
                          transform: 'translateY(-4px)'
                        }
                  }}
                  onClick={() =>
                    !isCardPaymentActive && setSelectedPackageId(pkg.id)
                  }
                >
                  {pkg.popular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'warning.main',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}
                    >
                      Najpopularniji
                    </Box>
                  )}
                  <CardContent>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                      {pkg.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {pkg.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        color="primary.main"
                        sx={{ mb: 0.5 }}
                      >
                        {pkg.pricePerProductRsd} RSD
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        po proizvodu ({pkg.days} dana)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Check
                        size={16}
                        color={theme.palette.success.main as string}
                      />
                      <Typography variant="body2">
                        {pkg.days} dana promocije
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      {Math.round(pkg.pricePerProductRsd / pkg.days)} RSD/dan
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

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
                  {selectedProductIds.length} proizvod(a) ×{' '}
                  {selectedPackage.name} ({selectedPackage.pricePerProductRsd}{' '}
                  RSD po proizvodu) = <strong>{totalRsd} RSD</strong>
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
