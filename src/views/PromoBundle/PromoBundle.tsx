import { AppBreadcrumbs, MetaTags } from '@green-world/components';
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
  Package,
  Sparkles,
  Store,
  TrendingUp,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { PromoBundlePayCardInline } from './components/PromoBundlePayCardInline';
import { PromoBundlePayInline } from './components/PromoBundlePayInline';

const BUNDLES = [
  {
    id: 'BASIC',
    name: 'Osnovni Paket',
    priceRsd: 5250,
    description: 'Idealno za početak',
    features: {
      productDays: 7,
      numProducts: 5,
      shopDays: 7,
      capacityPlaces: 25
    }
  },
  {
    id: 'STANDARD',
    name: 'Standardni Paket',
    priceRsd: 12320,
    description: 'Najpopularniji izbor',
    popular: true,
    features: {
      productDays: 14,
      numProducts: 10,
      shopDays: 14,
      capacityPlaces: 50
    }
  },
  {
    id: 'PREMIUM',
    name: 'Premium Paket',
    priceRsd: 31360,
    description: 'Maksimalna vidljivost',
    features: {
      productDays: 28,
      numProducts: 20,
      shopDays: 25,
      capacityPlaces: 100
    }
  }
];

const pages = [
  { label: 'Početna', route: '/' },
  { label: 'Promotivni Paketi', route: '/promo-bundle' }
];

export const PromoBundle = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: userProducts = [], isLoading: productsLoading } =
    useAllUserProducts();
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
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
              variant="h6"
              fontWeight={600}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
            >
              <Info size={20} />
              Šta dobijate u paketu?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Svaki paket uključuje <strong>kombinaciju tri promocije</strong>:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <Sparkles size={18} color={theme.palette.success.main} />
                <Typography variant="body2" color="text.secondary">
                  <strong>Promocija proizvoda</strong> — vaši proizvodi se
                  pojavljuju na vrhu pretrage
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <Store size={18} color={theme.palette.warning.main} />
                <Typography variant="body2" color="text.secondary">
                  <strong>Promocija prodavnice</strong> — vaša prodavnica se
                  ističe u rezultatima pretrage
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                <TrendingUp size={18} color={theme.palette.success.main} />
                <Typography variant="body2" color="text.secondary">
                  <strong>Povećanje kapaciteta</strong> — dodatna mesta za više
                  proizvoda
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1,
                mt: 3
              }}
            >
              <TrendingUp size={20} />
              Zašto paketi?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Paketi su <strong>povoljniji</strong> od kupovine pojedinačnih
              promocija. Uštedite novac dok maksimalno povećavate vidljivost
              svoje prodavnice i proizvoda.
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
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
                borderColor:
                  selectedBundle === bundle.id
                    ? 'primary.main'
                    : bundle.popular
                      ? 'warning.main'
                      : 'divider',
                borderWidth: bundle.popular ? 2 : 1,
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
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
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                  {bundle.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {bundle.description}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="primary.main"
                    sx={{ mb: 0.5 }}
                  >
                    {bundle.priceRsd} RSD
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Fiksna cena (u EUR po trenutnom kursu)
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Check size={16} color={theme.palette.success.main} />
                    <Typography variant="body2">
                      {bundle.features.numProducts} proizvoda ×{' '}
                      {bundle.features.productDays} dana
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Check size={16} color={theme.palette.success.main} />
                    <Typography variant="body2">
                      Prodavnica {bundle.features.shopDays} dana
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Check size={16} color={theme.palette.success.main} />
                    <Typography variant="body2">
                      +{bundle.features.capacityPlaces} mesta kapaciteta
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
            const canProceed = selectedProductIds.length === maxProducts;

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
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    Izaberite proizvode za promociju
                  </Typography>
                  <Typography
                    variant="body2"
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
                        <InputLabel id="bundle-products-label">
                          Proizvodi za promociju ({selectedProductIds.length}/
                          {maxProducts})
                        </InputLabel>
                        <Select
                          labelId="bundle-products-label"
                          label={`Proizvodi za promociju (${selectedProductIds.length}/${maxProducts})`}
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
                              <ListItemText
                                primary={p.title || 'Bez naslova'}
                                secondary={
                                  p.price ? `${p.price} RSD` : undefined
                                }
                              />
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          Izaberite tačno {maxProducts} proizvoda za promociju
                        </FormHelperText>
                      </FormControl>

                      {isMobile && selectedProductIds.length > 0 && (
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<X size={18} />}
                          onClick={() => setSelectedProductIds([])}
                          fullWidth
                          sx={{ mb: 2 }}
                        >
                          Očisti izbor
                        </Button>
                      )}

                      {!canProceed && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                          Molimo izaberite tačno {maxProducts} proizvoda da
                          biste nastavili sa plaćanjem.
                        </Alert>
                      )}
                    </>
                  )}

                  {canProceed && (
                    <>
                      <Divider sx={{ my: 3 }} />
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Plaćanje
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
