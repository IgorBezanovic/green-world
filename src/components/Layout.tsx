import { Footer, Header, NavTrack, ScrollToTop } from '@green-world/components';
import React from 'react';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <React.Fragment>
      <ScrollToTop />
      <NavTrack />
      <Header />
      <Outlet />
      <Footer />
    </React.Fragment>
  );
};
