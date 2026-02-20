import { AppBreadcrumbs, MetaTags } from '@green-world/components';
import { useAllUserProducts } from '@green-world/hooks/useAllUserProducts';
import { formatImageUrl } from '@green-world/utils/helpers';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Typography,
  useTheme
} from '@mui/material';
import {
  Check,
  HandCoins,
  MapPin,
  Package,
  ShoppingBag,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import {
  PRODUCT_PACKAGES,
  PromoteProductPayCardInline,
  PromoteProductPayInline
} from './components';

const pages = [
  { label: 'Profil', route: '/profile' },
  { label: 'Promocija proizvoda', route: '/promote-product' }
];

export const PromoteProduct = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
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

  const canPay = selectedProductIds.length > 0;

  const handleProductChange = (event: { target: { value: unknown } }) => {
    const value = event.target.value;
    setSelectedProductIds(
      typeof value === 'string' ? value.split(',') : (value as string[])
    );
  };

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
        sx={(theme) => ({
          maxWidth: '1400px',
          width: '100%',
          mx: 'auto',
          px: 2,
          py: 4,
          [theme.breakpoints.up('sm')]: { px: 3 }
        })}
      >
        <AppBreadcrumbs pages={pages} />

        <Typography
          variant="h1"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 3 }}
        >
          <Sparkles color={theme.palette.success.main} size={28} />
          Promocija proizvoda
        </Typography>

        <Card
          sx={(theme) => ({
            position: 'relative',
            overflow: 'visible',
            p: 3,
            [theme.breakpoints.down('md')]: {
              p: 1
            },
            height: '100%',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'success.light',
            boxShadow: 'none',
            background: 'linear-gradient(180deg, #F4FBF6 0%, #FFFFFF 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mb: 4
          })}
        >
          <CardContent>
            <Typography
              variant="h4"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
            >
              <TrendingUp style={{ width: '24px', height: '24px' }} />
              Šta dobijate promocijom?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Promocija povećava vidljivost vaših proizvoda i omogućava da ih
              kupci primete čak i kada pretražuju ili filtriraju druge
              proizvode. Više pregleda znači više potencijalnih kupaca, veće
              šanse za prodaju i brži povraćaj investicije. Ukratko, promocija
              vam pomaže da vaš proizvod stigne do pravih ljudi u pravo vreme.
            </Typography>
            <Typography
              variant="h4"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
            >
              <MapPin style={{ width: '24px', height: '24px' }} />
              Gde će proizvodi biti promovisani?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Promovisani proizvodi pojavljuju se na{' '}
              <strong>početnoj stranici u sekciji istaknutih proizvoda</strong>{' '}
              i na stranici <strong>svih i kategorisanih proizvoda</strong>,
              korisnici koje god filtere da primene, Vaši proizvodi će biti
              vidljivi. Veća vidljivost znači više poseta i veću šansu za
              prodaju.
            </Typography>
            <Typography
              variant="h4"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
            >
              <HandCoins style={{ width: '24px', height: '24px' }} />
              Cena promovisanja
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Promocija je povoljna i transparentna: plaćate po proizvodu, po
              danu. Što duže promovišete, to je jeftinije, veća vidljivost i
              šansa za prodaju. Izaberite proizvode i trajanje promocije, a
              ukupna cena će biti prikazana odmah bez skrivenih troškova.
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h4" sx={{ mb: 2 }}>
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
              <Select
                labelId="promote-products-label"
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
                {userProducts?.map((p) => (
                  <MenuItem key={p._id} value={p._id}>
                    <Checkbox
                      checked={selectedProductIds.indexOf(p._id) > -1}
                    />
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Box
                        component="img"
                        src={formatImageUrl(p.images[0])}
                        width={'25px'}
                        height={'25px'}
                      />
                      <Typography variant="subtitle2">
                        <strong>{p.title || 'Bez naslova'}, </strong>
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <HandCoins className="mr-1" />{' '}
                        {p.price
                          ?.toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}{' '}
                        {p.priceOnRequest ? 'Cena na upit' : 'RSD'}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>

              <FormHelperText>
                Možete izabrati jedan ili više proizvoda
              </FormHelperText>
            </FormControl>

            <Typography variant="h4" sx={{ mb: 2 }}>
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
              {PRODUCT_PACKAGES?.map((pkg) => (
                <Card
                  key={pkg.id}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    border: '1px solid',
                    background:
                      'linear-gradient(180deg, #F4FBF6 0%, #FFFFFF 100%)',
                    borderColor:
                      selectedPackageId === pkg.id ? 'primary.main' : 'divider',
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
                  <CardContent>
                    <Typography variant="h4" sx={{ mb: 0.5 }}>
                      {pkg.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {pkg.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="h4"
                        color="primary.main"
                        sx={{ mb: 0.5 }}
                      >
                        {pkg.pricePerProductRsd} RSD
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        po proizvodu ({pkg.days} dana)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Check color={theme.palette.success.main as string} />
                      <Typography variant="body1">
                        {pkg.days} dana promocije
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      {Math.round(pkg.pricePerProductRsd / pkg.days)} RSD/dan
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Card
              sx={{
                mb: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'warning.light',
                boxShadow: 'none',
                background: 'linear-gradient(180deg, #FFF5EC 0%, #FFFFFF 100%)'
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1
                  }}
                >
                  <Box
                    sx={{
                      width: 45,
                      height: 45,
                      borderRadius: '50%',
                      bgcolor: 'success.light',
                      color: 'success.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.7
                    }}
                  >
                    <ShoppingBag style={{ width: '24px', height: '24px' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4">Ukupno za plaćanje</Typography>
                    <Typography variant="caption">
                      Pregled porudzbine
                    </Typography>
                  </Box>
                </Box>
                {canPay ? (
                  <>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        my: 2,
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'grey.300',
                        backgroundColor: '#F9FCF7'
                      }}
                    >
                      <strong>{selectedProductIds.length} proizvod(a)</strong> ×{' '}
                      <strong>{selectedPackage.name}</strong> (
                      {selectedPackage.pricePerProductRsd} RSD po proizvodu) ={' '}
                      <strong>{totalRsd} RSD</strong>
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        mt: 4,
                        mx: 'auto',
                        maxWidth: '400px',
                        width: '100%'
                      }}
                    >
                      <PromoteProductPayInline
                        productIds={selectedProductIds}
                        days={days}
                      />
                      <PromoteProductPayCardInline
                        productIds={selectedProductIds}
                        days={days}
                        onCardPaymentClick={() => setIsCardPaymentActive(true)}
                        onCancel={() => setIsCardPaymentActive(false)}
                      />
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      my: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      textAlign: 'center',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      p: 2,
                      borderRadius: 2,
                      border: '1px dashed',
                      borderColor: 'grey.300',
                      backgroundColor: '#F9FCF7',
                      gap: 1
                    }}
                  >
                    <Package />
                    Izaberite proizvode i dužinu trajanja promocije
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
