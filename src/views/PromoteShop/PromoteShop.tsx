import { AppBreadcrumbs, MetaTags } from '@green-world/components';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import {
  Check,
  HandCoins,
  MapPin,
  Store,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import { useState } from 'react';

import { PromoteShopPayCardInline } from './components/PromoteShopPayCardInline';
import { PromoteShopPayInline } from './components/PromoteShopPayInline';

const SHOP_PACKAGES: Array<{
  id: string;
  name: string;
  days: number;
  priceRsd: number;
  description: string;
  popular?: boolean;
}> = [
  {
    id: '7',
    name: '7 dana',
    days: 7,
    priceRsd: 1500,
    description: 'Kratka promocija'
  },
  {
    id: '14',
    name: '14 dana',
    days: 14,
    priceRsd: 2600,
    description: 'Dve nedelje'
  },
  {
    id: '28',
    name: '28 dana',
    days: 28,
    priceRsd: 4800,
    description: 'Najpovoljnije po danu',
    popular: true
  }
];

const pages = [
  { label: 'Profil', route: '/profile' },
  { label: 'Promocija prodavnice', route: '/promote-shop' }
];

export const PromoteShop = () => {
  const theme = useTheme();

  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    SHOP_PACKAGES[0].id
  );
  const [isCardPaymentActive, setIsCardPaymentActive] = useState(false);

  const selectedPackage =
    SHOP_PACKAGES.find((p) => p.id === selectedPackageId) ?? SHOP_PACKAGES[0];
  const days = selectedPackage.days;
  const totalRsd = selectedPackage.priceRsd;

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags
        title="Promocija prodavnice | Zeleni svet"
        description="Istaknite svoju prodavnicu na vrhu pretrage. Izaberite broj dana i platite. 50 RSD po danu."
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
          variant="h4"
          fontWeight={700}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 3 }}
        >
          <Store color={theme.palette.warning.main} size={28} />
          Promocija prodavnice
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
              Promocija prodavnice povećava vašu vidljivost i konkurentsku
              prednost na platformi. Istaknuta prodavnica dobija prioritetno
              prikazivanje u odnosu na ostale, čime se značajno povećava broj
              pregleda, klikova i potencijalnih kupaca. Veća vidljivost direktno
              utiče na rast poverenja i veću šansu za ostvarivanje prodaje.
            </Typography>
            <Typography
              variant="h4"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
            >
              <MapPin style={{ width: '24px', height: '24px' }} />
              Gde će prodavnica biti promovisana?
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }} color="text.secondary">
              <strong>Na vrhu rezultata pretrage prodavnica</strong> –
              prioritetno pozicioniranje u odnosu na ostale prodavnice.
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }} color="text.secondary">
              <strong>Na stranici svih prodavnica</strong> – istaknuto mesto pri
              vrhu svih prodavnica.
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }} color="text.secondary">
              <strong>U sekciji „Istaknute prodavnice“</strong> na početnoj
              stranici platforme.
            </Typography>
            <Typography
              variant="h4"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
            >
              <HandCoins style={{ width: '24px', height: '24px' }} />
              Cena
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Izaberite paket trajanja ispod (povoljnije više dana). Plaćanje je
              omogućeno putem <strong>PayPal-a</strong> ili platnih kartica.
              Iznos se obračunava u EUR prema važećem kursu u trenutku
              transakcije.
            </Typography>
          </CardContent>
        </Card>

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
          {SHOP_PACKAGES?.map((pkg) => (
            <Card
              key={pkg.id}
              variant="outlined"
              sx={{
                borderRadius: 2,
                border: '1px solid',
                background: 'linear-gradient(180deg, #F4FBF6 0%, #FFFFFF 100%)',
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
                  Najpovoljnije
                </Box>
              )}
              <CardContent>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
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
                    variant="h3"
                    fontWeight={700}
                    color="primary.main"
                    sx={{ mb: 0.5 }}
                  >
                    {pkg.priceRsd} RSD
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    ukupno ({pkg.days} dana)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Check
                    size={16}
                    color={theme.palette.success.main as string}
                  />
                  <Typography variant="body1">
                    {pkg.days} dana promocije prodavnice
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  {Math.round(pkg.priceRsd / pkg.days)} RSD/dan
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
                <Typography variant="caption">Pregled porudzbine</Typography>
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
              {selectedPackage.name} = <strong>{totalRsd} RSD</strong>
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
              <PromoteShopPayInline days={days} />
              <PromoteShopPayCardInline
                days={days}
                onCardPaymentClick={() => setIsCardPaymentActive(true)}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
