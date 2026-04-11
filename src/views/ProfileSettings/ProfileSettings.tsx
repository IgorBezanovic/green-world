'use client';

import { AppBreadcrumbs, PageContent } from '@green-world/components';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

export const ProfileSettings = ({
  children
}: {
  children?: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('breadcrumbs.userProfile'), route: '/profile' },
    { label: t('profileSettingsView.breadcrumb'), route: '/edit-profile' }
  ];

  const isActiveRoute = (route: string) => location.pathname.startsWith(route);

  const getButtonSx = (route: string) => {
    const isActive = isActiveRoute(route);

    return {
      fontWeight: isActive ? 700 : 500,
      boxShadow: isActive ? 3 : 0,
      bgcolor: isActive ? 'info.dark' : 'info.main',
      '&:hover': {
        bgcolor: isActive ? 'info.dark' : 'info.main'
      }
    };
  };

  return (
    <PageContent>
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
            sx={getButtonSx('/profile-settings/edit-profile')}
          >
            {t('profileSettingsView.buttons.profileData')}
          </Button>
          <Button
            onClick={() => navigate('/profile-settings/change-image')}
            variant="contained"
            color="info"
            sx={getButtonSx('/profile-settings/change-image')}
          >
            {t('profileSettingsView.buttons.imageQr')}
          </Button>
          <Button
            onClick={() => navigate('/profile-settings/change-password')}
            variant="contained"
            color="info"
            sx={getButtonSx('/profile-settings/change-password')}
          >
            {t('profileSettingsView.buttons.changePassword')}
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => navigate('/profile-settings/statistics')}
            sx={getButtonSx('/profile-settings/statistics')}
          >
            {t('profileSettingsView.buttons.statistics')}
          </Button>
        </Box>
        <Box
          sx={{
            width: '100%'
          }}
        >
          {children}
        </Box>
      </Box>
    </PageContent>
  );
};
