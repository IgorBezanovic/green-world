'use client';

import {
  AppBreadcrumbs,
  SendMessageDialog,
  ImageGallery,
  VoteButtons,
  CopyLinkButton,
  BookmarkButton,
  PageCenteredState,
  PageContent,
  DeletedItemOverlay
} from '@green-world/components';
import UserContext from '@green-world/context/UserContext';
import {
  useGetServiceById,
  useSendDirectEmailToServiceProvider
} from '@green-world/hooks/useServices';
import { useVoteService } from '@green-world/hooks/useVoteService';
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
  OutlinedInput,
  FormControl,
  Divider,
  Avatar,
  Tooltip,
  Skeleton,
  useTheme
} from '@mui/material';
import {
  MapPin,
  ArrowLeft,
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
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

export const ServiceDetailsPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const { isUserLoggedIn, userId } = useContext(UserContext);

  const {
    data: serviceResponse,
    isLoading,
    isError
  } = useGetServiceById(serviceId || '');
  const service = serviceResponse;

  const { mutate: sendDirectEmail, isPending: isSendingDirectEmail } =
    useSendDirectEmailToServiceProvider();
  const { mutate: voteMutate } = useVoteService(serviceId || '');

  const handleServiceVote = (vote: 'like' | 'dislike' | string) => {
    if (!serviceId) return;
    voteMutate({ vote });
  };

  const [openSendMessageDialog, setOpenSendMessageDialog] = useState(false);
  const [directEmailDialogOpen, setDirectEmailDialogOpen] = useState(false);
  const [directEmailForm, setDirectEmailForm] = useState({
    name: '',
    phone: '',
    message: ''
  });

  if (isLoading) {
    return (
      <PageContent sx={{ bgcolor: 'background.default', pb: 8, pt: 4 }}>
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
            <Grid size={{ xs: 12, md: 7 }}>
              <Skeleton variant="text" width="60%" height={72} sx={{ mb: 2 }} />
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                  mb: 3
                }}
              >
                <Skeleton variant="rounded" width={120} height={32} />
                <Skeleton variant="rounded" width={180} height={32} />
              </Box>
              <Skeleton
                sx={{ borderRadius: 2 }}
                variant="rectangular"
                height={420}
              />
              <Skeleton
                variant="rectangular"
                height={220}
                sx={{ borderRadius: 2, mt: 4 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Skeleton
                variant="rectangular"
                height={220}
                sx={{ borderRadius: 2, mb: 2 }}
              />
              <Skeleton
                variant="rectangular"
                height={140}
                sx={{ borderRadius: 2, mb: 2 }}
              />
              <Skeleton
                variant="rectangular"
                height={60}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          </Grid>
        </Box>
      </PageContent>
    );
  }

  if (isError || !service) {
    return (
      <PageContent sx={{ bgcolor: 'background.default', pb: 8, pt: 4 }}>
        <PageCenteredState sx={{ bgcolor: 'background.default' }}>
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
              startIcon={<ArrowLeft size={18} />}
              onClick={() => navigate('/services')}
              variant="outlined"
              sx={{ mt: 2 }}
            >
              {t('service.backToServices')}
            </Button>
          </Box>
        </PageCenteredState>
      </PageContent>
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

  const provider = service.providerId as any;
  const isProviderSelf = userId === provider?._id;
  const sendMessageDisabled = !isUserLoggedIn || isProviderSelf;
  const sendDirectEmailDisabled = !isUserLoggedIn || isProviderSelf;
  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('breadcrumbs.services', 'Usluge'), route: '/services' },
    {
      label: service.title || t('service.notFound'),
      route: `/services/${serviceId}`
    }
  ];

  const singleLineEllipsisSx = {
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  return (
    <PageContent sx={{ bgcolor: 'background.default', pb: 8, pt: 4 }}>
      {(service as any)?.status === 'deleted' && (
        <DeletedItemOverlay
          itemType="uslugu"
          creatorId={provider?._id}
          creatorNotFound={!isLoading && !provider}
        />
      )}
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
                    '& svg': {
                      flexShrink: 0
                    },
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
              <ImageGallery
                images={service.images}
                title={service.title}
                mainImageQuality={85}
                mb={4}
              />
            )}

            <Box
              sx={(theme) => ({
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                gap: 1.25,
                my: 3,
                [theme.breakpoints.up('sm')]: {
                  alignItems: 'center',
                  flexDirection: 'row'
                }
              })}
            >
              <VoteButtons
                likes={service.likes}
                dislikes={service.dislikes}
                onVote={handleServiceVote}
              />
              <CopyLinkButton
                successMessage={t('service.linkCopied')}
                errorMessage={t('service.linkCopyFailed')}
              />
              <BookmarkButton />
            </Box>
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
                    <Box
                      sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}
                    >
                      {service.equipment.map((eq: string, i: number) => (
                        <Chip
                          key={i}
                          label={eq}
                          sx={{
                            bgcolor: 'primary.light',
                            ...theme.typography.body1
                          }}
                        />
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
                    <Box
                      sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}
                    >
                      {service.languages.map((lang: string, i: number) => (
                        <Chip
                          key={i}
                          label={lang}
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
              sx={(theme) => ({
                position: 'static',
                borderRadius: 1,
                [theme.breakpoints.up('md')]: {
                  position: 'sticky',
                  top: 120
                }
              })}
            >
              <CardContent sx={{ padding: '24px' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    '@media (max-width:340px)': {
                      flexDirection: 'column',
                      alignItems: 'center'
                    }
                  }}
                >
                  {provider?.profileImage ? (
                    <Box
                      component="img"
                      sx={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        cursor: provider?._id ? 'pointer' : 'default'
                      }}
                      src={formatImageUrl(provider.profileImage, 55)}
                      alt={provider?.name}
                      onClick={() =>
                        provider?._id && navigate(`/shop/${provider._id}`)
                      }
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: 'primary.main',
                        fontSize: 24,
                        cursor: provider?._id ? 'pointer' : 'default'
                      }}
                      onClick={() =>
                        provider?._id && navigate(`/shop/${provider._id}`)
                      }
                    >
                      {provider?.name?.[0]?.toUpperCase() || ''}
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      '@media (max-width:340px)': {
                        width: '100%'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        '& svg': {
                          flexShrink: 0,
                          width: 24,
                          height: 24
                        },
                        marginBottom: '8px',
                        justifyContent: 'flex-start'
                      }}
                    >
                      <BriefcaseBusiness />
                      <Typography
                        variant="h3"
                        sx={{
                          ...singleLineEllipsisSx,
                          cursor: provider?._id ? 'pointer' : 'default'
                        }}
                        onClick={() =>
                          provider?._id && navigate(`/shop/${provider._id}`)
                        }
                      >
                        {provider?.shopName || provider?.name}
                      </Typography>
                    </Box>
                    <Typography variant="button" sx={singleLineEllipsisSx}>
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
                    '& svg': {
                      flexShrink: 0
                    },
                    mb: 4
                  }}
                >
                  {service.experienceYears !== undefined && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        flexWrap: 'nowrap',
                        minWidth: 0,
                        color: 'text.secondary'
                      }}
                    >
                      <ClipboardClock style={{ width: 20, height: 20 }} />
                      <Typography variant="body1" sx={singleLineEllipsisSx}>
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
                        flexWrap: 'nowrap',
                        minWidth: 0,
                        color: 'text.secondary'
                      }}
                    >
                      <MapPin style={{ width: 20, height: 20 }} />
                      <Typography variant="body1" sx={singleLineEllipsisSx}>
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
                        flexWrap: 'nowrap',
                        minWidth: 0,
                        color: 'text.secondary'
                      }}
                    >
                      <Languages style={{ width: 20, height: 20 }} />
                      <Typography variant="body1" sx={singleLineEllipsisSx}>
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
                        flexWrap: 'nowrap',
                        minWidth: 0,
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'primary.main',
                          transition: 'color 0.3s ease'
                        }
                      }}
                    >
                      <Phone style={{ width: 20, height: 20 }} />
                      <Typography variant="body1" sx={singleLineEllipsisSx}>
                        {provider.phone}
                      </Typography>
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
                        flexWrap: 'nowrap',
                        minWidth: 0,
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'primary.main',
                          transition: 'color 0.3s ease'
                        }
                      }}
                    >
                      <Mail style={{ width: 20, height: 20 }} />
                      <Typography variant="body1" sx={singleLineEllipsisSx}>
                        {provider.email}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Tooltip
                  title={
                    !isUserLoggedIn
                      ? t('productPage.mustLoginToMessage')
                      : isProviderSelf
                        ? t('productPage.cannotMessageSelf')
                        : ''
                  }
                  disableHoverListener={isUserLoggedIn && !isProviderSelf}
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
                    !isUserLoggedIn
                      ? t('service.mustLoginToSendDirectEmail')
                      : isProviderSelf
                        ? t('productPage.cannotMessageSelf')
                        : ''
                  }
                  disableHoverListener={isUserLoggedIn && !isProviderSelf}
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
    </PageContent>
  );
};
