import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  responsiveFontSizes
} from '@mui/material';
import { FC, PropsWithChildren } from 'react';

import { theme } from './theme';

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const appTheme = responsiveFontSizes(theme);

  return (
    <MuiThemeProvider theme={appTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
