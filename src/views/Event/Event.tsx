import { AppBreadcrumbs, MetaTags } from '@green-world/components';
import { useEvent } from '@green-world/hooks/useEvent';
import {
  formatDate,
  formatImageUrl,
  getHtmlDescriptionProps
} from '@green-world/utils/helpers';
import {
  CalendarToday,
  AccessTime,
  Place,
  Email,
  Phone,
  Person
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useParams } from 'react-router';

export const Event = () => {
  const { eventId } = useParams();
  const { data: eventData } = useEvent(eventId!);

  const metaObj = useMemo(
    () => ({
      title: eventData
        ? ['Zeleni svet', 'Dogadjaj', eventData.title]
            .filter(Boolean)
            .join(' | ')
        : 'Zeleni svet | Dogadjaj',
      description: eventData?.description || 'Dogadjaj | Zeleni Svet',
      image:
        formatImageUrl(eventData?.coverImage, 85) ||
        'https://www.zelenisvet.rs/green-world.svg'
    }),
    [eventData]
  );

  if (!eventId || !eventData) return null;
  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Događaji', route: '/events' },
    { label: eventData?.title, route: `/event/${eventId}` }
  ];

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <MetaTags
        title={metaObj.title}
        description={metaObj.description}
        keywords={metaObj.description}
        image={metaObj.image}
      />
      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'py-7',
          'flex',
          'flex-col',
          'gap-7'
        )}
      >
        <AppBreadcrumbs pages={pages} />
        <Typography variant="h1" color="secondary.main">
          {eventData.title}
        </Typography>

        <Card sx={{ borderRadius: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }}>
            <Box
              sx={{
                flex: 1,
                minWidth: 300,
                maxWidth: 500
              }}
            >
              <CardMedia
                component="img"
                image={formatImageUrl(eventData.coverImage, 85)}
                alt={eventData.title}
                sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
              />
            </Box>
            <CardContent sx={{ flex: 2 }}>
              <Box {...getHtmlDescriptionProps(eventData?.description)} />
              <Stack direction="row" spacing={1} mb={2}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    pt: 2
                  }}
                >
                  <Chip
                    label={
                      eventData.typeAction === 'cleaning'
                        ? 'Čišćenje'
                        : eventData.typeAction === 'selling'
                          ? 'Prodaja'
                          : 'Sadnja'
                    }
                    color={
                      eventData.typeAction === 'cleaning'
                        ? 'error'
                        : eventData.typeAction === 'selling'
                          ? 'info'
                          : 'success'
                    }
                  />
                  <Chip
                    label={
                      eventData.status === 'active'
                        ? 'Aktivno'
                        : eventData.status === 'cancelled'
                          ? 'Otkazano'
                          : 'Završeno'
                    }
                    color={
                      eventData.status === 'active'
                        ? 'success'
                        : eventData.status === 'cancelled'
                          ? 'error'
                          : 'info'
                    }
                  />
                </Box>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <CalendarToday fontSize="small" />
                <Typography>{formatDate(eventData.dateAction)}</Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <AccessTime fontSize="small" />
                <Typography>
                  {eventData.startTime}{' '}
                  {eventData.endTime && `- ${eventData.endTime}`}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Place fontSize="small" />
                <Typography>{eventData.place}</Typography>
              </Stack>

              {eventData.address && (
                <Typography variant="body2" mb={2}>
                  Adresa: {eventData.address}
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" fontWeight="bold" mb={1}>
                Kontakt
              </Typography>

              {eventData.contactPerson && (
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Person fontSize="small" />
                  <Typography>{eventData.contactPerson}</Typography>
                </Stack>
              )}

              {eventData.contactPhone && (
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <Phone fontSize="small" />
                  <Typography>{eventData.contactPhone}</Typography>
                </Stack>
              )}

              {eventData.contactMail && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Email fontSize="small" />
                  <Typography>{eventData.contactMail}</Typography>
                </Stack>
              )}
            </CardContent>
          </Stack>
        </Card>
      </div>
    </div>
  );
};
