import { AppBreadcrumbs, LoginForm, MetaTags } from '@green-world/components';
import { useLogin } from '@green-world/hooks/useLogin';
import { Box } from '@mui/material';
import { useLocation } from 'react-router';

export const Login = () => {
  const { mutate, error, isPending } = useLogin();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isUserLogged = queryParams.get('isUserLogged');

  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Uloguj se', route: '/login' }
  ];

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#FDFFFB',
        minHeight: 'calc(100vh - 360px)',
      }}
    >
      <MetaTags title={'Zeleni Svet | Prijavi se | Green World'} />

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
    </Box>
  );
};
