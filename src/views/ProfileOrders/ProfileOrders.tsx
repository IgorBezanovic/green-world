'use client';

import { AppBreadcrumbs, PageContent } from '@green-world/components';
import { OrdersView } from '@green-world/views/Orders/OrdersView';
import { Box, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const ProfileOrders = () => {
  const { t } = useTranslation();
  const pages = [
    { label: t('breadcrumbs.home'), route: '/' },
    { label: t('breadcrumbs.userProfile'), route: '/profile' },
    { label: t('profileOrdersView.mainTitle'), route: '/profile/orders' }
  ];

  return (
    <PageContent>
      <Box
        sx={(theme) => ({
          width: '100%',
          maxWidth: 1400,
          mx: 'auto',
          px: 2,
          py: 3.5,
          [theme.breakpoints.up('sm')]: { px: 3 },
          [theme.breakpoints.up('xl')]: { px: 0 }
        })}
      >
        <AppBreadcrumbs pages={pages} />
        <Paper
          component="section"
          variant="outlined"
          sx={{ mt: 3.5, p: { xs: 2, sm: 3 }, borderRadius: 2 }}
        >
          <OrdersView variant="profile" />
        </Paper>
      </Box>
    </PageContent>
  );
};
