import { useGetServices } from '@green-world/hooks/useServices';
import type { ServiceListingFiltersParams } from '@green-world/utils/types';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Slider,
  CircularProgress
} from '@mui/material';
import { Search, MapPin } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const SERVICE_CATEGORIES = [
  'lawn_mowing',
  'tree_pruning',
  'watering',
  'garden_maintenance',
  'landscaping',
  'irrigation'
];

const ServiceListingPage = () => {
  const { t } = useTranslation();

  const [filters, setFilters] = useState<ServiceListingFiltersParams>({
    location: '',
    service: '',
    priceFrom: undefined,
    priceTo: undefined,
    search: ''
  });

  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);

  const {
    data: servicesResponse,
    isLoading,
    isError
  } = useGetServices(filters);
  const services = servicesResponse || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, location: e.target.value }));
  };

  const handleServiceChange = (e: any) => {
    setFilters((prev) => ({ ...prev, service: e.target.value }));
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handlePriceChangeCommitted = (
    _event: React.SyntheticEvent | Event,
    newValue: number | number[]
  ) => {
    const [min, max] = newValue as number[];
    setFilters((prev) => ({ ...prev, priceFrom: min, priceTo: max }));
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      service: '',
      priceFrom: undefined,
      priceTo: undefined,
      search: ''
    });
    setPriceRange([0, 1000]);
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
          backgroundImage:
            'linear-gradient(to right, rgba(22, 163, 74, 0.9), rgba(21, 128, 61, 0.9))'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            {t('service.title', 'Pronađite najbolje baštovanske usluge')}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: 600 }}>
            {t(
              'service.subtitle',
              'Povežite se sa profesionalcima za održavanje travnjaka, pejzažnu arhitekturu i negu biljaka u vašoj okolini.'
            )}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              bgcolor: 'white',
              p: 1,
              borderRadius: 2,
              boxShadow: 3,
              flexDirection: { xs: 'column', md: 'row' }
            }}
          >
            <TextField
              fullWidth
              placeholder={t('service.searchPlaceholder', 'Pretraži usluge...')}
              value={filters.search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="gray" size={20} />
                  </InputAdornment>
                ),
                disableUnderline: true
              }}
              variant="standard"
              sx={{ px: 2, py: 1 }}
            />
            <TextField
              fullWidth
              placeholder={t('service.location', 'Lokacija')}
              value={filters.location}
              onChange={handleLocationChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MapPin color="gray" size={20} />
                  </InputAdornment>
                ),
                disableUnderline: true
              }}
              variant="standard"
              sx={{
                px: 2,
                py: 1,
                borderLeft: { xs: 'none', md: '1px solid #e0e0e0' }
              }}
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Sidebar / Filters */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t('service.filters', 'Filteri')}
              </Typography>

              <Box sx={{ mt: 3, mb: 4 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('service.type', 'Tip usluge')}</InputLabel>
                  <Select
                    value={filters.service}
                    label={t('service.type', 'Tip usluge')}
                    onChange={handleServiceChange}
                  >
                    <MenuItem value="">
                      <em>Sve usluge</em>
                    </MenuItem>
                    {SERVICE_CATEGORIES.map((cat) => {
                      const camelCat = cat
                        .split('_')
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join('');
                      return (
                        <MenuItem key={cat} value={cat}>
                          {t(
                            `service.category${camelCat}`,
                            cat.replace('_', ' ')
                          )}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  color="text.secondary"
                >
                  {t('service.priceRange', 'Raspon cene (RSD)')}
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  onChangeCommitted={handlePriceChangeCommitted}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10000}
                  step={100}
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 1
                  }}
                >
                  <Typography variant="body2">{priceRange[0]} RSD</Typography>
                  <Typography variant="body2">{priceRange[1]} RSD</Typography>
                </Box>
              </Box>

              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                onClick={resetFilters}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                {t('service.resetFilters', 'Poništi filtere')}
              </Button>
            </Card>
          </Grid>

          {/* Service Listings Grid */}
          <Grid size={{ xs: 12, md: 9 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Typography variant="h6">
                {services.length}{' '}
                {t('service.resultsFound', 'rezultata pronađeno')}
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
                  {t(
                    'service.errorLoading',
                    'Došlo je do greške prilikom učitavanja usluga.'
                  )}
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
                  {t(
                    'service.noServices',
                    'Nema pronađenih usluga za odabrane filtere.'
                  )}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={resetFilters}
                  sx={{ mt: 2 }}
                >
                  {t('service.viewAllServices', 'Prikaži sve usluge')}
                </Button>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {services.map((service) => (
                  <Grid size={{ xs: 12, sm: 6, md: 6 }} key={service._id}>
                    <Card
                      component={Link}
                      to={`/services/${service._id}`}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        borderRadius: 3,
                        textDecoration: 'none',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow:
                            '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                        }
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={
                            service.images?.[0] ||
                            'https://via.placeholder.com/400x200?text=Usluga'
                          }
                          alt={service.title}
                          sx={{
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12
                          }}
                        />
                        <Chip
                          label={
                            service.priceType === 'hourly'
                              ? 'Po satu'
                              : service.priceType === 'fixed'
                                ? 'Fiksno'
                                : 'Po dogovoru'
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
                            {service.location || 'Nije navedeno'}
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
                          {service.description}
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
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <Box
                              component="img"
                              src={
                                (service.providerId as any)?.profileImage ||
                                'https://via.placeholder.com/40'
                              }
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                objectFit: 'cover'
                              }}
                            />
                            <Typography
                              variant="body2"
                              fontWeight="medium"
                              color="text.primary"
                            >
                              {(service.providerId as any)?.name || 'Korisnik'}{' '}
                              ${(service.providerId as any)?.lastname || ''}
                            </Typography>
                          </Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            color="primary.main"
                          >
                            {service.priceFrom
                              ? `${service.priceFrom} RSD`
                              : 'Na upit'}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ServiceListingPage;
