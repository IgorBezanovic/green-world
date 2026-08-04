import { useFeaturedProducts } from '@green-world/hooks/useFeaturedProducts';
import { ProductPreview } from '@green-world/hooks/useHomeItems';
import { Box, Skeleton } from '@mui/material';

import { FeaturedProduct } from './FeaturedProduct';

export const FeaturedProducts = () => {
  const { data, isLoading } = useFeaturedProducts();
  const hasProducts = (data?.length ?? 0) > 0;

  if (isLoading) {
    return (
      <Box sx={{ mb: 8 }}>
        <Skeleton variant="rounded" height={420} />
      </Box>
    );
  }

  if (!hasProducts) return null;

  return (
    <Box sx={{ my: 4 }}>
      <Box
        sx={(theme) => ({
          display: 'grid',
          gap: theme.spacing(3),
          maxWidth: '1400px',
          marginX: 'auto',
          gridTemplateColumns: 'repeat(1, 1fr)',
          [theme.breakpoints.up('xs')]: {
            gridTemplateColumns: 'repeat(2, 1fr)'
          },
          [theme.breakpoints.up('md')]: {
            gridTemplateColumns: 'repeat(4, 1fr)'
          }
        })}
      >
        {data?.map((product: ProductPreview) => (
          <FeaturedProduct key={product._id} product={product} />
        ))}
      </Box>
    </Box>
  );
};
