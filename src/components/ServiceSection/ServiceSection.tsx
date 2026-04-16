import { ServicePreview } from '@green-world/hooks/useHomeItems';
import type { ServiceListing } from '@green-world/utils/types';
import { Box, Button, Skeleton, Typography } from '@mui/material';

import { ServiceListingCard } from '../ServiceListingCard';

type ServiceSectionProps = {
  title: string;
  subTitle?: string;
  services?: ServicePreview[];
  isLoading?: boolean;
  searchAllLabel: string;
  onSearchAll: () => void;
  t: (key: string) => string;
};

export const ServiceSection = ({
  title,
  subTitle,
  services,
  isLoading,
  searchAllLabel,
  onSearchAll,
  t
}: ServiceSectionProps) => {
  return (
    <>
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
        <Typography
          variant="h2"
          sx={(theme) => ({
            fontSize: '3.75rem !important',
            [theme.breakpoints.down('md')]: {
              fontSize: '3rem !important'
            },
            color: 'secondary.main',
            fontFamily: 'var(--font-ephesis, Ephesis), cursive',
            fontWeight: 400
          })}
        >
          {title}
        </Typography>
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

      {isLoading ? (
        <Box
          component="section"
          sx={(theme) => ({
            width: '100%',
            display: 'grid',
            gap: '24px',
            gridAutoRows: '1fr',
            gridTemplateColumns: 'repeat(1, 1fr)',
            [theme.breakpoints.up('xs')]: {
              gridTemplateColumns: 'repeat(2, 1fr)'
            },
            [theme.breakpoints.up('md')]: {
              gridTemplateColumns: 'repeat(3, 1fr)'
            },
            [theme.breakpoints.up('lg')]: {
              gridTemplateColumns: 'repeat(4, 1fr)'
            }
          })}
        >
          {Array.from({ length: 8 }).map((_, idx) => (
            <Box key={idx}>
              <Skeleton
                variant="rectangular"
                sx={{ height: 200, mb: 1.5, borderRadius: 1 }}
              />
              <Skeleton
                variant="text"
                sx={{ fontSize: '0.875rem', width: '40%' }}
              />
              <Skeleton variant="text" sx={{ fontSize: '1.1rem' }} />
              <Skeleton
                variant="text"
                sx={{ fontSize: '0.9rem', width: '75%' }}
              />
              <Skeleton
                variant="text"
                sx={{ fontSize: '0.9rem', width: '55%' }}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          component="section"
          sx={(theme) => ({
            width: '100%',
            display: 'grid',
            gap: '24px',
            gridAutoRows: '1fr',
            gridTemplateColumns: services?.length ? 'repeat(1, 1fr)' : 'none',
            [theme.breakpoints.up('xs')]: {
              gridTemplateColumns: services?.length ? 'repeat(2, 1fr)' : 'none'
            },
            [theme.breakpoints.up('md')]: {
              gridTemplateColumns: services?.length ? 'repeat(3, 1fr)' : 'none'
            },
            [theme.breakpoints.up('lg')]: {
              gridTemplateColumns: services?.length ? 'repeat(4, 1fr)' : 'none'
            }
          })}
        >
          {services?.map((service) => {
            const serviceImages = Array.isArray(service.images)
              ? service.images
              : service.images
                ? [service.images]
                : [];
            const provider =
              service.providerId && typeof service.providerId !== 'string'
                ? service.providerId
                : undefined;
            const normalizedService: ServiceListing = {
              _id: service._id,
              providerId: {
                _id: provider?._id || '',
                name: provider?.name || t('service.user'),
                lastname: provider?.lastname || ''
              },
              title: service.title,
              description: service.description,
              services: service.services || [],
              images: serviceImages,
              portfolioLinks: [],
              priceType: service.priceType,
              priceFrom: service.priceFrom,
              priceTo: service.priceTo,
              location: service.location || ''
            };

            return (
              <Box key={service._id} sx={{ width: '100%', minWidth: 0 }}>
                <ServiceListingCard service={normalizedService} />
              </Box>
            );
          })}
        </Box>
      )}

      <Button
        variant="contained"
        color="secondary"
        size="large"
        sx={{
          textTransform: 'uppercase',
          padding: 2,
          marginY: 2
        }}
        onClick={onSearchAll}
      >
        {searchAllLabel}
      </Button>
    </>
  );
};
