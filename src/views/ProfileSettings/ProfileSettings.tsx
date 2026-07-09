'use client';

import { AppBreadcrumbs, PageContent } from '@green-world/components';
import UserContext from '@green-world/context/UserContext';
import { useSellerOrdersUnreadCount } from '@green-world/hooks/useSellerOrders';
import { Box, Button, Badge, Typography } from '@mui/material';
import { ShoppingBag } from 'lucide-react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

export const ProfileSettings = ({
  children
}: {
  children?: React.ReactNode;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const { t } = useTranslation();
  const { data: unreadOrdersData } = useSellerOrdersUnreadCount(
    user?.role === 'seller'
  );
  const unreadOrders = unreadOrdersData?.unreadCount ?? 0;
  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('breadcrumbs.userProfile'), route: '/profile' },
    { label: t('profileSettingsView.breadcrumb'), route: '/edit-profile' }
  ];

  const isActiveRoute = (route: string) => location.pathname.startsWith(route);

  const getButtonSx = (route: string) => {
    const isActive = isActiveRoute(route);

    return {
      fontWeight: 500,
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
          {user?.role === 'seller' && (
            <Button
              variant="contained"
              color="info"
              onClick={() => navigate('/profile-settings/orders')}
              sx={getButtonSx('/profile-settings/orders')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Badge badgeContent={unreadOrders || null} color="error">
                  <ShoppingBag size={18} />
                </Badge>
                <span>{t('profileSettingsView.buttons.orders')}</span>
              </Box>
            </Button>
          )}
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
