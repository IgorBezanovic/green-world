import { ServicePreview } from '@green-world/hooks/useHomeProducts';
import {
  formatImageUrl,
  getPlainTextFromHtml
} from '@green-world/utils/helpers';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Skeleton,
  Typography
} from '@mui/material';
import { MapPin } from 'lucide-react';

type ServiceSectionProps = {
  title: string;
  subTitle?: string;
  services?: ServicePreview[];
  isLoading?: boolean;
  searchAllLabel: string;
  onSearchAll: () => void;
  onOpenService: (serviceId: string) => void;
  t: (key: string) => string;
};

export const ServiceSection = ({
  title,
  subTitle,
  services,
  isLoading,
  searchAllLabel,
  onSearchAll,
  onOpenService,
  t
}: ServiceSectionProps) => {
  return (
    <>
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

      {isLoading ? (
        <Box
          component="section"
          sx={(theme) => ({
            width: '100%',
            display: 'grid',
            gap: '24px',
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
            const serviceImage = Array.isArray(service.images)
              ? service.images[0]
              : service.images;
            const provider =
              service.providerId && typeof service.providerId !== 'string'
                ? service.providerId
                : undefined;
            const providerName =
              provider?.name || provider?.lastname
                ? `${provider?.name || ''} ${provider?.lastname || ''}`.trim()
                : t('service.user');

            return (
              <Card
                key={service._id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  textDecoration: 'none',
                  flexGrow: 1,
                  cursor: 'pointer'
                }}
                onClick={() => onOpenService(service._id)}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: 200,
                    minHeight: 200,
                    bgcolor: 'grey.100',
                    overflow: 'hidden'
                  }}
                >
                  {serviceImage ? (
                    <CardMedia
                      component="img"
                      image={formatImageUrl(String(serviceImage), 55)}
                      alt={service.title}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : null}
                  <Chip
                    label={
                      service.priceType === 'hourly'
                        ? t('service.hourly')
                        : service.priceType === 'fixed'
                          ? t('service.fixed')
                          : t('service.negotiable')
                    }
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>

                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                      color: 'text.secondary'
                    }}
                  >
                    <MapPin size={16} />
                    <Typography variant="body2">
                      {service.location || t('service.notSpecified')}
                    </Typography>
                  </Box>

                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
                    fontWeight="bold"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      color: 'text.primary'
                    }}
                  >
                    {service.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {getPlainTextFromHtml(service.description || '')}
                  </Typography>

                  <Box
                    sx={{
                      mt: 'auto',
                      pt: 2,
                      borderTop: '1px solid #f0f0f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      color="text.primary"
                    >
                      {providerName}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="primary.main"
                    >
                      {service.priceFrom
                        ? `${t('service.fromPricePrefix')} ${service.priceFrom} ${t('service.currency')}`
                        : t('service.onQuery')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      <Button
        variant="contained"
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
