import { AppBreadcrumbs, SendMessageDialog } from '@green-world/components';
import {
  useGetServiceById,
  useSendDirectEmailToServiceProvider
} from '@green-world/hooks/useServices';
import { getItem } from '@green-world/utils/cookie';
import {
  formatImageUrl,
  getHtmlDescriptionProps,
  safeDecodeToken
} from '@green-world/utils/helpers';
import { DecodedToken } from '@green-world/utils/types';
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
  OutlinedInput,
  FormControl,
  Divider,
  Avatar,
  Tooltip,
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
  ClipboardClock,
  Toolbox,
  Languages,
  Link as LinkIcon,
  PencilRuler,
  MessageCircleMore
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

  const { mutate: sendDirectEmail, isPending: isSendingDirectEmail } =
    useSendDirectEmailToServiceProvider();

  const decodedToken = safeDecodeToken<DecodedToken>(getItem('token'));

  const [openSendMessageDialog, setOpenSendMessageDialog] = useState(false);
  const [directEmailDialogOpen, setDirectEmailDialogOpen] = useState(false);
  const [directEmailForm, setDirectEmailForm] = useState({
    name: '',
    phone: '',
    message: ''
  });
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

  const handleDirectEmailSubmit = () => {
    if (
      serviceId &&
      directEmailForm.name &&
      directEmailForm.phone &&
      directEmailForm.message
    ) {
      sendDirectEmail(
        { id: serviceId, ...directEmailForm },
        {
          onSuccess: () => {
            setDirectEmailDialogOpen(false);
            setDirectEmailForm({ name: '', phone: '', message: '' });
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
  const sendMessageDisabled =
    !decodedToken?._id || decodedToken?._id === provider?._id;
  const sendDirectEmailDisabled =
    !decodedToken?._id || decodedToken?._id === provider?._id;
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
                  <MapPin />
                  <Typography variant="body1">
                    {service.location || t('service.notSpecified')}
                  </Typography>
                </Box>
                {service.priceFrom && (
                  <Typography
                    variant="h4"
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
                      <Toolbox style={{ width: 24, height: 24 }} />
                      {t('service.includedServices')}
                    </Typography>
                    <Box
                      sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}
                    >
                      {service.services.map((s: string, i: number) => (
                        <Chip
                          key={i}
                          label={t(`service.serviceNames.${s}`, s)}
                          sx={{
                            bgcolor: 'success.light',
                            ...theme.typography.body1
                          }}
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
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1
                      }}
                    >
                      <PencilRuler style={{ width: 24, height: 24 }} />
                      {t('service.equipment')}
                    </Typography>
                    <Box component="ul" sx={{ m: 0, color: 'text.secondary' }}>
                      {service.equipment.map((eq: string, i: number) => (
                        <li key={i} style={{ paddingBottom: 4 }}>
                          {eq}
                        </li>
                      ))}
                    </Box>
                  </Card>
                </Grid>
              )}

              {service.languages && service.languages.length > 0 && (
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
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1
                      }}
                    >
                      <Languages style={{ width: 24, height: 24 }} />
                      {t('service.languagesProvided')}
                    </Typography>
                    <Box component="ul" sx={{ m: 0, color: 'text.secondary' }}>
                      {service.languages.map((lang: string, i: number) => (
                        <li key={i} style={{ paddingBottom: 4 }}>
                          {lang}
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
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1
                      }}
                    >
                      <Calendar style={{ width: 24, height: 24 }} />
                      {t('service.availability')}
                    </Typography>
                    <Box component="ul" sx={{ m: 0, color: 'text.secondary' }}>
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
                      <ClipboardClock style={{ width: 20, height: 20 }} />
                      <Typography variant="body1">
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
                      <MapPin style={{ width: 20, height: 20 }} />
                      <Typography variant="body1">
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
                      <Languages style={{ width: 20, height: 20 }} />
                      <Typography variant="body1">
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
                      <Phone style={{ width: 20, height: 20 }} />
                      <Typography variant="body1">{provider.phone}</Typography>
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
                      <Mail style={{ width: 20, height: 20 }} />
                      <Typography variant="body1">{provider.email}</Typography>
                    </Box>
                  )}
                </Box>

                <Tooltip
                  title={
                    !decodedToken?._id
                      ? t('productPage.mustLoginToMessage')
                      : decodedToken?._id === provider?._id
                        ? t('productPage.cannotMessageSelf')
                        : ''
                  }
                  disableHoverListener={
                    Boolean(decodedToken?._id) &&
                    decodedToken?._id !== provider?._id
                  }
                  arrow
                >
                  <span style={{ display: 'block' }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      size="large"
                      startIcon={
                        <MessageCircleMore
                          style={{
                            width: 20,
                            height: 20,
                            color: sendMessageDisabled
                              ? theme.palette.action.disabled
                              : theme.palette.secondary.main
                          }}
                        />
                      }
                      disabled={sendMessageDisabled}
                      onClick={() => setOpenSendMessageDialog(true)}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1rem'
                      }}
                    >
                      {t('service.sendMessage')}
                    </Button>
                  </span>
                </Tooltip>

                <Tooltip
                  title={
                    !decodedToken?._id
                      ? t('service.mustLoginToSendDirectEmail')
                      : decodedToken?._id === provider?._id
                        ? t('productPage.cannotMessageSelf')
                        : ''
                  }
                  disableHoverListener={
                    Boolean(decodedToken?._id) &&
                    decodedToken?._id !== provider?._id
                  }
                  arrow
                >
                  <span style={{ display: 'block', marginTop: 12 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      size="large"
                      disabled={sendDirectEmailDisabled}
                      startIcon={
                        <Mail
                          style={{
                            width: 20,
                            height: 20,
                            color: sendDirectEmailDisabled
                              ? theme.palette.action.disabled
                              : theme.palette.secondary.main
                          }}
                        />
                      }
                      onClick={() => setDirectEmailDialogOpen(true)}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: 'none',
                        fontSize: '1rem'
                      }}
                    >
                      {t('service.sendDirectEmail')}
                    </Button>
                  </span>
                </Tooltip>

                {provider?.phone && (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    component="a"
                    href={`tel:${provider.phone}`}
                    startIcon={
                      <Phone
                        style={{ color: 'white', width: 20, height: 20 }}
                      />
                    }
                    sx={{
                      mt: 1.5,
                      borderRadius: 2,
                      py: 1.5,
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                  >
                    {t('service.callProvider')}
                  </Button>
                )}

                {service.portfolioLinks &&
                  service.portfolioLinks.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                      <Typography
                        variant="subtitle1"
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
                              startIcon={<LinkIcon />}
                              variant="text"
                              sx={{
                                ...theme.typography.body1,
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
      {/* Direct Email Dialog */}
      <Dialog
        open={directEmailDialogOpen}
        onClose={() => setDirectEmailDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('service.sendDirectEmail')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            {t('service.directEmailDialogDesc')}
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography
              component="label"
              htmlFor="direct-email-name"
              sx={{ mb: 1, fontSize: '0.875rem', color: 'text.secondary' }}
            >
              {t('service.yourName')}
            </Typography>
            <OutlinedInput
              autoFocus
              id="direct-email-name"
              type="text"
              value={directEmailForm.name}
              onChange={(e) =>
                setDirectEmailForm({ ...directEmailForm, name: e.target.value })
              }
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography
              component="label"
              htmlFor="direct-email-phone"
              sx={{ mb: 1, fontSize: '0.875rem', color: 'text.secondary' }}
            >
              {t('service.phoneNumber')}
            </Typography>
            <OutlinedInput
              id="direct-email-phone"
              type="tel"
              value={directEmailForm.phone}
              onChange={(e) =>
                setDirectEmailForm({
                  ...directEmailForm,
                  phone: e.target.value
                })
              }
            />
          </FormControl>
          <FormControl fullWidth>
            <Typography
              component="label"
              htmlFor="direct-email-message"
              sx={{ mb: 1, fontSize: '0.875rem', color: 'text.secondary' }}
            >
              {t('service.message')}
            </Typography>
            <OutlinedInput
              id="direct-email-message"
              multiline
              rows={4}
              value={directEmailForm.message}
              onChange={(e) =>
                setDirectEmailForm({
                  ...directEmailForm,
                  message: e.target.value
                })
              }
            />
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setDirectEmailDialogOpen(false)}
            color="inherit"
          >
            {t('service.cancel')}
          </Button>
          <Button
            onClick={handleDirectEmailSubmit}
            variant="contained"
            disabled={
              !directEmailForm.name ||
              !directEmailForm.phone ||
              !directEmailForm.message ||
              isSendingDirectEmail
            }
          >
            {isSendingDirectEmail ? (
              <CircularProgress size={24} />
            ) : (
              t('service.send')
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <SendMessageDialog
        open={openSendMessageDialog}
        onClose={() => setOpenSendMessageDialog(false)}
        userId={provider?._id || ''}
      />
    </Box>
  );
};

export default ServiceDetailsPage;
