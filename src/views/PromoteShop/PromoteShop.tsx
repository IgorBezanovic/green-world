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
import {
  ArrowLeft,
  Check,
  Info,
  MapPin,
  Store,
  TrendingUp
} from 'lucide-react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';

import { PromoteShopPayCardInline } from './PromoteShopPayCardInline';
import { PromoteShopPayInline } from './PromoteShopPayInline';

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
    priceRsd: 350,
    description: 'Kratka promocija'
  },
  {
    id: '14',
    name: '14 dana',
    days: 14,
    priceRsd: 650,
    description: 'Dve nedelje',
    popular: true
  },
  {
    id: '28',
    name: '28 dana',
    days: 28,
    priceRsd: 1200,
    description: 'Najpovoljnije po danu'
  }
];

const pages = [
  { label: 'Početna', route: '/' },
  { label: 'Promocija prodavnice', route: '/promote-shop' }
];

export const PromoteShop = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    SHOP_PACKAGES[0].id
  );
  const [isCardPaymentActive, setIsCardPaymentActive] = useState(false);

  const selectedPackage =
    SHOP_PACKAGES.find((p) => p.id === selectedPackageId) ?? SHOP_PACKAGES[0];
  const days = selectedPackage.days;
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
          title="Promocija prodavnice | Zeleni svet"
          description="Istaknite svoju prodavnicu na vrhu pretrage. Informacije o promociji prodavnice na Zelenom svetu."
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
            Morate biti ulogovani da biste kupili promociju prodavnice.{' '}
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
        title="Promocija prodavnice | Zeleni svet"
        description="Istaknite svoju prodavnicu na vrhu pretrage. Izaberite broj dana i platite. 50 RSD po danu."
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
          <Store color={theme.palette.warning.main} size={28} />
          Promocija prodavnice
        </Typography>

        <Card
          variant="outlined"
          sx={{
            borderColor: 'warning.light',
            bgcolor: 'warning.light',
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
              Promovisana prodavnica pojavljuje se na{' '}
              <strong>vrhu rezultata pretrage prodavnica</strong> i na početnoj
              stranici u sekciji istaknutih prodavnica. Veća vidljivost znači
              više poseta i veću šansu za prodaju.
            </Typography>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
            >
              <MapPin size={20} />
              Gde će prodavnica biti promovisana?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Na <strong>stranici pretrage prodavnica (shops)</strong>, kao i u{' '}
              <strong>Featured</strong> sekciji na početnoj stranici — u
              zavisnosti od podešavanja platforme.
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
              Izaberite paket trajanja ispod (povoljnije više dana). Plaćanje
              putem PayPal-a ili kartice (iznos u EUR po trenutnom kursu).
            </Typography>
          </CardContent>
        </Card>

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
          {SHOP_PACKAGES.map((pkg) => (
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
                    ukupno ({pkg.days} dana)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Check
                    size={16}
                    color={theme.palette.success.main as string}
                  />
                  <Typography variant="body2">
                    {pkg.days} dana promocije prodavnice
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  {Math.round(pkg.priceRsd / pkg.days)} RSD/dan
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
                  <PromoteShopPayInline days={days} totalRsd={totalRsd} />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Debitna ili kreditna kartica
                  </Typography>
                  <PromoteShopPayCardInline
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
      </Box>
    </Box>
  );
};
