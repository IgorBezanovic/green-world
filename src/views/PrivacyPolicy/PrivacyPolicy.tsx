'use client';

import { AppBreadcrumbs, PageContent } from '@green-world/components';
import { Box, Typography, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('privacyPolicyView.title'), route: '/privacy-policy' }
  ];

  return (
    <PageContent>
      <Box
        sx={(theme) => ({
          maxWidth: '1400px',
          width: '100%',
          mx: 'auto',
          px: '16px',
          py: '1.75rem',
          gap: 4,
          [theme.breakpoints.up('sm')]: {
            px: '1.5rem'
          },
          [theme.breakpoints.up('xl')]: {
            px: 0
          },
          display: 'flex',
          flexDirection: 'column'
        })}
      >
        <AppBreadcrumbs pages={pages} />

        <Container maxWidth="md" sx={{ py: 6 }}>
          <Typography variant="h3" gutterBottom>
            {t('privacyPolicyView.title')}
          </Typography>

          <Typography variant="body1">
            {t('privacyPolicyView.intro')}
          </Typography>

          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              {t('privacyPolicyView.sections.dataCollection.title')}
            </Typography>
            <Typography variant="body1">
              {t('privacyPolicyView.sections.dataCollection.body')}
            </Typography>
          </Box>

          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              {t('privacyPolicyView.sections.dataUsage.title')}
            </Typography>
            <Typography variant="body1">
              {t('privacyPolicyView.sections.dataUsage.body')}
            </Typography>
          </Box>

          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              {t('privacyPolicyView.sections.platform.title')}
            </Typography>
            <Typography variant="body1">
              {t('privacyPolicyView.sections.platform.body')}
            </Typography>
          </Box>

          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              {t('privacyPolicyView.sections.deletionAndContact.title')}
            </Typography>
            <Typography variant="body1">
              {t('privacyPolicyView.sections.deletionAndContact.prefix')}{' '}
              <strong>info@zelenisvet.rs</strong>
              {t('privacyPolicyView.sections.deletionAndContact.suffix')}
            </Typography>
          </Box>

          <Box mt={4}>
            <Typography variant="body2">
              {t('privacyPolicyView.lastUpdated')}
            </Typography>
          </Box>
        </Container>
      </Box>
    </PageContent>
  );
};
