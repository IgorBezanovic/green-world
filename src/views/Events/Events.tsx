'use client';

import {
  AppBreadcrumbs,
  EventCard,
  ItemsHero,
  ListingContentLayout,
  ListingStateSection,
  PageContent,
  SharedPagination
} from '@green-world/components';
import { useAllEvents } from '@green-world/hooks/useAllEvents';
import { useDebounce } from '@green-world/hooks/useDebounce';
import { Event } from '@green-world/utils/types';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Calendar } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

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

const isEventType = (value: string): value is EventType => {
  return (
    value === 'cleaning' ||
    value === 'selling' ||
    value === 'planting' ||
    value === 'education'
  );
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
                    <EventCard event={event} />
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
