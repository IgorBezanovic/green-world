import {
  AppBreadcrumbs,
  MetaTags,
  RegistrationForm
} from '@green-world/components';
import { useSignUp } from '@green-world/hooks/useSignUp';
import { Box } from '@mui/material';

export const Registration = () => {
  const { mutate, error, isPending } = useSignUp();
  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Uloguj se', route: '/login' },
    { label: 'Registracija', route: '/registration' }
  ];

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags title={'Zeleni svet | Registruj se'} />

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
    </Box>
  );
};
