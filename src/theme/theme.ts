import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#5C62F9'
    },
    secondary: {
      main: '#35C89F'
    },
    error: {
      main: '#F97F88'
    },
    warning: {
      main: '#FFCC00'
    },
    info: {
      main: '#92C7CF'
    },
    success: {
      main: '#55AD9B'
    },
    background: {
      default: '#FBFEF7',
      paper: '#FDFFFB'
    },
    text: {
      primary: '#01082D',
      secondary: '#343957',
      disabled: '#A0A3AF'
    },
    divider: '#E6E6EA',
    common: {
      white: '#FFFFFF',
      black: '#01082D'
    },
    custom: {
      forestGreen: '#316357',
      mint: '#92C7CF',
      lightMint: '#AAD7D9',
      lightCream: '#FBF9F1',
      lightGray: '#E5E1DA',
      teaGreen: '#D8EFD3'
    }
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif'
  },
  shape: {
    borderRadius: 8
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 768,
      lg: 976,
      xl: 1440
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            'linear-gradient(145deg, rgba(202, 202, 202, 0.2), rgba(240, 240, 240, 0.2))'
        }
      }
    }
  }
};

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      forestGreen: string;
      mint: string;
      lightMint: string;
      lightCream: string;
      lightGray: string;
      teaGreen: string;
    };
  }

  interface PaletteOptions {
    custom?: {
      forestGreen: string;
      mint: string;
      lightMint: string;
      lightCream: string;
      lightGray: string;
      teaGreen: string;
    };
  }
}

export const theme = createTheme(themeOptions);
