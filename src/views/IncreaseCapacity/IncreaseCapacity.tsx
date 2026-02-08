import { AppBreadcrumbs, MetaTags } from '@green-world/components';
import UserContext from '@green-world/context/UserContext';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  useTheme
} from '@mui/material';
import { ArrowLeft, Check, Info, Package, TrendingUp } from 'lucide-react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';

import { IncreaseCapacityPayCardInline } from './IncreaseCapacityPayCardInline';
import { IncreaseCapacityPayInline } from './IncreaseCapacityPayInline';

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
    priceRsd: 1200,
    description: 'Za manje prodavnice'
  },
  {
    id: '50',
    name: '50 mesta',
    places: 50,
    priceRsd: 2300,
    description: 'Najpopularniji izbor',
    popular: true
  },
  {
    id: '100',
    name: '100 mesta',
    places: 100,
    priceRsd: 4500,
    description: 'Najpovoljnije po mestu'
  }
];

const pages = [
  { label: 'Početna', route: '/' },
  { label: 'Povećaj kapacitet Shopa', route: '/increase-capacity' }
];

export const IncreaseCapacity = () => {
  const theme = useTheme();
  const navigate = useNavigate();
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

  const canPay = user?._id;

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
          title="Povećaj kapacitet Shopa | Zeleni svet"
          description="Proširite kapacitet vaše prodavnice za više proizvoda. Informacije o povećanju kapaciteta na Zelenom svetu."
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
            Morate biti ulogovani da biste kupili povećanje kapaciteta.{' '}
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
        title="Povećaj kapacitet Shopa | Zeleni svet"
        description="Proširite kapacitet vaše prodavnice za više proizvoda. Izaberite broj mesta i platite. 50 RSD po mestu."
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
          <TrendingUp color={theme.palette.success.main} size={28} />
          Povećaj kapacitet Shopa
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
              Šta dobijate?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Povećanjem kapaciteta dobijate dodatna mesta za proizvode u vašoj
              prodavnici. Izaberite koliko mesta želite da dodate (minimum 1).
              To znači da možete dodati više proizvoda i proširiti svoju ponudu.
            </Typography>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
            >
              <Package size={20} />
              Trenutni kapacitet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Vaš trenutni kapacitet:{' '}
              <strong>{user?.maxShopProducts || 0}</strong> proizvoda. Nakon
              kupovine, kapacitet će biti:{' '}
              <strong>{(user?.maxShopProducts || 0) + places}</strong>{' '}
              proizvoda.
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
              Izaberite paket ispod (povoljnije više mesta). Plaćanje putem
              PayPal-a ili kartice (iznos u EUR po trenutnom kursu).
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
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
          {CAPACITY_PACKAGES.map((pkg) => (
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

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Ukupno za plaćanje
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {selectedPackage.name} = <strong>{totalRsd} RSD</strong>
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
                  <IncreaseCapacityPayInline places={places} />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Debitna ili kreditna kartica
                  </Typography>
                  <IncreaseCapacityPayCardInline
                    places={places}
                    onCardPaymentClick={() => setIsCardPaymentActive(true)}
                    onCancel={() => setIsCardPaymentActive(false)}
                  />
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
