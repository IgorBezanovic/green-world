import { AppBreadcrumbs, MetaTags } from '@green-world/components';
import { Box, Button, Typography } from '@mui/material';
import { Outlet, useNavigate } from 'react-router';

export const ProfileSettings = () => {
  const navigate = useNavigate();
  const pages = [
    { label: 'Početna', route: '/' },
    { label: 'Korisnički profil', route: '/profile' },
    { label: 'Podešavanje profila', route: '/edit-profile' }
  ];

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#FDFFFB',
        minHeight: 'calc(100vh - 360px)'
      }}
    >
      <MetaTags title={'Zeleni svet | Podešavanje profila'} />

      <Box
        sx={(theme) => ({
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingTop: theme.spacing(3.5),
          paddingBottom: theme.spacing(3.5),
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),

          [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3)
          },

          [theme.breakpoints.up('xl')]: {
            paddingLeft: 0,
            paddingRight: 0,
            maxWidth: 1400
          }
        })}
      >
        <AppBreadcrumbs pages={pages} />
      </Box>
      <Box
        sx={(theme) => ({
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          gap: theme.spacing(3.5),
          paddingBottom: theme.spacing(3.5),
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
          marginLeft: 'auto',
          marginRight: 'auto',

          [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3)
          },

          [theme.breakpoints.up('lgm')]: {
            flexDirection: 'row'
          },

          [theme.breakpoints.up('xl')]: {
            paddingLeft: 0,
            paddingRight: 0,
            maxWidth: 1400
          }
        })}
      >
        <Box
          component="section"
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(1.5),
            width: '100%',
            minWidth: 200,

            [theme.breakpoints.up('lgm')]: {
              width: '16.666667%'
            }
          })}
        >
          <Typography
            component="p"
            sx={(theme) => ({
              color: theme.palette.grey[400],
              fontStyle: 'italic',
              marginBottom: theme.spacing(0.5)
            })}
          >
            {`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}h`}
          </Typography>
          <Button
            onClick={() => navigate('/profile-settings/edit-profile')}
            variant="contained"
            color="info"
          >
            Podaci profila
          </Button>
          <Button
            onClick={() => navigate('/profile-settings/change-image')}
            variant="contained"
            color="info"
          >
            Slika i QR kod
          </Button>
          <Button
            onClick={() => navigate('/profile-settings/change-password')}
            variant="contained"
            color="info"
          >
            Promena lozinke
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => navigate('/profile-settings/statistics')}
          >
            Statistika
          </Button>
        </Box>
        <Box
          sx={{
            width: '100%'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
