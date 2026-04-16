import { Box, Button, ButtonProps, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { LazySection } from '../LazySection';
import { PageTitle } from '../PageTitle';

type ItemSectionProps = {
  title: string;
  subTitle?: string;
  children: React.ReactNode;
  viewAllLabel?: string;
  onViewAll?: () => void;
  buttonColor?: ButtonProps['color'];
};

export const ItemSection = ({
  title,
  subTitle,
  children,
  viewAllLabel,
  onViewAll,
  buttonColor
}: ItemSectionProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

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
        {subTitle && (
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
        )}
      </Box>
      {children}
      {viewAllLabel && onViewAll && (
        <Button
          variant="contained"
          color={buttonColor}
          size="large"
          onClick={onViewAll}
          sx={{ textTransform: 'uppercase', px: 4 }}
        >
          {viewAllLabel}
        </Button>
      )}
    </LazySection>
  );
};
