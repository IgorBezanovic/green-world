'use client';

import {
  AppBreadcrumbs,
  ForgotPasswordForm,
  PageContent
} from '@green-world/components';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const ForgotPassword = () => {
  const { t } = useTranslation();
  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('loginView.breadcrumb'), route: '/login' },
    { label: t('forgotPasswordView.breadcrumb'), route: '/forgot-password' }
  ];

  return (
    <PageContent>
      <Box
        sx={(theme) => ({
          maxWidth: 1400,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          mx: 'auto',
          py: 3.5,
          px: 2,
          [theme.breakpoints.up('sm')]: {
            px: 3
          },
          [theme.breakpoints.up('xl')]: {
            px: 0
          }
        })}
      >
        <AppBreadcrumbs pages={pages} />
        <ForgotPasswordForm />
      </Box>
    </PageContent>
  );
};
