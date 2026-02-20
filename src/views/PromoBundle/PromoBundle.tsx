import { AppBreadcrumbs, MetaTags } from '@green-world/components';
import { useAllUserProducts } from '@green-world/hooks/useAllUserProducts';
import { formatImageUrl } from '@green-world/utils/helpers';
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
  MenuItem,
  Select,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Check,
  Info,
  Package,
  Sparkles,
  Store,
  TrendingUp,
  X,
  HandCoins,
  ShoppingBag,
  MessageCircleQuestion
} from 'lucide-react';
import { useState } from 'react';

import {
  BUNDLES,
  PromoBundlePayCardInline,
  PromoBundlePayInline
} from './components';

const pages = [
  { label: 'Profil', route: '/profile' },
  { label: 'Promotivni Paketi', route: '/promo-bundle' }
];

export const PromoBundle = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: userProducts = [], isLoading: productsLoading } =
    useAllUserProducts();
  const [selectedBundle, setSelectedBundle] = useState<string | null>(
    BUNDLES[0].id
  );
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags
        title="Promotivni Paketi | Zeleni svet"
        description="Ekskluzivni promotivni paketi sa kombinacijom promocije proizvoda, prodavnice i povećanja kapaciteta. Povoljnije cene od pojedinačnih promocija."
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
          variant="h6"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 3 }}
        >
          <Package color={theme.palette.warning.main} size={28} />
          Promotivni Paketi
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
              <Info style={{ width: '24px', height: '24px' }} />
              Šta dobijate u paketu?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Svaki paket uključuje <strong>kombinaciju tri promocije</strong>:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <Sparkles
                  style={{ width: '22px', height: '22px' }}
                  color={theme.palette.success.main}
                />
                <Typography variant="body1" color="text.secondary">
                  <strong>Promocija proizvoda</strong> — vaši proizvodi se
                  pojavljuju na vrhu pretrage
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <Store
                  style={{ width: '22px', height: '22px' }}
                  color={theme.palette.warning.main}
                />
                <Typography variant="body1" color="text.secondary">
                  <strong>Promocija prodavnice</strong> — vaša prodavnica se
                  ističe u rezultatima pretrage
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <TrendingUp
                  style={{ width: '22px', height: '22px' }}
                  color={theme.palette.success.main}
                />
                <Typography variant="body1" color="text.secondary">
                  <strong>Povećanje kapaciteta</strong> — dodatna mesta za više
                  proizvoda
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="h4"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
                mt: 3
              }}
            >
              <MessageCircleQuestion
                style={{ width: '24px', height: '24px' }}
              />
              Zašto izabrati promotivni paket?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Promotivni paketi su <strong>povoljniji</strong> od kupovine
              pojedinačnih promocija. Uštedite novac dok maksimalno povećavate
              vidljivost svoje prodavnice i proizvoda.
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h4" sx={{ mb: 3 }}>
          Izaberite paket
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: 'repeat(1, 1fr)',
            '@media (min-width: 600px)': {
              gridTemplateColumns: 'repeat(2, 1fr)'
            },
            '@media (min-width: 900px)': {
              gridTemplateColumns: 'repeat(3, 1fr)'
            },
            mb: 4
          }}
        >
          {BUNDLES?.map((bundle) => (
            <Card
              key={bundle.id}
              variant="outlined"
              sx={{
                borderRadius: 2,
                border: '1px solid',
                background: 'linear-gradient(180deg, #F4FBF6 0%, #FFFFFF 100%)',
                borderColor:
                  selectedBundle === bundle.id ? 'primary.main' : 'divider',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover':
                  selectedBundle === bundle.id
                    ? {}
                    : {
                        boxShadow: 4,
                        transform: 'translateY(-4px)'
                      }
              }}
              onClick={() => setSelectedBundle(bundle.id)}
            >
              {bundle.popular && (
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
                <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                  {bundle.name}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {bundle.description}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h4"
                    color="primary.main"
                    sx={{ mb: 0.5 }}
                  >
                    {bundle.priceRsd} RSD
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Check size={16} color={theme.palette.success.main} />
                    <Typography variant="body1">
                      {bundle.features.numProducts} proizvoda ×{' '}
                      {bundle.features.productDays} dana
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Check size={16} color={theme.palette.success.main} />
                    <Typography variant="body1">
                      Promovisanje prodavnice {bundle.features.shopDays} dana
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Check size={16} color={theme.palette.success.main} />
                    <Typography variant="body1">
                      +{bundle.features.capacityPlaces} mesta kapaciteta
                      (trajno)
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {selectedBundle &&
          (() => {
            const bundle = BUNDLES.find((b) => b.id === selectedBundle);
            if (!bundle) return null;

            const maxProducts = bundle.features.numProducts;
            const canProceed = Boolean(
              selectedProductIds.length &&
                selectedProductIds.length <= maxProducts
            );

            const handleProductChange = (event: {
              target: { value: unknown };
            }) => {
              const value = event.target.value;
              const newIds =
                typeof value === 'string'
                  ? value.split(',')
                  : (value as string[]);
              // Ograničavamo na maksimalan broj proizvoda
              if (newIds.length <= maxProducts) {
                setSelectedProductIds(newIds);
              }
            };

            return (
              <Card
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'warning.light',
                  boxShadow: 'none',
                  background:
                    'linear-gradient(180deg, #FFF5EC 0%, #FFFFFF 100%)'
                }}
              >
                <CardContent>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    Izaberite proizvode za promociju
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Ovaj paket uključuje promociju{' '}
                    <strong>{maxProducts} proizvoda</strong>. Molimo izaberite
                    proizvode koje želite da promovišete.
                  </Typography>

                  {productsLoading ? (
                    <Box
                      sx={{ display: 'flex', justifyContent: 'center', py: 3 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : userProducts.length === 0 ? (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Nemate proizvode za promociju. Prvo kreirajte proizvode u
                      vašoj prodavnici.
                    </Alert>
                  ) : (
                    <>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <Select
                          labelId="bundle-products-label"
                          multiple
                          value={selectedProductIds}
                          onChange={handleProductChange}
                          renderValue={(ids) =>
                            ids.length === 0
                              ? 'Izaberite proizvode'
                              : ids
                                  .map(
                                    (id) =>
                                      userProducts.find((p) => p._id === id)
                                        ?.title ?? id
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
                            <MenuItem
                              key={p._id}
                              value={p._id}
                              disabled={
                                selectedProductIds.indexOf(p._id) === -1 &&
                                selectedProductIds.length >= maxProducts
                              }
                            >
                              <Checkbox
                                checked={selectedProductIds.indexOf(p._id) > -1}
                              />
                              <Box
                                sx={{
                                  display: 'flex',
                                  gap: 1,
                                  alignItems: 'center'
                                }}
                              >
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
                          Proizvodi za promociju ({selectedProductIds.length}/
                          {maxProducts})
                        </FormHelperText>
                      </FormControl>

                      {isMobile && selectedProductIds.length > 0 && (
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={
                            <X style={{ width: '22px', height: '22px' }} />
                          }
                          onClick={() => setSelectedProductIds([])}
                          fullWidth
                          sx={{ mb: 2 }}
                        >
                          Očisti izbor
                        </Button>
                      )}

                      {!canProceed && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                          Molimo izaberite maksimum {maxProducts} proizvoda da
                          biste nastavili sa plaćanjem.
                        </Alert>
                      )}
                    </>
                  )}

                  {canProceed && (
                    <>
                      <Divider sx={{ my: 3 }} />
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
                          <ShoppingBag
                            style={{ width: '24px', height: '24px' }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="h4">
                            Ukupno za plaćanje
                          </Typography>
                          <Typography variant="caption">
                            Pregled porudzbine
                          </Typography>
                        </Box>
                      </Box>
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
                        Paket: <strong>{bundle.name}</strong> sa{' '}
                        <strong>{selectedProductIds.length} proizvod(a)</strong>{' '}
                        za promociju. Ukupna cena:{' '}
                        <strong>{bundle.priceRsd} RSD</strong>.
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
                        <PromoBundlePayInline
                          bundleId={
                            bundle.id as 'BASIC' | 'STANDARD' | 'PREMIUM'
                          }
                          productIds={selectedProductIds}
                        />
                        <PromoBundlePayCardInline
                          bundleId={
                            bundle.id as 'BASIC' | 'STANDARD' | 'PREMIUM'
                          }
                          productIds={selectedProductIds}
                        />
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })()}
      </Box>
    </Box>
  );
};
