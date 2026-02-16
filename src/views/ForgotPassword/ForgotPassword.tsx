import {
  AppBreadcrumbs,
  ForgotPasswordForm,
  MetaTags
} from '@green-world/components';
import { Box } from '@mui/material';

export const ForgotPassword = () => {
  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Uloguj se', route: '/login' },
    { label: 'Zaboravljena Lozinka', route: '/forgot-password' }
  ];

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags title={'Zeleni Svet | Zaboravljena Lozinka | Green World'} />

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
    </Box>
  );
};
