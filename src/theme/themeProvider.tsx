import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

import { theme } from './theme';

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
