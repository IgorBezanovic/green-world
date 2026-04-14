'use client';

import {
  AppBreadcrumbs,
  ItemsHero,
  ListingContentLayout,
  ListingStateSection,
  PageContent,
  SharedPagination
} from '@green-world/components';
import { useAllEvents } from '@green-world/hooks/useAllEvents';
import { useDebounce } from '@green-world/hooks/useDebounce';
import {
  formatDate,
  formatImageUrl,
  getPlainTextFromHtml
} from '@green-world/utils/helpers';
import { Event } from '@green-world/utils/types';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import dayjs from 'dayjs';
import { Calendar, Clock3, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

type EventType = Event['typeAction'];

const EVENT_TYPE_OPTIONS: Array<EventType> = [
  'cleaning',
  'selling',
  'planting',
  'education'
];

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  cleaning: 'Čišćenje',
  selling: 'Prodaja',
  planting: 'Sadnja',
  education: 'Edukacija'
};

const EVENT_TYPE_COLORS: Record<
  EventType,
  'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
> = {
  cleaning: 'success',
  selling: 'info',
  planting: 'warning',
  education: 'secondary'
};

const EVENT_TYPE_BADGE_SX: Record<
  EventType,
  { bgcolor: string; color: string }
> = {
  cleaning: {
    bgcolor: 'success.light',
    color: 'success.dark'
  },
  selling: {
    bgcolor: 'info.light',
    color: 'info.dark'
  },
  planting: {
    bgcolor: 'warning.light',
    color: 'warning.dark'
  },
  education: {
    bgcolor: 'secondary.light',
    color: 'secondary.dark'
  }
};

const isEventType = (value: string): value is EventType => {
  return (
    value === 'cleaning' ||
    value === 'selling' ||
    value === 'planting' ||
    value === 'education'
  );
};

const isEventFinished = (event: Event) => {
  const status = String(event.status || '').toLowerCase();

  if (['finished', 'ended', 'completed', 'done', 'inactive'].includes(status)) {
    return true;
  }

  const eventDate = dayjs(event.dateAction as string | Date | undefined);

  if (!eventDate.isValid()) return false;

  if (event.endTime) {
    const [hours, minutes] = event.endTime.split(':').map(Number);
    const eventEnd = eventDate
      .hour(hours || 0)
      .minute(minutes || 0)
      .second(0);
    return eventEnd.isBefore(dayjs());
  }

  return eventDate.endOf('day').isBefore(dayjs());
};

export const Events = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lgm'));
  const [searchParams, setSearchParams] = useSearchParams();

  const parseNumberParam = (value: string | null) => {
    if (value === null || value === '') return undefined;
    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
  };

  const urlState = useMemo<{
    search: string;
    location: string;
    filterLocation: string;
    eventType: EventType | '';
    page: number;
  }>(
    () => ({
      search: searchParams.get('search') ?? '',
      location: searchParams.get('location') ?? '',
      filterLocation: searchParams.get('filterLocation') ?? '',
      eventType: isEventType(searchParams.get('eventType') ?? '')
        ? (searchParams.get('eventType') as EventType)
        : '',
      page: Math.max(parseNumberParam(searchParams.get('page')) ?? 1, 1)
    }),
    [searchParams]
  );

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [search, setSearch] = useState(urlState.search);
  const [location, setLocation] = useState(urlState.location);
  const [filterLocation, setFilterLocation] = useState(urlState.filterLocation);
  const [eventType, setEventType] = useState<EventType | ''>(
    urlState.eventType
  );
  const [page, setPage] = useState(urlState.page);

  const debouncedSearch = useDebounce(search, 300);
  const debouncedLocation = useDebounce(location, 300);
  const debouncedFilterLocation = useDebounce(filterLocation, 300);

  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      location: debouncedLocation || undefined,
      filterLocation: debouncedFilterLocation || undefined,
      typeAction: eventType || undefined,
      page
    }),
    [
      debouncedFilterLocation,
      debouncedLocation,
      debouncedSearch,
      eventType,
      page
    ]
  );

  const {
    data: eventsResponse,
    isLoading,
    isError,
    isFetching
  } = useAllEvents(filters);
  const events = eventsResponse?.data || [];
  const totalEvents = eventsResponse?.meta?.totalItems ?? 0;
  const totalPages = eventsResponse?.meta?.pages ?? 1;

  useEffect(() => {
    if (search !== urlState.search) setSearch(urlState.search);
    if (location !== urlState.location) setLocation(urlState.location);
    if (filterLocation !== urlState.filterLocation) {
      setFilterLocation(urlState.filterLocation);
    }
    if (eventType !== urlState.eventType) setEventType(urlState.eventType);
    if (page !== urlState.page) setPage(urlState.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlState]);

  useEffect(() => {
    const next = new URLSearchParams();

    if (search) next.set('search', search);
    if (location) next.set('location', location);
    if (filterLocation) next.set('filterLocation', filterLocation);
    if (eventType) next.set('eventType', eventType);
    if (page > 1) next.set('page', String(page));

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [
    eventType,
    filterLocation,
    location,
    page,
    search,
    searchParams,
    setSearchParams
  ]);

  const resetFilters = () => {
    setSearch('');
    setLocation('');
    setFilterLocation('');
    setEventType('');
    setPage(1);
  };

  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('breadcrumbs.events'), route: '/events' }
  ];

  return (
    <PageContent>
      <ItemsHero
        kicker="Pridruži se zajednici"
        title="Događaji"
        subtitle="Pronađite događaje u vašoj blizini - akcije čišćenja, pijace lokalnih proizvoda i radionice sadnje biljaka."
        searchPlaceholder="Pretraži po nazivu ili opisu"
        locationPlaceholder="Lokacija"
        searchValue={search}
        locationValue={location}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onLocationChange={(value) => {
          setLocation(value);
          setPage(1);
        }}
      />

      <ListingContentLayout
        breadcrumbs={<AppBreadcrumbs pages={pages} />}
        isTablet={isTablet}
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen((prev) => !prev)}
        openFiltersLabel={t('productsView.openFilters')}
        closeFiltersLabel={t('productsView.closeFilters')}
        filters={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Typography
                color="secondary.main"
                sx={{
                  fontFamily: 'var(--font-ephesis, Ephesis), cursive',
                  fontWeight: 400,
                  fontSize: '2.2rem',
                  lineHeight: 1
                }}
              >
                Filteri
              </Typography>
              {isFetching && (
                <Typography
                  variant="overline"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <CircularProgress size={16} thickness={4} />
                  {t('productsView.loading')}
                </Typography>
              )}
            </Box>

            <Box>
              <Typography gutterBottom>Lokacija</Typography>
              <TextField
                id="event-location"
                value={filterLocation}
                onChange={(e) => {
                  setFilterLocation(e.target.value);
                  setPage(1);
                }}
                placeholder="Unesite lokaciju"
                fullWidth
                sx={{
                  '& .MuiInputBase-input': {
                    padding: '8px'
                  }
                }}
              />
            </Box>

            <Box>
              <Typography gutterBottom>Tip događaja</Typography>
              <Autocomplete
                id="event-type"
                options={EVENT_TYPE_OPTIONS}
                value={eventType || null}
                onChange={(_e, newValue) => {
                  setEventType((newValue as EventType) || '');
                  setPage(1);
                }}
                getOptionLabel={(option) =>
                  EVENT_TYPE_LABELS[option as EventType] || ''
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Svi tipovi"
                    variant="outlined"
                    size="small"
                    sx={{
                      bgcolor: 'background.paper',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px'
                      }
                    }}
                  />
                )}
                fullWidth
              />
            </Box>

            <Button
              variant="outlined"
              color="inherit"
              fullWidth
              onClick={resetFilters}
              sx={{ textTransform: 'none' }}
            >
              Poništi filtere
            </Button>

            <Card
              sx={{
                bgcolor: 'rgba(134, 239, 172, 0.22)',
                border: '1px solid rgba(22, 163, 74, 0.12)'
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1
                  }}
                >
                  <Calendar size={18} color={theme.palette.success.dark} />
                  <Typography variant="body1">O događajima</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Svaki događaj nudi priliku za učenje, druženje i pozitivan
                  uticaj na zajednicu i prirodu.
                </Typography>

                <Box sx={{ mt: 1.5 }}>
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ mb: 0.75 }}
                  >
                    Tipovi događaja:
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    • Čišćenje: akcije uklanjanja otpada i uređenja javnih
                    površina.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Prodaja: prodaja i razmena lokalnih, domaćih i održivih
                    proizvoda.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Sadnja: organizovana sadnja drveća, cveća i drugih biljaka
                    za ozelenjavanje prostora.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        }
        summary={
          <Typography variant="h6">{totalEvents} događaja pronađeno</Typography>
        }
        content={
          <ListingStateSection
            status={
              isLoading
                ? 'loading'
                : isError
                  ? 'error'
                  : events.length === 0
                    ? 'empty'
                    : 'ready'
            }
            errorText="Greška pri učitavanju događaja."
            emptyTitle="Nema događaja za izabrane filtere."
            emptyActionLabel="Prikaži sve događaje"
            onEmptyAction={resetFilters}
            readyContent={
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
                  [theme.breakpoints.up('xl')]: {
                    gridTemplateColumns: 'repeat(4, 1fr)'
                  }
                })}
              >
                {events.map((event: Event) => (
                  <Box key={event._id} sx={{ width: '100%', minWidth: 0 }}>
                    {(() => {
                      const isFinished = isEventFinished(event);
                      const formattedDate = formatDate(event.dateAction);
                      const hasValidDate =
                        Boolean(formattedDate) &&
                        !formattedDate.toLowerCase().includes('nan');
                      const organizerName =
                        event.contactPerson?.trim() || 'Organizator';

                      return (
                        <Card
                          component={Link}
                          to={`/event/${event._id}`}
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',
                            width: '100%',
                            minWidth: 0,
                            textDecoration: 'none',
                            opacity: isFinished ? 0.65 : 1,
                            filter: isFinished ? 'grayscale(0.3)' : 'none',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Box
                            sx={{
                              position: 'relative',
                              height: 220,
                              minHeight: 220,
                              bgcolor: 'grey.100',
                              overflow: 'hidden'
                            }}
                          >
                            <Box
                              component="img"
                              src={formatImageUrl(event.coverImage, 85)}
                              alt={event.title}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center'
                              }}
                            />

                            <Chip
                              label={EVENT_TYPE_LABELS[event.typeAction]}
                              color={EVENT_TYPE_COLORS[event.typeAction]}
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                fontWeight: 700,
                                bgcolor:
                                  EVENT_TYPE_BADGE_SX[event.typeAction].bgcolor,
                                color:
                                  EVENT_TYPE_BADGE_SX[event.typeAction].color,
                                border: 'none',
                                '& .MuiChip-label': {
                                  px: 1.25
                                }
                              }}
                            />

                            <Chip
                              label={event.place || 'Lokacija nije uneta'}
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                maxWidth: '50%',
                                fontWeight: 700,
                                bgcolor: '#e2bd9d',
                                color: '#4a2b17',
                                border: 'none',
                                '& .MuiChip-label': {
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  display: 'block'
                                }
                              }}
                            />

                            {isFinished && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 18,
                                  right: -48,
                                  width: 180,
                                  textAlign: 'center',
                                  transform: 'rotate(45deg)',
                                  bgcolor: 'primary.main',
                                  color: 'common.white',
                                  py: 0.5,
                                  fontWeight: 700,
                                  fontSize: '0.75rem',
                                  letterSpacing: 0.6,
                                  boxShadow: 2,
                                  textTransform: 'uppercase'
                                }}
                              >
                                Završeno
                              </Box>
                            )}
                          </Box>

                          <CardContent
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              flexGrow: 1,
                              pb: 2,
                              '&:last-child': {
                                pb: 2
                              }
                            }}
                          >
                            <Tooltip title={event.title} arrow>
                              <Typography
                                variant="h3"
                                component="h2"
                                fontWeight={500}
                                sx={{
                                  color: 'text.primary',
                                  mb: 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  minHeight: '1.4em'
                                }}
                              >
                                {event.title}
                              </Typography>
                            </Tooltip>
                            <Divider variant="fullWidth" />
                            <Typography
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
                              {getPlainTextFromHtml(event.description)}
                            </Typography>

                            <Box sx={{ mt: 'auto', pt: 2 }}>
                              <Box
                                sx={{ borderTop: '1px solid #f0f0f0', mb: 1.5 }}
                              />
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: 1,
                                  minWidth: 0
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    minWidth: 0,
                                    color: 'text.secondary'
                                  }}
                                >
                                  {hasValidDate ? (
                                    <>
                                      <Calendar size={14} />
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                          whiteSpace: 'nowrap',
                                          fontSize: '0.72rem'
                                        }}
                                      >
                                        {formattedDate}
                                      </Typography>
                                    </>
                                  ) : (
                                    <>
                                      <User size={14} />
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                          whiteSpace: 'nowrap',
                                          fontSize: '0.72rem'
                                        }}
                                      >
                                        {organizerName}
                                      </Typography>
                                    </>
                                  )}
                                </Box>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    minWidth: 0,
                                    color: 'text.secondary'
                                  }}
                                >
                                  <Clock3 size={14} />
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                      whiteSpace: 'nowrap',
                                      fontSize: '0.72rem'
                                    }}
                                  >
                                    {event.startTime}
                                    {event.endTime ? ` - ${event.endTime}` : ''}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      );
                    })()}
                  </Box>
                ))}
              </Box>
            }
          />
        }
        pagination={
          <SharedPagination
            totalPages={totalPages}
            currentPage={eventsResponse?.meta?.currentPage ?? page}
            isLoading={isLoading}
            isError={isError}
            isMobile={isMobile}
            onPageChange={(value) => {
              setPage(value);
              setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                if (value > 1) {
                  next.set('page', String(value));
                } else {
                  next.delete('page');
                }
                return next;
              });
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        }
      />
    </PageContent>
  );
};
