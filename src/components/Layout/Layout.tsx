'use client';

import {
  Footer,
  Header,
  NavTrack,
  ScrollToTop,
  AllRights,
  Navbar
} from '@green-world/components';
import { Box } from '@mui/material';
import React from 'react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Fragment>
      <ScrollToTop />
      <NavTrack />
      <Box
        sx={{
          width: '100%',
          position: 'sticky',
          zIndex: 1000,
          insetX: 0,
          top: 0
        }}
      >
        <Header />
        <Navbar />
      </Box>
      {children}
      <Footer />
      <AllRights />
    </React.Fragment>
  );
};
