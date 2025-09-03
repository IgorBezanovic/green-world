import {
  Footer,
  Header,
  NavTrack,
  ScrollToTop,
  AllRights,
  AnalyticsTracker
} from '@green-world/components';
import React from 'react';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <React.Fragment>
      <ScrollToTop />
      <AnalyticsTracker />
      <NavTrack />
      <Header />
      <Outlet />
      <Footer />
      <AllRights />
    </React.Fragment>
  );
};
