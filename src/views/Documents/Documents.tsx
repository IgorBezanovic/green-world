'use client';

import { AppBreadcrumbs, PageContent } from '@green-world/components';
import { Box, Divider, Typography, Button } from '@mui/material';
import { Heart, ShieldCheck, Trash2, Users, Info } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DonateRaiffeisenDialog } from './DonateRaiffaisenDialog';

export const Documents = () => {
  const { t } = useTranslation();
  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('documentsView.title'), route: '/documents' }
  ];

  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <PageContent sx={{ backgroundColor: 'background.paper' }}>
      <Box
        sx={(theme) => ({
          maxWidth: '1000px',
          width: '100%',
          mx: 'auto',
          px: '16px',
          py: '2rem',
          [theme.breakpoints.up('sm')]: {
            px: '1.5rem'
          },
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        })}
      >
        <AppBreadcrumbs pages={pages} />
        <Divider />

        <Box>
          <Typography variant="h2" sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Users /> {t('documentsView.sections.vision.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('documentsView.sections.vision.paragraph1')}
            <br />
            {t('documentsView.sections.vision.paragraph2')}
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h2" sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <ShieldCheck /> {t('documentsView.sections.privacy.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('documentsView.sections.privacy.paragraph1')}
            <br />
            {t('documentsView.sections.privacy.paragraph2')}
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h2" sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Heart /> {t('documentsView.sections.donations.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('documentsView.sections.donations.paragraph1')}
            <br />
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
        </Box>

        <Divider />

        <Box>
          <Typography variant="h2" sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Trash2 /> {t('documentsView.sections.accountDeletion.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('documentsView.sections.accountDeletion.prefix')}{' '}
            <strong>info@zelenisvet.rs</strong>.
            <br />
            {t('documentsView.sections.accountDeletion.suffix')}
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h2" sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <Info /> {t('documentsView.sections.disclaimer.title')}
          </Typography>
          <Typography variant="body1">
            {t('documentsView.sections.disclaimer.paragraph1')}
            <br />
            {t('documentsView.sections.disclaimer.paragraph2')}
          </Typography>
        </Box>
      </Box>
    </PageContent>
  );
};
