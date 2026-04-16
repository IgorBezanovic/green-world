'use client';

import { AppBreadcrumbs, PageContent } from '@green-world/components';
import {
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Typography,
  Button,
  alpha,
  useTheme
} from '@mui/material';
import {
  Heart,
  ShieldCheck,
  Trash2,
  Users,
  Info,
  Bot,
  Lock,
  Eye,
  FileText,
  MessageSquare,
  Search,
  ImageIcon,
  UserCheck,
  ShieldAlert,
  Globe
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DonateRaiffeisenDialog } from './DonateRaiffaisenDialog';

// ── Reusable section wrapper ──────────────────────────────────────────────────
const Section = ({
  icon,
  title,
  children,
  accent
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent?: string;
}) => {
  const theme = useTheme();
  return (
    <Box
      component="section"
      sx={{
        borderLeft: `4px solid ${accent ?? theme.palette.primary.main}`,
        pl: 3,
        py: 0.5
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box
          sx={{
            color: accent ?? 'primary.main',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {icon}
        </Box>
        <Typography variant="h5" fontWeight={700}>
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );
};

// ── AI usage card ─────────────────────────────────────────────────────────────
const AiCard = ({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  const theme = useTheme();
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        bgcolor: alpha(theme.palette.success.light, 0.06),
        borderColor: alpha(theme.palette.success.main, 0.2),
        height: '100%'
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.success.main, 0.12),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'success.dark'
        }}
      >
        {icon}
      </Box>
      <Typography fontWeight={700} variant="body1">
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ lineHeight: 1.6 }}
      >
        {description}
      </Typography>
    </Paper>
  );
};

export const Documents = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('documentsView.title'), route: '/documents' }
  ];

  const [donateOpen, setDonateOpen] = useState(false);

  const aiUsages = [
    {
      icon: <ShieldAlert size={20} />,
      title: t('documentsView.ai.uses.moderation.title'),
      description: t('documentsView.ai.uses.moderation.description')
    },
    {
      icon: <Search size={20} />,
      title: t('documentsView.ai.uses.search.title'),
      description: t('documentsView.ai.uses.search.description')
    },
    {
      icon: <ImageIcon size={20} />,
      title: t('documentsView.ai.uses.imageCheck.title'),
      description: t('documentsView.ai.uses.imageCheck.description')
    },
    {
      icon: <UserCheck size={20} />,
      title: t('documentsView.ai.uses.profileCheck.title'),
      description: t('documentsView.ai.uses.profileCheck.description')
    },
    {
      icon: <MessageSquare size={20} />,
      title: t('documentsView.ai.uses.comments.title'),
      description: t('documentsView.ai.uses.comments.description')
    },
    {
      icon: <FileText size={20} />,
      title: t('documentsView.ai.uses.blogCheck.title'),
      description: t('documentsView.ai.uses.blogCheck.description')
    }
  ];

  const verificationStates = [
    {
      color: 'rgba(0,128,128,0.10)',
      border: 'rgba(0,128,128,0.30)',
      textColor: 'teal',
      icon: <ShieldCheck size={16} />,
      label: t('documentsView.ai.badge.verified.label'),
      description: t('documentsView.ai.badge.verified.description')
    },
    {
      color: alpha(theme.palette.warning.main, 0.1),
      border: alpha(theme.palette.warning.main, 0.35),
      textColor: theme.palette.warning.dark,
      icon: <ShieldAlert size={16} />,
      label: t('documentsView.ai.badge.flagged.label'),
      description: t('documentsView.ai.badge.flagged.description')
    },
    {
      color: alpha(theme.palette.action.hover, 1),
      border: alpha(theme.palette.divider, 1),
      textColor: theme.palette.text.secondary,
      icon: <Eye size={16} />,
      label: t('documentsView.ai.badge.checking.label'),
      description: t('documentsView.ai.badge.checking.description')
    }
  ];

  return (
    <PageContent>
      <Box
        sx={(theme) => ({
          maxWidth: '900px',
          width: '100%',
          mx: 'auto',
          px: '16px',
          py: '2rem',
          [theme.breakpoints.up('sm')]: { px: '1.5rem' },
          display: 'flex',
          flexDirection: 'column',
          gap: 5
        })}
      >
        <AppBreadcrumbs pages={pages} />

        {/* ── Hero ── */}
        <Box
          sx={{
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.success.light, 0.12)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            p: { xs: 3, sm: 5 },
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5
          }}
        >
          <Chip
            label={t('documentsView.hero.chip')}
            size="small"
            icon={<Globe size={14} />}
            sx={{
              alignSelf: 'flex-start',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.dark',
              fontWeight: 600
            }}
          />
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              fontFamily: 'var(--font-ephesis, Ephesis), cursive',
              fontSize: { xs: '2rem', sm: '2.8rem' },
              color: 'secondary.main',
              lineHeight: 1.2
            }}
          >
            {t('documentsView.hero.title')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 560 }}
          >
            {t('documentsView.hero.subtitle')}
          </Typography>
        </Box>

        {/* ── Vision ── */}
        <Section
          icon={<Users size={22} />}
          title={t('documentsView.sections.vision.title')}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            {t('documentsView.sections.vision.paragraph1')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('documentsView.sections.vision.paragraph2')}
          </Typography>
        </Section>

        <Divider />

        {/* ── AI moderation ── */}
        <Section
          icon={<Bot size={22} />}
          title={t('documentsView.ai.title')}
          accent={theme.palette.success.main}
        >
          <Typography variant="body1" sx={{ mb: 3 }}>
            {t('documentsView.ai.intro')}
          </Typography>

          {/* AI usage cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {aiUsages.map((item) => (
              <Grid key={item.title} size={{ xs: 12, sm: 6, md: 4 }}>
                <AiCard
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              </Grid>
            ))}
          </Grid>

          {/* Badge meaning */}
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            {t('documentsView.ai.badge.title')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {verificationStates.map((state) => (
              <Paper
                key={state.label}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  bgcolor: state.color,
                  borderColor: state.border
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    color: state.textColor,
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    flexShrink: 0,
                    mt: 0.3,
                    minWidth: 130
                  }}
                >
                  {state.icon}
                  {state.label}
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {state.description}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* Data privacy in AI context */}
          <Paper
            variant="outlined"
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.info.main, 0.04),
              borderColor: alpha(theme.palette.info.main, 0.2)
            }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}
            >
              <Lock size={18} color={theme.palette.info.main} />
              <Typography fontWeight={700} color="info.dark">
                {t('documentsView.ai.dataPrivacy.title')}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              {t('documentsView.ai.dataPrivacy.body')}
            </Typography>
          </Paper>
        </Section>

        <Divider />

        {/* ── Privacy ── */}
        <Section
          icon={<ShieldCheck size={22} />}
          title={t('documentsView.sections.privacy.title')}
          accent={theme.palette.info.main}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            {t('documentsView.sections.privacy.paragraph1')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('documentsView.sections.privacy.paragraph2')}
          </Typography>
        </Section>

        <Divider />

        {/* ── Disclaimer ── */}
        <Section
          icon={<Info size={22} />}
          title={t('documentsView.sections.disclaimer.title')}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            {t('documentsView.sections.disclaimer.paragraph1')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('documentsView.sections.disclaimer.paragraph2')}
          </Typography>
        </Section>

        <Divider />

        {/* ── Account deletion ── */}
        <Section
          icon={<Trash2 size={22} />}
          title={t('documentsView.sections.accountDeletion.title')}
          accent={theme.palette.error.main}
        >
          <Typography variant="body1">
            {t('documentsView.sections.accountDeletion.prefix')}{' '}
            <strong>info@zelenisvet.rs</strong>.{' '}
            {t('documentsView.sections.accountDeletion.suffix')}
          </Typography>
        </Section>

        <Divider />

        {/* ── Donations ── */}
        <Section
          icon={<Heart size={22} />}
          title={t('documentsView.sections.donations.title')}
          accent={theme.palette.secondary.main}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            {t('documentsView.sections.donations.paragraph1')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2.5 }}>
            {t('documentsView.sections.donations.paragraph2')}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ position: 'relative' }}
            onClick={() => setDonateOpen(true)}
          >
            {t('documentsView.sections.donations.button')}
          </Button>

          <DonateRaiffeisenDialog
            open={donateOpen}
            onClose={() => setDonateOpen(false)}
          />
        </Section>
      </Box>
    </PageContent>
  );
};
