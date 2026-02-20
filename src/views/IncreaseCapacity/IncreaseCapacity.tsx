import { AppBreadcrumbs, MetaTags } from '@green-world/components';
import UserContext from '@green-world/context/UserContext';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import {
  Check,
  Info,
  Package,
  ShoppingBag,
  TrendingUp,
  HandCoins
} from 'lucide-react';
import { useContext, useState } from 'react';

import { IncreaseCapacityPayCardInline } from './components/IncreaseCapacityPayCardInline';
import { IncreaseCapacityPayInline } from './components/IncreaseCapacityPayInline';

const CAPACITY_PACKAGES: Array<{
  id: string;
  name: string;
  places: number;
  priceRsd: number;
  description: string;
  popular?: boolean;
}> = [
  {
    id: '25',
    name: '25 mesta',
    places: 25,
    priceRsd: 3000,
    description: 'Za manje prodavnice'
  },
  {
    id: '50',
    name: '50 mesta',
    places: 50,
    priceRsd: 5000,
    description: 'Najpopularniji izbor',
    popular: true
  },
  {
    id: '100',
    name: '100 mesta',
    places: 100,
    priceRsd: 8000,
    description: 'Najpovoljnije po mestu'
  }
];

const pages = [
  { label: 'Profil', route: '/profile' },
  { label: 'Povećaj kapacitet Shopa', route: '/increase-capacity' }
];

export const IncreaseCapacity = () => {
  const theme = useTheme();
  const { user } = useContext(UserContext);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    CAPACITY_PACKAGES[0].id
  );
  const [isCardPaymentActive, setIsCardPaymentActive] = useState(false);

  const selectedPackage =
    CAPACITY_PACKAGES.find((p) => p.id === selectedPackageId) ??
    CAPACITY_PACKAGES[0];
  const places = selectedPackage.places;
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
        title="Povećaj kapacitet Shopa | Zeleni svet"
        description="Proširite kapacitet vaše prodavnice za više proizvoda. Izaberite broj mesta i platite."
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
          <TrendingUp color={theme.palette.success.main} size={28} />
          Povećaj kapacitet prodavnice
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
              Šta dobijate?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Povećanjem kapaciteta dobijate dodatna mesta za proizvode u vašoj
              prodavnici. Izaberite koliko mesta želite da dodate. To znači da
              možete dodati više proizvoda i proširiti svoju ponudu.
            </Typography>
            <Typography
              variant="h4"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
            >
              <Package style={{ width: '24px', height: '24px' }} />
              Trenutni kapacitet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Vaš trenutni kapacitet:{' '}
              <strong>{user?.maxShopProducts || 25}</strong> proizvoda. Nakon
              kupovine, kapacitet će biti:{' '}
              <strong>{(user?.maxShopProducts || 25) + places}</strong>{' '}
              proizvoda.
            </Typography>
            <Typography
              variant="h4"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
            >
              <HandCoins style={{ width: '24px', height: '24px' }} />
              Cena
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Izaberite paket ispod (povoljnije više mesta). Plaćanje putem
              PayPal-a ili kartice (iznos je prkazan u EUR zbog platnog
              providera, plaćate dinarskom karticom).
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h4" fontWeight={600} sx={{ mb: 2 }}>
          Izaberite paket
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
          {CAPACITY_PACKAGES?.map((pkg) => (
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
                  Najpopularniji
                </Box>
              )}
              <CardContent>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
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
                    {pkg.priceRsd} RSD
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ukupno ({pkg.places} mesta)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Check
                    size={16}
                    color={theme.palette.success.main as string}
                  />
                  <Typography variant="body2">
                    +{pkg.places} mesta kapaciteta
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  {Math.round(pkg.priceRsd / pkg.places)} RSD/mesto
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
              Ukupno za plaćanje: {selectedPackage.name} ={' '}
              <strong>{totalRsd},00 RSD</strong>
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
              <IncreaseCapacityPayInline places={places} />
              <IncreaseCapacityPayCardInline
                places={places}
                onCardPaymentClick={() => setIsCardPaymentActive(true)}
                onCancel={() => setIsCardPaymentActive(false)}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
