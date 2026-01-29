import { Box, Typography, Chip, useTheme } from '@mui/material';
import { Sparkles, Store, TrendingUp, Package, Crown, Zap } from 'lucide-react';

import { PromotionCard } from '../PromotionCard';

export const PromotionSection = () => {
  const theme = useTheme();
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
          badgeLabel="Uskoro"
          // badgeLabel="Novo"
          variant="success"
        />

        <PromotionCard
          icon={Store}
          title="Promoviši Prodavnicu"
          description="Povećajte vidljivost vaše prodavnice i privucite nove kupce"
          actionLabel="Saznaj više"
          badgeLabel="Uskoro"
          // badgeLabel="Popularno"
          variant="warning"
        />

        <PromotionCard
          icon={TrendingUp}
          title="Povećaj Kapacitet Shopa"
          description="Proširite kapacitet vaše prodavnice za više proizvoda"
          actionLabel="Saznaj više"
          badgeLabel="Uskoro"
          variant="success"
        />

        <PromotionCard
          icon={Package}
          title="Promotivni Paketi"
          description="Ekskluzivni paketi sa najboljim ponudama za vašu prodavnicu"
          actionLabel="Saznaj više"
          badgeLabel="Uskoro"
          // badgeLabel="Uštedi 30%"
          variant="warning"
        />
      </Box>
    </Box>
  );
};
