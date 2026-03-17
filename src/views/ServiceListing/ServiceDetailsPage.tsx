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
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Avatar
} from '@mui/material';
import {
  MapPin,
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  Languages,
  Link as LinkIcon
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';

const ServiceDetailsPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { t } = useTranslation();

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

  const provider = service.providerId as any;

  return (
    <Box
      sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8, pt: 4 }}
    >
      <Box
        sx={(theme) => ({
          maxWidth: '1400px',
          mx: 'auto',
          px: 2,
          [theme.breakpoints.up('sm')]: { px: 3 },
          [theme.breakpoints.up('xl')]: { px: 0 }
        })}
      >
        <Button
          component={Link}
          to="/services"
          startIcon={<ArrowLeft />}
          sx={{ mb: 4, color: 'text.secondary' }}
        >
          {t('service.backToServices')}
        </Button>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box mb={4}>
              <Typography
                variant="h3"
                component="h1"
                fontWeight="bold"
                gutterBottom
              >
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

            {/* Images Gallery Placeholder - Just showing the first one for now */}
            {service.images && service.images.length > 0 && (
              <Box
                component="img"
                src={formatImageUrl(service.images[0], 100)}
                alt={service.title}
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 3,
                  mb: 4,
                  boxShadow: 2
                }}
              />
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
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                p: 3,
                position: 'sticky',
                top: 24,
                borderRadius: 3,
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t('service.contactProvider')}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mt: 3,
                  mb: 3
                }}
              >
                <Avatar
                  src={
                    provider?.profileImage
                      ? formatImageUrl(provider.profileImage, 55)
                      : undefined
                  }
                  alt={provider?.name}
                  sx={{ width: 64, height: 64 }}
                />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {provider?.name} {provider?.lastname}
                  </Typography>
                  {provider?.shopName && (
                    <Typography variant="body2" color="text.secondary">
                      {provider?.shopName}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}
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
                      {t('service.operatesWithin')} {service.serviceRadiusKm} km
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
              </Box>

              <Button
                variant="contained"
                color="primary"
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

              {service.portfolioLinks && service.portfolioLinks.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {t('service.portfolioLinks')}
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    {service.portfolioLinks.map(
                      (link: { label: string; url: string }, idx: number) => (
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
            </Card>
          </Grid>
        </Grid>
      </Box>

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
