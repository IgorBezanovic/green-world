import {
  Footer,
  Header,
  NavTrack,
  ScrollToTop,
  AllRights
} from '@green-world/components';
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
      <AllRights />
    </React.Fragment>
  );
};
