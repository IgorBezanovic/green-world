import { AppBreadcrumbs, ItemsHero } from '@green-world/components';
import { useGetServicesPaginated } from '@green-world/hooks/useServices';
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
  InputLabel,
  Skeleton,
  Autocomplete,
  Pagination,
  useTheme,
  useMediaQuery,
  Grow
} from '@mui/material';
import { MapPin } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

export const ServiceListingPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('breadcrumbs.services'), route: '/services' }
  ];

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
      search: searchParams.get('search') ?? '',
      page: Math.max(parseNumberParam(searchParams.get('page')) ?? 1, 1)
    }),
    [searchParams]
  );

  const [filters, setFilters] = useState<ServiceListingFiltersParams>(urlState);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lgm'));
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const debouncedFilters = useDebounce(filters, 300);

  const {
    data: servicesResponse,
    isLoading,
    isError
  } = useGetServicesPaginated(debouncedFilters);
  const services = servicesResponse?.data || [];
  const servicesMeta = servicesResponse?.meta;

  useEffect(() => {
    setFilters((prev) => {
      if (
        prev.location === urlState.location &&
        prev.service === urlState.service &&
        prev.priceFrom === urlState.priceFrom &&
        prev.priceTo === urlState.priceTo &&
        prev.search === urlState.search &&
        prev.page === urlState.page
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
    if (filters.page && filters.page > 1) {
      next.set('page', String(filters.page));
    }

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [filters, searchParams, setSearchParams]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, location: e.target.value, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      service: '',
      priceFrom: undefined,
      priceTo: undefined,
      search: '',
      page: 1
    });
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
      <ItemsHero
        kicker="Pronađi uslugu"
        title={t('service.title')}
        subtitle={t('service.subtitle')}
        searchPlaceholder={t('service.searchPlaceholder')}
        locationPlaceholder={t('service.location')}
        searchValue={filters.search ?? ''}
        locationValue={filters.location ?? ''}
        onSearchChange={(value) =>
          setFilters((prev) => ({ ...prev, search: value, page: 1 }))
        }
        onLocationChange={(value) =>
          setFilters((prev) => ({ ...prev, location: value, page: 1 }))
        }
        subtitleMaxWidth={600}
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
        <Grid container spacing={4} sx={{ mt: 2 }}>
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
                          service: newValue || '',
                          page: 1
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
                              : undefined,
                            page: 1
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
                            priceTo: Number.isFinite(value) ? value : undefined,
                            page: 1
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
                {servicesMeta?.totalServices ?? services.length}{' '}
                {t('service.resultsFound')}
              </Typography>
              {/* Could add a Sort By dropdown here */}
            </Box>

            {isLoading ? (
              <Box
                component="section"
                sx={(theme) => ({
                  width: '100%',
                  minHeight: '70vh',
                  display: 'grid',
                  gap: '24px',
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
                  <Card key={index} sx={{ width: '100%', minWidth: 0 }}>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={18} width="50%" />
                      <Skeleton variant="text" height={28} width="85%" />
                      <Skeleton variant="text" height={20} width="95%" />
                      <Skeleton variant="text" height={20} width="70%" />
                      <Box sx={{ mt: 2, pt: 2 }}>
                        <Skeleton variant="text" height={20} width="60%" />
                      </Box>
                    </CardContent>
                  </Card>
                ))}
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
                  gridAutoRows: '1fr',
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
                  <Box key={service._id} sx={{ width: '100%', minWidth: 0 }}>
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

            {!isLoading && !isError && (servicesMeta?.pages ?? 1) > 1 ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 5
                }}
              >
                <Pagination
                  count={servicesMeta?.pages ?? 1}
                  page={servicesMeta?.currentPage ?? filters.page ?? 1}
                  onChange={(_, value) => {
                    setFilters((prev) => ({ ...prev, page: value }));
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
                  color="primary"
                  variant="outlined"
                  shape="rounded"
                  size={isMobile ? 'medium' : 'large'}
                  siblingCount={1}
                  boundaryCount={isMobile ? 1 : 2}
                />
              </Box>
            ) : null}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
