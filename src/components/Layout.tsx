import {
  Footer,
  Header,
  InfoTrack,
  ScrollToTop
} from '@green-world/components';
import React from 'react';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <React.Fragment>
      <ScrollToTop />
      <InfoTrack />
      <Header />
      <Outlet />
      <Footer />
    </React.Fragment>
  );
};
