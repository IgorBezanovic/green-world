import { Footer, Header, ScrollToTop } from '@green-world/components';
import React from 'react';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <React.Fragment>
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
    </React.Fragment>
  );
};
