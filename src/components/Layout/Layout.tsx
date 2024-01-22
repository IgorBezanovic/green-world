import { Header } from '@last-minute-ponude/components';
import React from 'react';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <React.Fragment>
      <Header />
      <Outlet />
    </React.Fragment>
  );
};
