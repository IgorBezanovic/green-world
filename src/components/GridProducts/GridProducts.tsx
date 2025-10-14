import { ProductPreview } from '@green-world/hooks/useHomeProducts';
import { Product } from '@green-world/utils/types';
import { Box } from '@mui/material';

import { ProductCard } from '../ProductCard';

interface GridProductsProps {
  products: Product[] | ProductPreview[];
}

export const GridProducts = ({ products }: GridProductsProps) => {
  return (
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
      {products.map((product, index: number) => (
        <ProductCard product={product} isHero={index === 0} key={product._id} />
      ))}
    </Box>
  );
};
