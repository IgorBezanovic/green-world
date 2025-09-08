import { Product } from '@green-world/utils/types';
import { Box, Typography } from '@mui/material';

import { HomeCarousel, LazySection } from '../../components';

type SectionProps = {
  title: string;
  products?: Product[] | undefined;
  isLoading: boolean;
};

export const ProductSection = ({
  title,
  products,
  isLoading
}: SectionProps) => {
  if (!products || products.length === 0) return null;

  return (
    <LazySection>
      <Box
        sx={(theme) => ({
          textAlign: 'center',
          my: 6,
          [theme.breakpoints.down('md')]: {
            my: 4
          }
        })}
      >
        <Typography
          variant="h2"
          sx={(theme) => ({
            fontSize: '3.75rem !important',
            [theme.breakpoints.down('md')]: {
              fontSize: '3rem !important'
            },
            color: 'custom.forestGreen',
            fontFamily: 'Ephesis'
          })}
        >
          {title}
        </Typography>
      </Box>
      <HomeCarousel products={products} isLoading={isLoading} />
    </LazySection>
  );
};
