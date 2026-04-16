import {
  formatImageUrl,
  getPlainTextFromHtml
} from '@green-world/utils/helpers';
import type { ServiceListing } from '@green-world/utils/types';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Tooltip,
  Typography
} from '@mui/material';
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

type ServiceListingCardProps = {
  service: ServiceListing;
};

export const ServiceListingCard = ({ service }: ServiceListingCardProps) => {
  const { t } = useTranslation();

  return (
    <Card
      component={Link}
      to={`/services/${service._id}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        minWidth: 0,
        textDecoration: 'none',
        flexGrow: 1
      }}
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
        {service.images?.[0] ? (
          <CardMedia
            component="img"
            image={formatImageUrl(service.images[0], 55)}
            alt={service.title}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
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
          flexDirection: 'column',
          pb: 2,
          '&:last-child': {
            pb: 2
          }
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

        <Tooltip title={service.title} arrow>
          <Typography
            gutterBottom
            variant="h3"
            component="h2"
            fontWeight={500}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              color: 'text.primary',
              minHeight: '1.4em'
            }}
          >
            {service.title}
          </Typography>
        </Tooltip>
        <Divider variant="fullWidth" />
        <Typography
          gutterBottom
          variant="body2"
          sx={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '4.5rem',
            paddingTop: '8px'
          }}
        >
          {getPlainTextFromHtml(service.description)}
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
          <Typography variant="body2" fontWeight={400} color="text.primary">
            {(service.providerId as any)?.name || t('service.user')}{' '}
            {(service.providerId as any)?.lastname || ''}
          </Typography>
          <Typography variant="body2" color="primary.dark">
            {service.priceFrom
              ? `${t('service.fromPricePrefix')} ${service.priceFrom} ${t('service.currency')}`
              : t('service.onQuery')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
