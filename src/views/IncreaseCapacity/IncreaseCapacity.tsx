import { AppBreadcrumbs, MetaTags } from '@green-world/components';
import UserContext from '@green-world/context/UserContext';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Slider,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { ArrowLeft, Info, Package, TrendingUp } from 'lucide-react';
import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { IncreaseCapacityPayCardInline } from './IncreaseCapacityPayCardInline';
import { IncreaseCapacityPayInline } from './IncreaseCapacityPayInline';

const PRICE_PER_PLACE_RSD = 50;

const pages = [
  { label: 'Početna', route: '/' },
  { label: 'Povećaj kapacitet Shopa', route: '/increase-capacity' }
];

export const IncreaseCapacity = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [places, setPlaces] = useState<number>(25);
  const [isCardPaymentActive, setIsCardPaymentActive] = useState(false);

  const totalRsd = useMemo(
    () => (places > 0 ? PRICE_PER_PLACE_RSD * places : 0),
    [places]
  );

  const canPay = user?._id && places >= 1;

  const handlePlacesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    if (!Number.isNaN(v) && v >= 1 && v <= 1000) setPlaces(v);
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setPlaces(newValue as number);
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
              <strong>{PRICE_PER_PLACE_RSD} RSD</strong> po mestu. Izaberite
              broj mesta ispod, pa platite putem PayPal-a (iznos u EUR po
              trenutnom kursu).
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Izaberite broj mesta
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Slider
              value={places}
              onChange={handleSliderChange}
              min={1}
              max={100}
              step={1}
              disabled={isCardPaymentActive}
              marks={[
                { value: 1, label: '1' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
                { value: 75, label: '75' },
                { value: 100, label: '100' }
              ]}
              valueLabelDisplay="auto"
              sx={{ mb: 2 }}
            />
          </Box>
          <TextField
            type="number"
            label="Broj mesta"
            value={places}
            onChange={handlePlacesChange}
            disabled={isCardPaymentActive}
            inputProps={{ min: 1, max: 1000 }}
            helperText="Unesite broj mesta (1-1000) ili koristite slider"
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Box>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Ukupno za plaćanje
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {places} mesta × {PRICE_PER_PLACE_RSD} RSD ={' '}
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
