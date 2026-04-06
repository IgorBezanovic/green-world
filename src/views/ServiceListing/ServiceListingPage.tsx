'use client';

import {
  AppBreadcrumbs,
  ItemsHero,
  ListingContentLayout,
  ListingStateSection,
  ServiceListingCard,
  SharedPagination
} from '@green-world/components';
import { useGetServicesPaginated } from '@green-world/hooks/useServices';
import { useDebounce } from '@green-world/utils/helpers';
import { getAllPredefinedServices } from '@green-world/utils/serviceConstants';
import type { ServiceListingFiltersParams } from '@green-world/utils/types';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  InputLabel,
  Autocomplete,
  useTheme,
  useMediaQuery
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

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
    isError,
    isFetching
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

      <ListingContentLayout
        breadcrumbs={<AppBreadcrumbs pages={pages} />}
        isTablet={isTablet}
        isFiltersOpen={isFiltersOpen}
        onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
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
                variant="h1"
                color="secondary.main"
                sx={{ fontFamily: 'Ephesis' }}
              >
                {t('service.filters')}
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
              <InputLabel sx={{ color: 'text.primary' }} htmlFor="location">
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
              <Typography gutterBottom>{t('service.priceRange')}</Typography>
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
                      priceFrom: Number.isFinite(value) ? value : undefined,
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
        }
        summary={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6">
              {servicesMeta?.totalItems ?? services.length}{' '}
              {t('service.resultsFound')}
            </Typography>
          </Box>
        }
        content={
          <ListingStateSection
            status={
              isLoading
                ? 'loading'
                : isError
                  ? 'error'
                  : services.length === 0
                    ? 'empty'
                    : 'ready'
            }
            errorText={t('service.errorLoading')}
            emptyTitle={t('service.noServices')}
            emptyActionLabel={t('service.viewAllServices')}
            onEmptyAction={resetFilters}
            readyContent={
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
                    <ServiceListingCard service={service} />
                  </Box>
                ))}
              </Box>
            }
          />
        }
        pagination={
          <SharedPagination
            totalPages={servicesMeta?.pages}
            currentPage={servicesMeta?.currentPage ?? filters.page ?? 1}
            isLoading={isLoading}
            isError={isError}
            isMobile={isMobile}
            onPageChange={(value) => {
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
          />
        }
      />
    </Box>
  );
};
