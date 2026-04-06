'use client';

import { MetaTags } from '@green-world/components';
import { useContactUs } from '@green-world/hooks/useContactUs';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  TextField,
  Typography
} from '@mui/material';
import {
  ChevronDown,
  Clock,
  Heart,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ContactUs = () => {
  const { t } = useTranslation();
  const { mutate, isPending } = useContactUs();

  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    subject: '',
    email: '',
    message: ''
  });

  const [expanded, setExpanded] = useState<string | false>(false);

  const handleAccordionChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullMessage = `
${t('contactUsView.form.labels.name')}: ${contactForm.name}
${t('contactUsView.form.labels.phone')}: ${contactForm.phone}

${t('contactUsView.form.labels.message')}:
${contactForm.message}`;

    mutate(
      { ...contactForm, message: fullMessage },
      {
        onSuccess: () =>
          setContactForm({
            name: '',
            phone: '',
            subject: '',
            email: '',
            message: ''
          })
      }
    );
  };

  const isFormValid = Boolean(
    contactForm.email.trim() &&
      contactForm.subject.trim() &&
      contactForm.message.trim()
  );

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <MetaTags
        title={t('seo.contactUs.title')}
        description={t('seo.contactUs.description')}
        keywords={t('seo.contactUs.keywords')}
      />

      {/* HERO */}
      <Box
        sx={(theme) => ({
          bgcolor: theme.palette.info.main,
          color: theme.palette.common.white,
          py: 6,
          px: 2
        })}
      >
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          <Typography
            sx={{
              fontFamily: 'Ephesis',
              fontSize: '3rem'
            }}
          >
            {t('contactUsView.hero.title')}
          </Typography>

          <Typography sx={{ maxWidth: 520, mt: 2, opacity: 0.9 }}>
            {t('contactUsView.hero.subtitle')}
          </Typography>
        </Box>
      </Box>

      {/* FEATURES */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box
          sx={{
            maxWidth: 1400,
            mx: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 4,
            flexWrap: 'wrap'
          }}
        >
          {/* Feature 1 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'success.light',
                color: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock style={{ width: '24px', height: '24px' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1">
                {t('contactUsView.features.fastResponse.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('contactUsView.features.fastResponse.desc')}
              </Typography>
            </Box>
          </Box>

          {/* Feature 2 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'warning.light',
                color: 'warning.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck style={{ width: '24px', height: '24px' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1">
                {t('contactUsView.features.secure.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('contactUsView.features.secure.desc')}
              </Typography>
            </Box>
          </Box>

          {/* Feature 3 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'success.light',
                color: 'success.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users style={{ width: '24px', height: '24px' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1">
                {t('contactUsView.features.support.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('contactUsView.features.support.desc')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* CONTENT */}
      <Box
        sx={(theme) => ({
          maxWidth: 1400,
          width: '100%',
          mx: 'auto',
          px: 2,
          py: 6,
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: 3,
          alignItems: 'start',
          [theme.breakpoints.down('md')]: {
            gridTemplateColumns: '1fr'
          }
        })}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: 'success.light',
              width: 'fit-content',
              px: 2,
              py: 0.5,
              borderRadius: 10,
              mb: 2
            }}
          >
            <MessageCircle />
            <Typography variant="body2" color="success.main" fontWeight={600}>
              {t('contactUsView.form.badge')}
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: 'Ephesis',
              fontSize: '2.5rem'
            }}
          >
            {t('contactUsView.form.title')}
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={4}>
            {t('contactUsView.form.subtitle')}
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Box
              sx={(theme) => ({
                display: 'grid',
                gridTemplateColumns: '1fr',
                [theme.breakpoints.up('md')]: {
                  gridTemplateColumns: '1fr 1fr'
                },
                gap: 3,
                mb: 3
              })}
            >
              <Box>
                <Typography variant="body1" mb={1}>
                  {t('contactUsView.form.labels.name')}
                </Typography>
                <TextField
                  fullWidth
                  placeholder={t('contactUsView.form.placeholders.name')}
                  name="name"
                  value={contactForm.name}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'common.white',
                      borderRadius: 2
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body1" mb={1}>
                  {t('contactUsView.form.labels.email')}
                </Typography>
                <TextField
                  fullWidth
                  placeholder={t('contactUsView.form.placeholders.email')}
                  name="email"
                  required
                  value={contactForm.email}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'common.white',
                      borderRadius: 2
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body1" mb={1}>
                  {t('contactUsView.form.labels.phone')}
                </Typography>
                <TextField
                  fullWidth
                  placeholder={t('contactUsView.form.placeholders.phone')}
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'common.white',
                      borderRadius: 2
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body1" mb={1}>
                  {t('contactUsView.form.labels.subject')}
                </Typography>
                <TextField
                  fullWidth
                  placeholder={t('contactUsView.form.placeholders.subject')}
                  name="subject"
                  required
                  value={contactForm.subject}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'common.white',
                      borderRadius: 2
                    }
                  }}
                />
              </Box>
            </Box>

            <Box mb={4}>
              <Typography variant="body1" mb={1}>
                {t('contactUsView.form.labels.message')}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder={t('contactUsView.form.placeholders.message')}
                name="message"
                required
                value={contactForm.message}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'common.white',
                    borderRadius: 2
                  }
                }}
              />
              <Button
                type="submit"
                size="large"
                fullWidth
                variant="contained"
                disabled={isPending || !isFormValid}
                startIcon={<Send size={18} />}
                sx={{
                  mt: 4
                }}
              >
                {t('contactUsView.form.submit')}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* RIGHT – INFO */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Card 2: Contact Information */}
          <Box
            sx={{
              width: '100%',
              backgroundColor: 'background.paper',
              borderRadius: 2,
              p: 4,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontFamily: 'Ephesis', fontSize: '2rem', mb: 3 }}
            >
              {t('contactUsView.info.title')}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: 'success.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'success.main'
                  }}
                >
                  <Mail size={24} />
                </Box>
                <Box>
                  <Typography color="text.secondary">
                    {t('contactUsView.info.email')}
                  </Typography>
                  <Typography fontWeight={600}>info@zelenisvet.rs</Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: 'success.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'success.main'
                  }}
                >
                  <MapPin size={24} />
                </Box>
                <Box>
                  <Typography color="text.secondary">
                    {t('contactUsView.info.addressTitle')}
                  </Typography>
                  <Typography fontWeight={500}>
                    {t('contactUsView.info.addressValue')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Card 2: Support Hours */}
          <Box
            sx={{
              width: '100%',
              backgroundColor: 'background.paper',
              borderRadius: 2,
              p: 4,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'success.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'success.main'
                }}
              >
                <Clock style={{ width: '24px', height: '24px' }} />
              </Box>
              <Typography
                variant="h5"
                sx={{ fontFamily: 'Ephesis', fontSize: '2rem' }}
              >
                {t('contactUsView.supportHours.title')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pb: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography color="text.secondary">
                  {t('contactUsView.supportHours.weekdays')}
                </Typography>
                <Typography fontWeight={600}>09:00 - 17:00</Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pb: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Typography color="text.secondary">
                  {t('contactUsView.supportHours.saturday')}
                </Typography>
                <Typography fontWeight={600}>10:00 - 14:00</Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography color="text.secondary">
                  {t('contactUsView.supportHours.sunday')}
                </Typography>
                <Typography fontWeight={600}>
                  {t('contactUsView.supportHours.closed')}
                </Typography>
              </Box>

              <Typography
                color="text.secondary"
                sx={{ mt: 1, display: 'block' }}
              >
                {t('contactUsView.supportHours.note')}
              </Typography>
            </Box>
          </Box>
          {/* Card 1: Why Communication Matters */}
          <Box
            sx={{
              width: '100%',
              backgroundColor: 'background.paper',
              borderRadius: 2,
              p: 4,
              boxShadow: '0px 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: 'warning.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'warning.main'
                }}
              >
                <Heart size={24} />
              </Box>
              <Typography
                variant="h5"
                sx={{ fontFamily: 'Ephesis', fontSize: '2rem' }}
              >
                {t('contactUsView.whyUs.title')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[
                {
                  title: t('contactUsView.whyUs.items.item1.title'),
                  desc: t('contactUsView.whyUs.items.item1.desc')
                },
                {
                  title: t('contactUsView.whyUs.items.item2.title'),
                  desc: t('contactUsView.whyUs.items.item2.desc')
                },
                {
                  title: t('contactUsView.whyUs.items.item3.title'),
                  desc: t('contactUsView.whyUs.items.item3.desc')
                }
              ].map((item, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ mt: 0.5, color: 'success.main', minWidth: 24 }}>
                    <Sparkles size={20} />
                  </Box>
                  <Box>
                    <Typography fontWeight={600} gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* FAQ SECTION */}
      <Box sx={{ mt: 4, mb: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'success.light',
                color: 'success.main',
                px: 2,
                py: 0.5,
                borderRadius: 10,
                mb: 2
              }}
            >
              <Leaf size={16} />
              <Typography variant="body2" color="success.main" fontWeight={600}>
                {t('contactUsView.faq.badge')}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: 'Ephesis',
                fontSize: '3rem',
                color: 'success.dark',
                mb: 2
              }}
            >
              {t('contactUsView.faq.title')}
            </Typography>
            <Typography color="text.secondary">
              {t('contactUsView.faq.subtitle')}
            </Typography>
          </Box>

          <Box
            sx={{
              maxWidth: 800,
              mx: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            {[
              {
                q: t('contactUsView.faq.items.q1.q'),
                a: t('contactUsView.faq.items.q1.a')
              },
              {
                q: t('contactUsView.faq.items.q2.q'),
                a: t('contactUsView.faq.items.q2.a')
              },
              {
                q: t('contactUsView.faq.items.q3.q'),
                a: t('contactUsView.faq.items.q3.a')
              },
              {
                q: t('contactUsView.faq.items.q4.q'),
                a: t('contactUsView.faq.items.q4.a')
              },
              {
                q: t('contactUsView.faq.items.q5.q'),
                a: t('contactUsView.faq.items.q5.a')
              }
            ].map((item, index) => (
              <Accordion
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleAccordionChange(`panel${index}`)}
                elevation={0}
                sx={{
                  '&:before': { display: 'none' },
                  borderRadius: '12px !important',
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden'
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ChevronDown style={{ width: '20px', height: '20px' }} />
                  }
                  sx={{
                    fontWeight: 600,
                    '&.Mui-expanded': { color: 'success.main' }
                  }}
                >
                  {item.q}
                </AccordionSummary>
                <AccordionDetails sx={{ color: 'text.secondary' }}>
                  {item.a}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* SATISFACTION BANNER */}
      <Box
        sx={{
          bgcolor: 'info.main',
          color: 'common.white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Leaf style={{ width: 48, height: 48 }} />
          </Box>
          <Typography
            sx={{
              fontFamily: 'Ephesis',
              fontSize: '3.5rem',
              mb: 2
            }}
          >
            {t('contactUsView.footerBanner.title')}
          </Typography>
          <Typography sx={{ opacity: 0.9, mb: 4, maxWidth: 600, mx: 'auto' }}>
            {t('contactUsView.footerBanner.subtitle')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Mail />}
            sx={{
              bgcolor: 'common.white',
              color: 'success.dark',
              fontWeight: 600,
              textTransform: 'none',
              py: 1.5,
              px: 4,
              borderRadius: 10,
              '&:hover': {
                bgcolor: 'common.white'
              }
            }}
          >
            info@zelenisvet.rs
          </Button>
        </Container>
      </Box>
    </Box>
  );
};
