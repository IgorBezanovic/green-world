'use client';

import {
  AppBreadcrumbs,
  PageContent,
  RegistrationForm
} from '@green-world/components';
import { useSignUp } from '@green-world/hooks/useSignUp';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const Registration = () => {
  const { mutate, error, isPending } = useSignUp();
  const { t } = useTranslation();
  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('loginView.breadcrumb'), route: '/login' },
    { label: t('registrationView.breadcrumb'), route: '/registration' }
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
        <RegistrationForm mutate={mutate} error={error} isLoading={isPending} />
      </Box>
    </PageContent>
  );
};
