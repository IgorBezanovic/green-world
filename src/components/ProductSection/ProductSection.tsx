import { ProductPreview } from '@green-world/hooks/useHomeItems';
import { Product } from '@green-world/utils/types';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { GridProducts, LazySection, PageTitle } from '../../components';

type SectionProps = {
  title: string;
  subTitle?: string;
  products?: Product[] | ProductPreview[] | undefined;
};

export const ProductSection = ({ title, subTitle, products }: SectionProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !products || products.length === 0) return null;

  return (
    <LazySection>
      <Box
        sx={(theme) => ({
          textAlign: 'center',
          mt: 6,
          mb: 0,
          [theme.breakpoints.down('md')]: {
            mt: 4,
            mb: 0
          }
        })}
      >
        <PageTitle component="h2">{title}</PageTitle>
        <Typography
          variant="body1"
          sx={{
            maxWidth: '42rem',
            marginX: 'auto',
            color: 'text.primary',
            fontSize: '1.2rem',
            lineHeight: 1.6
          }}
        >
          {subTitle}
        </Typography>
      </Box>
      <GridProducts products={products} />
    </LazySection>
  );
};
