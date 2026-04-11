'use client';

import {
  AppBreadcrumbs,
  LoginForm,
  PageContent
} from '@green-world/components';
import { useLogin } from '@green-world/hooks/useLogin';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

export const Login = () => {
  const { mutate, error, isPending } = useLogin();
  const { t } = useTranslation();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isUserLogged = queryParams.get('isUserLogged');

  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('loginView.breadcrumb'), route: '/login' }
  ];

  return (
    <PageContent>
      <Box
        sx={(theme) => ({
          maxWidth: 1400,
          width: '100%',
          mx: 'auto',
          px: 2,
          py: 3.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 3.5,
          [theme.breakpoints.up('sm')]: {
            px: 3
          },
          [theme.breakpoints.up('xl')]: {
            px: 0,
            pt: 3,
            pb: 7
          }
        })}
      >
        <AppBreadcrumbs pages={pages} />
        <LoginForm
          mutate={mutate}
          error={error}
          isLoading={isPending}
          isUserLogged={isUserLogged}
        />
      </Box>
    </PageContent>
  );
};
