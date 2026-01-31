import type { PaymentTypePromo } from '@green-world/hooks/usePayPalDonation';
import { Box, Typography, Chip, useTheme } from '@mui/material';
import { Sparkles, Store, TrendingUp, Package, Crown, Zap } from 'lucide-react';
import { useState } from 'react';

import { PromotionCard } from '../PromotionCard';
import { PromotionPayPalDialog } from './PromotionPayPalDialog';

export const PromotionSection = () => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<PaymentTypePromo | null>(null);

  const openPromoDialog = (type: PaymentTypePromo) => () => {
    setDialogType(type);
    setDialogOpen(true);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 4,
          [theme.breakpoints.down('md')]: {
            flexDirection: 'column'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Zap />
          <Typography variant="h5" fontWeight={700}>
            Promocije i Nadogradnje
          </Typography>
        </Box>
        <Chip
          icon={<Crown size={14} />}
          label="Premium"
          size="small"
          color="warning"
          sx={{ fontWeight: 600, color: 'common.white', p: '2px 8px' }}
        />
      </Box>

      <Box
        component="section"
        sx={{
          display: 'grid',
          gap: 3,
          maxWidth: '1400px',
          width: '100%',
          mx: 'auto',
          gridTemplateColumns: 'repeat(1, 1fr)',
          '@media (min-width: 600px)': {
            gridTemplateColumns: 'repeat(2, 1fr)'
          },
          '@media (min-width: 900px)': {
            gridTemplateColumns: 'repeat(4, 1fr)'
          }
        }}
      >
        <PromotionCard
          icon={Sparkles}
          title="Promoviši Proizvode"
          description="Istaknite svoje proizvode na vrhu pretrage i privucite više kupaca"
          actionLabel="Saznaj više"
          badgeLabel="Novo"
          variant="success"
          onActionClick={openPromoDialog('PROMOTE_PRODUCT')}
        />

        <PromotionCard
          icon={Store}
          title="Promoviši Prodavnicu"
          description="Povećajte vidljivost vaše prodavnice i privucite nove kupce"
          actionLabel="Saznaj više"
          badgeLabel="Novo"
          variant="warning"
          onActionClick={openPromoDialog('PROMOTE_SHOP')}
        />

        <PromotionCard
          icon={TrendingUp}
          title="Povećaj Kapacitet Shopa"
          description="Proširite kapacitet vaše prodavnice za više proizvoda"
          actionLabel="Saznaj više"
          badgeLabel="Novo"
          variant="success"
          onActionClick={openPromoDialog('INCREASE_CAPACITY')}
        />

        <PromotionCard
          icon={Package}
          title="Promotivni Paketi"
          description="Ekskluzivni paketi sa najboljim ponudama za vašu prodavnicu"
          actionLabel="Saznaj više"
          badgeLabel="Uštedi 30%"
          variant="warning"
          onActionClick={openPromoDialog('PROMO_BUNDLE')}
        />
      </Box>

      {dialogType && (
        <PromotionPayPalDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setDialogType(null);
          }}
          promotionType={dialogType}
        />
      )}
    </Box>
  );
};
