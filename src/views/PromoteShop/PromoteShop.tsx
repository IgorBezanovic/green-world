import { AppBreadcrumbs, MetaTags } from '@green-world/components';
import UserContext from '@green-world/context/UserContext';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { ArrowLeft, Info, MapPin, Store, TrendingUp } from 'lucide-react';
import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { PromoteShopPayCardInline } from './PromoteShopPayCardInline';
import { PromoteShopPayInline } from './PromoteShopPayInline';

const PRICE_PER_DAY_RSD = 50;

const pages = [
  { label: 'Početna', route: '/' },
  { label: 'Promocija prodavnice', route: '/promote-shop' }
];

export const PromoteShop = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [days, setDays] = useState<number>(5);
  const [isCardPaymentActive, setIsCardPaymentActive] = useState(false);

  const totalRsd = useMemo(
    () => (days > 0 ? PRICE_PER_DAY_RSD * days : 0),
    [days]
  );

  const canPay = user?._id && days >= 1 && days <= 365;

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
              <strong>{PRICE_PER_DAY_RSD} RSD</strong> po danu. Izaberite broj
              dana ispod, pa platite putem PayPal-a (iznos u EUR po trenutnom
              kursu).
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Izaberite trajanje promocije
        </Typography>

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
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {days} dana × {PRICE_PER_DAY_RSD} RSD ={' '}
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
