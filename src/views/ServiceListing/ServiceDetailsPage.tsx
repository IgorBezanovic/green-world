import { AppBreadcrumbs } from '@green-world/components';
import {
  useGetServiceById,
  useContactServiceProvider
} from '@green-world/hooks/useServices';
import {
  formatImageUrl,
  getHtmlDescriptionProps
} from '@green-world/utils/helpers';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Avatar,
  useTheme
} from '@mui/material';
import {
  MapPin,
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  BriefcaseBusiness,
  Calendar,
  Clock,
  CheckCircle2,
  Languages,
  Link as LinkIcon
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';

import { FullImageDialog } from '../ProductPage/components';

const ServiceDetailsPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    data: serviceResponse,
    isLoading,
    isError
  } = useGetServiceById(serviceId || '');
  const service = serviceResponse;

  const { mutate: contactProvider, isPending: isSending } =
    useContactServiceProvider();

  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ message: '', phone: '' });
  const [idexOfImage, setIndexOfImage] = useState(0);
  const [openImageModal, setOpenImageModal] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !service) {
    return (
      <Box
        sx={(theme) => ({
          maxWidth: '1400px',
          mx: 'auto',
          px: 2,
          [theme.breakpoints.up('sm')]: { px: 3 },
          [theme.breakpoints.up('xl')]: { px: 0 },
          py: 8,
          textAlign: 'center'
        })}
      >
        <Typography variant="h5" color="error" gutterBottom>
          {t('service.notFound')}
        </Typography>
        <Button
          component={Link}
          to="/services"
          startIcon={<ArrowLeft />}
          sx={{ mt: 2 }}
        >
          {t('service.backToServices')}
        </Button>
      </Box>
    );
  }

  const handleContactSubmit = () => {
    if (serviceId && contactForm.message && contactForm.phone) {
      contactProvider(
        { id: serviceId, ...contactForm },
        {
          onSuccess: () => {
            setContactDialogOpen(false);
            setContactForm({ message: '', phone: '' });
          }
        }
      );
    }
  };

  const handlePrev = () => {
    if (!service?.images?.length) return;

    setIndexOfImage((prevIndex) =>
      prevIndex === 0 ? service.images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    if (!service?.images?.length) return;

    setIndexOfImage((prevIndex) =>
      prevIndex === service.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const provider = service.providerId as any;
  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('breadcrumbs.services', 'Usluge'), route: '/services' },
    {
      label: service.title || t('service.notFound'),
      route: `/services/${serviceId}`
    }
  ];

  return (
    <Box
      sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8, pt: 4 }}
    >
      <Box
        sx={(theme) => ({
          maxWidth: '1400px',
          mx: 'auto',
          px: 2,
          gap: 4,
          display: 'flex',
          flexDirection: 'column',
          [theme.breakpoints.up('sm')]: { px: 3 },
          [theme.breakpoints.up('xl')]: { px: 0 }
        })}
      >
        <AppBreadcrumbs pages={pages} />
        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box mb={4}>
              <Typography variant="h1" gutterBottom>
                {service.title}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  flexWrap: 'wrap'
                }}
              >
                <Chip
                  label={
                    service.priceType === 'hourly'
                      ? t('service.hourly')
                      : service.priceType === 'fixed'
                        ? t('service.fixed')
                        : t('service.negotiable')
                  }
                  color="primary"
                  variant="outlined"
                />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: 'text.secondary'
                  }}
                >
                  <MapPin size={18} />
                  <Typography variant="body1">
                    {service.location || t('service.notSpecified')}
                  </Typography>
                </Box>
                {service.priceFrom && (
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary.main"
                    sx={{ ml: 'auto' }}
                  >
                    {service.priceFrom}{' '}
                    {service.priceTo ? `- ${service.priceTo}` : ''}{' '}
                    {t('service.currency')}
                  </Typography>
                )}
              </Box>
            </Box>

            {service.images && service.images.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  mb: 4
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1 / 1',
                    overflow: 'hidden'
                  }}
                >
                  {service.images.length > 1 && (
                    <Button
                      onClick={handlePrev}
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 50,
                        backgroundColor: 'rgba(81, 81, 81, 0.60)',
                        borderRadius: '6px',
                        opacity: 1,
                        [theme.breakpoints.up('md')]: { opacity: 0 },
                        '&:hover': {
                          [theme.breakpoints.up('md')]: { opacity: 1 },
                          backgroundColor: 'rgba(81, 81, 81, 0.60)'
                        },
                        minWidth: 0,
                        padding: 0,
                        zIndex: 1
                      }}
                    >
                      <ArrowLeft color="#fff" />
                    </Button>
                  )}

                  <Box
                    component="img"
                    src={formatImageUrl(service?.images[idexOfImage], 85)}
                    alt={service.title}
                    onClick={() => setOpenImageModal(true)}
                    sx={{
                      borderRadius: '6px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer'
                    }}
                  />

                  {service.images.length > 1 && (
                    <Button
                      onClick={handleNext}
                      sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: 50,
                        backgroundColor: 'rgba(81, 81, 81, 0.60)',
                        borderRadius: '6px',
                        opacity: 1,
                        [theme.breakpoints.up('md')]: { opacity: 0 },
                        '&:hover': {
                          [theme.breakpoints.up('md')]: { opacity: 1 },
                          backgroundColor: 'rgba(81, 81, 81, 0.60)'
                        },
                        minWidth: 0,
                        padding: 0,
                        zIndex: 1
                      }}
                    >
                      <ArrowRight color="#fff" />
                    </Button>
                  )}
                </Box>

                {service.images.length > 1 && (
                  <Box
                    component="footer"
                    sx={(theme) => ({
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                      [theme.breakpoints.up('xs')]: {
                        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))'
                      },
                      width: '100%',
                      gap: '16px'
                    })}
                  >
                    {service.images.map((image: string, index: number) => (
                      <Box
                        component="img"
                        src={formatImageUrl(image, 55)}
                        alt={image}
                        key={image}
                        onClick={() => setIndexOfImage(index)}
                        sx={(theme) => ({
                          borderRadius: '6px',
                          boxShadow:
                            'var(--mui-shadow, 0px 1px 3px rgba(0,0,0,0.1))',
                          aspectRatio: '1 / 1',
                          width: '100%',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          ...(idexOfImage === index && {
                            boxShadow: theme.shadows[10],
                            border: '2px solid',
                            borderColor: 'forestGreen'
                          })
                        })}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            )}

            <Card
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                boxShadow: 'none',
                border: '1px solid #e0e0e0'
              }}
            >
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {t('service.description')}
              </Typography>
              <Box {...getHtmlDescriptionProps(service.description)} />
            </Card>

            <Grid container spacing={3} mb={4}>
              {service.services && service.services.length > 0 && (
                <Grid size={{ xs: 12 }}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      boxShadow: 'none',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <CheckCircle2 color="green" size={20} />
                      {t('service.includedServices')}
                    </Typography>
                    <Box
                      sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}
                    >
                      {service.services.map((s: string, i: number) => (
                        <Chip
                          key={i}
                          label={t(`service.serviceNames.${s}`, s)}
                          sx={{ bgcolor: 'primary.50' }}
                        />
                      ))}
                    </Box>
                  </Card>
                </Grid>
              )}

              {service.equipment && service.equipment.length > 0 && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: 3,
                      boxShadow: 'none',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {t('service.equipment')}
                    </Typography>
                    <Box
                      component="ul"
                      sx={{ pl: 2, m: 0, color: 'text.secondary' }}
                    >
                      {service.equipment.map((eq: string, i: number) => (
                        <li key={i} style={{ paddingBottom: 4 }}>
                          {eq}
                        </li>
                      ))}
                    </Box>
                  </Card>
                </Grid>
              )}

              {service.availability && service.availability.length > 0 && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: 3,
                      boxShadow: 'none',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Calendar size={20} />
                      {t('service.availability')}
                    </Typography>
                    <Box
                      component="ul"
                      sx={{ pl: 2, m: 0, color: 'text.secondary' }}
                    >
                      {service.availability.map((av: string, i: number) => (
                        <li key={i} style={{ paddingBottom: 4 }}>
                          {av}
                        </li>
                      ))}
                    </Box>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              sx={{
                position: 'sticky',
                top: 120,
                borderRadius: 1
              }}
            >
              <CardContent sx={{ padding: '24px' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px'
                  }}
                >
                  {provider?.profileImage ? (
                    <Box
                      component="img"
                      sx={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                      src={formatImageUrl(provider.profileImage, 55)}
                      alt={provider?.name}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: 'primary.main',
                        fontSize: 24
                      }}
                    >
                      {provider?.name?.[0]?.toUpperCase() || ''}
                    </Avatar>
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px'
                      }}
                    >
                      <BriefcaseBusiness />
                      <Typography variant="h3">
                        {provider?.shopName || provider?.name}
                      </Typography>
                    </Box>
                    <Typography variant="button">
                      {provider?.name} {provider?.lastname}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ marginY: 2 }} />

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mb: 4
                  }}
                >
                  {service.experienceYears !== undefined && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        color: 'text.secondary'
                      }}
                    >
                      <Clock size={20} />
                      <Typography variant="body2">
                        {service.experienceYears} {t('service.yearsExperience')}
                      </Typography>
                    </Box>
                  )}
                  {service.serviceRadiusKm !== undefined && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        color: 'text.secondary'
                      }}
                    >
                      <MapPin size={20} />
                      <Typography variant="body2">
                        {t('service.operatesWithin')} {service.serviceRadiusKm}{' '}
                        km
                      </Typography>
                    </Box>
                  )}
                  {service.languages && service.languages.length > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        color: 'text.secondary'
                      }}
                    >
                      <Languages size={20} />
                      <Typography variant="body2">
                        {service.languages.join(', ')}
                      </Typography>
                    </Box>
                  )}
                  {provider?.phone && (
                    <Box
                      component="a"
                      href={`tel:${provider.phone}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'primary.main',
                          transition: 'color 0.3s ease'
                        }
                      }}
                    >
                      <Phone size={20} />
                      <span>{provider.phone}</span>
                    </Box>
                  )}
                  {provider?.email && (
                    <Box
                      component="a"
                      href={`mailto:${provider.email}`}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'primary.main',
                          transition: 'color 0.3s ease'
                        }
                      }}
                    >
                      <Mail size={20} />
                      <span>{provider.email}</span>
                    </Box>
                  )}
                </Box>

                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  size="large"
                  startIcon={<Mail />}
                  onClick={() => setContactDialogOpen(true)}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }}
                >
                  {t('service.sendMessage')}
                </Button>

                {service.portfolioLinks &&
                  service.portfolioLinks.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        gutterBottom
                      >
                        {t('service.portfolioLinks')}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1
                        }}
                      >
                        {service.portfolioLinks.map(
                          (
                            link: { label: string; url: string },
                            idx: number
                          ) => (
                            <Button
                              key={idx}
                              component="a"
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              startIcon={<LinkIcon size={16} />}
                              variant="text"
                              size="small"
                              sx={{
                                justifyContent: 'flex-start',
                                textTransform: 'none'
                              }}
                            >
                              {link.label}
                            </Button>
                          )
                        )}
                      </Box>
                    </Box>
                  )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <FullImageDialog
        idexOfImage={idexOfImage}
        handleNext={handleNext}
        handlePrev={handlePrev}
        setOpenImageModal={setOpenImageModal}
        openImageModal={openImageModal}
        images={service.images}
        title={service.title}
      />

      {/* Contact Dialog */}
      <Dialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('service.contactProvider')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            {t('service.contactDialogDesc')}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label={t('service.phoneNumber')}
            type="tel"
            fullWidth
            variant="outlined"
            value={contactForm.phone}
            onChange={(e) =>
              setContactForm({ ...contactForm, phone: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label={t('service.message')}
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={contactForm.message}
            onChange={(e) =>
              setContactForm({ ...contactForm, message: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setContactDialogOpen(false)} color="inherit">
            {t('service.cancel')}
          </Button>
          <Button
            onClick={handleContactSubmit}
            variant="contained"
            disabled={!contactForm.phone || !contactForm.message || isSending}
          >
            {isSending ? <CircularProgress size={24} /> : t('service.send')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceDetailsPage;
