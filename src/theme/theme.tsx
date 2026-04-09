import { createTheme, responsiveFontSizes } from '@mui/material';

import { breakpoints, components, typography } from './common';
// import { darkPalette } from './palette/dark';
import { lightPalette } from './palette/light';

export const theme = responsiveFontSizes(
  createTheme({
    typography,
    shape: { borderRadius: 8 },
    breakpoints,
    cssVariables: { colorSchemeSelector: 'class' },
    colorSchemes: {
      // dark: { palette: darkPalette },
      light: { palette: lightPalette }
    },
    components
  })
);
