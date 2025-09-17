import { Product } from '@green-world/utils/types';
import { Box, Typography } from '@mui/material';

import { HomeCarousel, LazySection } from '../../components';

type SectionProps = {
  title: string;
  subTitle?: string;
  products?: Product[] | undefined;
  isLoading: boolean;
};

export const ProductSection = ({
  title,
  subTitle,
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
            color: 'secondary.main',
            fontFamily: 'Ephesis'
          })}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{ maxWidth: '42rem', marginX: 'auto', color: 'text.primary' }}
        >
          {subTitle}
        </Typography>
      </Box>
      <HomeCarousel products={products} isLoading={isLoading} />
    </LazySection>
  );
};
