import {
  Footer,
  Header,
  NavTrack,
  ScrollToTop,
  AllRights,
  AnalyticsTracker,
  Navbar
} from '@green-world/components';
import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router';

export const Layout = () => {
  return (
    <React.Fragment>
      <ScrollToTop />
      <AnalyticsTracker />
      <NavTrack />
      <Box
        sx={{
          width: '100%',
          position: 'sticky',
          zIndex: 20,
          insetX: 0,
          top: 0
        }}
      >
        <Header />
        <Navbar />
      </Box>
      <Outlet />
      <Footer />
      <AllRights />
    </React.Fragment>
  );
};
