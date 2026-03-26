import { AppBreadcrumbs, ListingHero, MetaTags } from '@green-world/components';
import { useAllEvents } from '@green-world/hooks/useAllEvents';
import {
  formatDate,
  formatImageUrl,
  getPlainTextFromHtml,
  useDebounce
} from '@green-world/utils/helpers';
import { Event } from '@green-world/utils/types';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  InputLabel,
  Skeleton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import dayjs from 'dayjs';
import { Calendar, Clock3, User } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

type EventType = Event['typeAction'];

const EVENT_TYPE_OPTIONS: Array<EventType> = [
  'cleaning',
  'selling',
  'planting'
];

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  cleaning: 'Čišćenje',
  selling: 'Prodaja',
  planting: 'Sadnja'
};

const EVENT_TYPE_COLORS: Record<
  EventType,
  'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
> = {
  cleaning: 'success',
  selling: 'info',
  planting: 'warning'
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
  }
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
  const isTablet = useMediaQuery(theme.breakpoints.down('lgm'));

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [eventType, setEventType] = useState<EventType | ''>('');

  const debouncedSearch = useDebounce(search, 300);
  const debouncedLocation = useDebounce(location, 300);
  const debouncedFilterLocation = useDebounce(filterLocation, 300);

  const { data: allEvents, isLoading, isError } = useAllEvents();

  const filteredEvents = useMemo(() => {
    const events = allEvents || [];

    const normalizedSearch = debouncedSearch.trim().toLowerCase();
    const normalizedHeaderLocation = debouncedLocation.trim().toLowerCase();
    const normalizedFilterLocation = debouncedFilterLocation
      .trim()
      .toLowerCase();

    return events.filter((event: Event) => {
      const plainDescription = getPlainTextFromHtml(event.description || '');
      const searchMatch =
        !normalizedSearch ||
        event.title.toLowerCase().includes(normalizedSearch) ||
        plainDescription.toLowerCase().includes(normalizedSearch);

      const eventLocation =
        `${event.place || ''} ${event.address || ''}`.toLowerCase();

      const headerLocationMatch =
        !normalizedHeaderLocation ||
        eventLocation.includes(normalizedHeaderLocation);

      const filterLocationMatch =
        !normalizedFilterLocation ||
        eventLocation.includes(normalizedFilterLocation);

      const typeMatch = !eventType || event.typeAction === eventType;

      return (
        searchMatch && headerLocationMatch && filterLocationMatch && typeMatch
      );
    });
  }, [
    allEvents,
    debouncedFilterLocation,
    debouncedLocation,
    debouncedSearch,
    eventType
  ]);

  const resetFilters = () => {
    setSearch('');
    setLocation('');
    setFilterLocation('');
    setEventType('');
  };

  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: 'Događaji', route: '/events' }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      <MetaTags
        title={t('seo.events.title')}
        description={t('seo.events.description')}
        keywords={t('seo.events.keywords')}
      />

      <ListingHero
        kicker="Pridruži se zajednici"
        title="Događaji"
        subtitle="Pronađite događaje u vašoj blizini - akcije čišćenja, pijace lokalnih proizvoda i radionice sadnje biljaka."
        searchPlaceholder="Pretraži po nazivu ili opisu"
        locationPlaceholder="Lokacija"
        searchValue={search}
        locationValue={location}
        onSearchChange={setSearch}
        onLocationChange={setLocation}
      />

      <Box
        sx={(theme) => ({
          maxWidth: '1400px',
          mx: 'auto',
          px: 2,
          [theme.breakpoints.up('sm')]: { px: 3 },
          [theme.breakpoints.up('xl')]: { px: 0 }
        })}
      >
        <AppBreadcrumbs pages={pages} />

        <Box
          sx={(theme) => ({
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 4,
            mt: 2,
            [theme.breakpoints.up('lgm')]: {
              gridTemplateColumns: '280px 1fr'
            }
          })}
        >
          <Box>
            {isTablet && (
              <Button
                variant="contained"
                onClick={() => setIsFiltersOpen((prev) => !prev)}
                sx={{ width: '100%', mb: 2 }}
              >
                {isFiltersOpen ? 'Zatvori filtere' : 'Otvori filtere'}
              </Button>
            )}

            {(!isTablet || isFiltersOpen) && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  position: 'sticky',
                  top: '120px'
                }}
              >
                <Typography
                  variant="h1"
                  color="secondary.main"
                  sx={{ fontFamily: 'Ephesis' }}
                >
                  Filteri
                </Typography>

                <Box>
                  <InputLabel
                    sx={{ color: 'text.primary', mb: 1 }}
                    htmlFor="event-location"
                  >
                    Lokacija
                  </InputLabel>
                  <TextField
                    id="event-location"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
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
                  <InputLabel
                    sx={{ color: 'text.primary', mb: 1 }}
                    id="event-type-label"
                  >
                    Tip događaja
                  </InputLabel>
                  <Autocomplete
                    id="event-type"
                    options={EVENT_TYPE_OPTIONS}
                    value={eventType || null}
                    onChange={(_e, newValue) =>
                      setEventType((newValue as EventType) || '')
                    }
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
                      <Typography variant="body1" fontWeight={700}>
                        O događajima
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Svaki događaj nudi priliku za učenje, druženje i pozitivan
                      uticaj na zajednicu i prirodu.
                    </Typography>

                    <Box sx={{ mt: 1.5 }}>
                      <Typography
                        variant="body2"
                        fontWeight={700}
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
                        • Prodaja: prodaja i razmena lokalnih, domaćih i
                        održivih proizvoda.
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Sadnja: organizovana sadnja drveća, cveća i drugih
                        biljaka za ozelenjavanje prostora.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>

          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {filteredEvents.length} događaja pronađeno
            </Typography>

            {isLoading ? (
              <Box
                sx={(theme) => ({
                  width: '100%',
                  minHeight: '70vh',
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
                  [theme.breakpoints.up('lgm')]: {
                    gridTemplateColumns: 'repeat(4, 1fr)'
                  }
                })}
              >
                {Array.from({ length: 8 }).map((_, index) => (
                  <Card key={index}>
                    <Skeleton variant="rectangular" height={220} />
                    <CardContent>
                      <Skeleton variant="text" height={28} width="80%" />
                      <Skeleton variant="text" height={20} width="100%" />
                      <Skeleton variant="text" height={20} width="100%" />
                      <Skeleton variant="text" height={20} width="70%" />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : isError ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="error">
                  Greška pri učitavanju događaja.
                </Typography>
              </Box>
            ) : filteredEvents.length === 0 ? (
              <Box
                sx={{
                  py: 8,
                  textAlign: 'center',
                  bgcolor: 'white',
                  borderRadius: 3,
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Nema događaja za izabrane filtere.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={resetFilters}
                  sx={{ mt: 2 }}
                >
                  Prikaži sve događaje
                </Button>
              </Box>
            ) : (
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
                  [theme.breakpoints.up('lgm')]: {
                    gridTemplateColumns: 'repeat(4, 1fr)'
                  }
                })}
              >
                {filteredEvents.map((event: Event) => (
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
                            <Typography
                              variant="h6"
                              component="h2"
                              fontWeight="bold"
                              sx={{
                                color: 'text.primary',
                                mb: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}
                            >
                              {event.title}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                minHeight: '4.5em',
                                lineHeight: 1.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical'
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
                                        fontWeight={600}
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
                                        fontWeight={600}
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
                                    fontWeight={700}
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
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
