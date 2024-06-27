import { Footer, Header } from '@green-world/components';
import React from 'react';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <React.Fragment>
      <Header />
      <Outlet />
      <Footer />
    </React.Fragment>
  );
};
