import { ZSLogoLogoMark } from '@green-world/components/AppLogos';
import { useGetServices } from '@green-world/hooks/useServices';
import {
  formatImageUrl,
  getPlainTextFromHtml,
  useDebounce
} from '@green-world/utils/helpers';
import { getAllPredefinedServices } from '@green-world/utils/serviceConstants';
import type { ServiceListingFiltersParams } from '@green-world/utils/types';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  InputAdornment,
  InputLabel,
  CircularProgress,
  Autocomplete,
  useTheme,
  useMediaQuery,
  Grow
} from '@mui/material';
import { Search, MapPin } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

export const ServiceListingPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const parseNumberParam = (value: string | null) => {
    if (value === null || value === '') return undefined;
    const num = Number(value);
    return Number.isFinite(num) ? num : undefined;
  };

  const urlState = useMemo(
    () => ({
      location: searchParams.get('location') ?? '',
      service: searchParams.get('service') ?? '',
      priceFrom: parseNumberParam(searchParams.get('priceFrom')),
      priceTo: parseNumberParam(searchParams.get('priceTo')),
      search: searchParams.get('search') ?? ''
    }),
    [searchParams]
  );

  const [filters, setFilters] = useState<ServiceListingFiltersParams>(urlState);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lgm'));
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const debouncedFilters = useDebounce(filters, 300);

  const {
    data: servicesResponse,
    isLoading,
    isError
  } = useGetServices(debouncedFilters);
  const services = servicesResponse || [];

  useEffect(() => {
    setFilters((prev) => {
      if (
        prev.location === urlState.location &&
        prev.service === urlState.service &&
        prev.priceFrom === urlState.priceFrom &&
        prev.priceTo === urlState.priceTo &&
        prev.search === urlState.search
      ) {
        return prev;
      }

      return urlState;
    });
  }, [urlState]);

  useEffect(() => {
    const next = new URLSearchParams();

    if (filters.search) next.set('search', filters.search);
    if (filters.location) next.set('location', filters.location);
    if (filters.service) next.set('service', filters.service);
    if (filters.priceFrom !== undefined) {
      next.set('priceFrom', String(filters.priceFrom));
    }
    if (filters.priceTo !== undefined) {
      next.set('priceTo', String(filters.priceTo));
    }

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [filters, searchParams, setSearchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, location: e.target.value }));
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      service: '',
      priceFrom: undefined,
      priceTo: undefined,
      search: ''
    });
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage:
            'linear-gradient(to right, rgba(22, 163, 74, 0.9), rgba(21, 128, 61, 0.9))'
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(125px, 1fr))',
            gridAutoRows: '125px',
            placeItems: 'center',
            opacity: 0.14,
            pointerEvents: 'none'
          }}
        >
          {Array.from({ length: 160 }).map((_, index) => (
            <Box key={index} sx={{ width: 64, height: 80 }}>
              <ZSLogoLogoMark color="rgba(255,255,255,0.75)" />
            </Box>
          ))}
        </Box>

        <Box
          sx={(theme) => ({
            maxWidth: '1400px',
            mx: 'auto',
            px: 2,
            position: 'relative',
            zIndex: 1,
            [theme.breakpoints.up('sm')]: { px: 3 },
            [theme.breakpoints.up('xl')]: { px: 0 }
          })}
        >
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            {t('service.title')}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: 600 }}>
            {t('service.subtitle')}
          </Typography>

          <Box
            sx={(theme) => ({
              display: 'flex',
              gap: 2,
              bgcolor: 'white',
              p: 1,
              borderRadius: 2,
              boxShadow: 3,
              maxWidth: 1024,
              width: '100%',
              mx: 'auto',
              mt: '24px',
              flexDirection: 'column',
              [theme.breakpoints.up('md')]: { flexDirection: 'row' }
            })}
          >
            <TextField
              fullWidth
              placeholder={t('service.searchPlaceholder')}
              value={filters.search}
              onChange={handleSearchChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="gray" size={20} />
                    </InputAdornment>
                  ),
                  disableUnderline: true
                }
              }}
              variant="standard"
              sx={{ px: 2, py: 1 }}
            />
            <TextField
              fullWidth
              placeholder={t('service.location')}
              value={filters.location}
              onChange={handleLocationChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MapPin color="gray" size={20} />
                    </InputAdornment>
                  ),
                  disableUnderline: true
                }
              }}
              variant="standard"
              sx={(theme) => ({
                px: 2,
                py: 1,
                borderLeft: 'none',
                [theme.breakpoints.up('md')]: {
                  borderLeft: '1px solid #e0e0e0'
                }
              })}
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={(theme) => ({
          maxWidth: '1400px',
          mx: 'auto',
          px: 2,
          [theme.breakpoints.up('sm')]: { px: 3 },
          [theme.breakpoints.up('xl')]: { px: 0 }
        })}
      >
        <Grid container spacing={4}>
          {/* Sidebar / Filters */}
          <Grid size={{ xs: 12, lgm: 3 }}>
            {isTablet && (
              <Button
                variant="contained"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                sx={{
                  width: '100%',
                  marginBottom: '16px'
                }}
              >
                {!isFiltersOpen
                  ? t('productsView.openFilters')
                  : t('productsView.closeFilters')}
              </Button>
            )}
            {/* Filters */}
            {(isTablet ? isFiltersOpen && isTablet : true) && (
              <Grow in={isFiltersOpen || !isTablet}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    position: 'sticky',
                    top: '133px'
                  }}
                >
                  <Typography
                    variant="h1"
                    color="secondary.main"
                    sx={{ fontFamily: 'Ephesis' }}
                  >
                    {t('service.filters')}
                  </Typography>

                  <Box>
                    <InputLabel
                      sx={{ color: 'text.primary' }}
                      htmlFor="location"
                    >
                      {t('service.location')}
                    </InputLabel>
                    <TextField
                      id="location"
                      value={filters.location}
                      onChange={handleLocationChange}
                      placeholder={t('service.location')}
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
                      id="service-type"
                    >
                      {t('service.type')}
                    </InputLabel>
                    <Autocomplete
                      id="service-type-autocomplete"
                      options={getAllPredefinedServices()}
                      value={filters.service}
                      onChange={(_e, newValue) => {
                        setFilters((prev) => ({
                          ...prev,
                          service: newValue || ''
                        }));
                      }}
                      getOptionLabel={(option) => {
                        if (!option) return t('service.allServices');
                        return t(`service.serviceNames.${option}`, option);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={t('service.allServices')}
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

                  <Box>
                    <Typography gutterBottom>
                      {t('service.priceRange')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        type="number"
                        placeholder={t('productsView.from')}
                        value={filters.priceFrom ?? ''}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const value = raw === '' ? undefined : Number(raw);

                          setFilters((prev) => ({
                            ...prev,
                            priceFrom: Number.isFinite(value)
                              ? value
                              : undefined
                          }));
                        }}
                        fullWidth
                        slotProps={{ htmlInput: { min: 0 } }}
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '8px'
                          }
                        }}
                      />
                      <TextField
                        type="number"
                        placeholder={t('productsView.to')}
                        value={filters.priceTo ?? ''}
                        onChange={(e) => {
                          const raw = e.target.value;
                          const value = raw === '' ? undefined : Number(raw);

                          setFilters((prev) => ({
                            ...prev,
                            priceTo: Number.isFinite(value) ? value : undefined
                          }));
                        }}
                        fullWidth
                        slotProps={{ htmlInput: { min: 0 } }}
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '8px'
                          }
                        }}
                      />
                    </Box>
                  </Box>

                  <Button
                    variant="outlined"
                    color="inherit"
                    fullWidth
                    onClick={resetFilters}
                    sx={{ textTransform: 'none' }}
                  >
                    {t('service.resetFilters')}
                  </Button>
                </Box>
              </Grow>
            )}
          </Grid>

          {/* Service Listings Grid */}
          <Grid size={{ xs: 12, lgm: 9 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Typography variant="h6">
                {services.length} {t('service.resultsFound')}
              </Typography>
              {/* Could add a Sort By dropdown here */}
            </Box>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : isError ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="error">
                  {t('service.errorLoading')}
                </Typography>
              </Box>
            ) : services.length === 0 ? (
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
                  {t('service.noServices')}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={resetFilters}
                  sx={{ mt: 2 }}
                >
                  {t('service.viewAllServices')}
                </Button>
              </Box>
            ) : (
              <Box
                component="section"
                sx={(theme) => ({
                  width: '100%',
                  display: 'grid',
                  gap: '24px',
                  gridTemplateColumns: services.length
                    ? 'repeat(1, 1fr)'
                    : 'none',
                  [theme.breakpoints.up('xs')]: {
                    gridTemplateColumns: services.length
                      ? 'repeat(2, 1fr)'
                      : 'none'
                  },
                  [theme.breakpoints.up('md')]: {
                    gridTemplateColumns: services.length
                      ? 'repeat(3, 1fr)'
                      : 'none'
                  },
                  [theme.breakpoints.up('lgm')]: {
                    gridTemplateColumns: services.length
                      ? 'repeat(4, 1fr)'
                      : 'none'
                  }
                })}
              >
                {services.map((service) => (
                  <Box key={service._id}>
                    <Card
                      component={Link}
                      to={`/services/${service._id}`}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
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
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            color="text.primary"
                          >
                            {(service.providerId as any)?.name ||
                              t('service.user')}{' '}
                            {(service.providerId as any)?.lastname || ''}
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
                  </Box>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
