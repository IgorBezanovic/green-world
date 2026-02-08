import UserContext from '@green-world/context/UserContext';
import { useAllUserProducts } from '@green-world/hooks/useAllUserProducts';
import type { PaymentTypePromo } from '@green-world/hooks/usePayPalDonation';
import { Product } from '@green-world/utils/types';
import { Box, Typography, Chip, useTheme } from '@mui/material';
import { Sparkles, Store, TrendingUp, Package, Crown, Zap } from 'lucide-react';
import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { PromotionCard } from '../PromotionCard';
import { PromotionPayPalDialog } from './PromotionPayPalDialog';

export const PromotionSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<PaymentTypePromo | null>(null);
  const { data: products = [] } = useAllUserProducts();
  const promotedProductsCount = useMemo(
    () =>
      products.filter(
        (p: Product) => p.promotedAt != null && p.promotedUntil != null
      ).length,
    [products]
  );
  const { user } = useContext(UserContext);

  const shopPromotionDaysLeft = useMemo(() => {
    const userWithPromotion = user as typeof user & {
      shopPromotedUntil?: string | Date | null;
    };
    if (!userWithPromotion?.shopPromotedUntil) return 0;

    const promotedUntil = new Date(userWithPromotion.shopPromotedUntil);
    const now = new Date();

    if (promotedUntil < now) return 0;

    const diffTime = promotedUntil.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [user]);

  const freeCapacityPercentage = useMemo(() => {
    if (!user?.maxShopProducts || user.maxShopProducts === 0) return 0;
    const freePlaces = user.maxShopProducts - (user.numberOfProducts || 0);
    const percentage = (freePlaces / user.maxShopProducts) * 100;
    return Math.max(0, Math.round(percentage));
  }, [user?.maxShopProducts, user?.numberOfProducts]);

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
          actionLabel="Kupi promociju"
          badgeLabel={`${promotedProductsCount} proizvoda`}
          variant="success"
          onActionClick={() => navigate('/promote-product')}
        />

        <PromotionCard
          icon={Store}
          title="Promoviši Prodavnicu"
          description="Povećajte vidljivost vaše prodavnice i privucite nove kupce"
          actionLabel="Kupi promociju"
          badgeLabel={`${shopPromotionDaysLeft} dana`}
          variant="warning"
          onActionClick={() => navigate('/promote-shop')}
        />

        <PromotionCard
          icon={TrendingUp}
          title="Povećaj Kapacitet Shopa"
          description="Proširite kapacitet vaše prodavnice za više proizvoda"
          actionLabel="Kupi promociju"
          badgeLabel={`${freeCapacityPercentage}% slobodno`}
          variant="success"
          onActionClick={() => navigate('/increase-capacity')}
        />

        <PromotionCard
          icon={Package}
          title="Promotivni Paketi"
          description="Ekskluzivni paketi: +25 mesta, 5 dana promocija prodavnice i 5 proizvoda"
          actionLabel="Kupi paket"
          badgeLabel="Uštedi"
          variant="warning"
          onActionClick={() => navigate('/promo-bundle')}
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
