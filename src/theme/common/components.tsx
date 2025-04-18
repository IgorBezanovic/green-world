import { Components, CssVarsTheme, Theme } from '@mui/material';

export const components: Components<
  Omit<Theme, 'components' | 'palette'> & CssVarsTheme
> = {
  MuiDialogTitle: {
    defaultProps: {
      variant: 'h2'
    }
  },
  MuiButton: {
    styleOverrides: {
      sizeSmall: {
        padding: '4px 10px'
      },
      sizeMedium: {
        padding: '8px 16px'
      },
      sizeLarge: {
        padding: '10px 22px'
      }
    }
  },
  MuiInputLabel: {
    defaultProps: {
      shrink: true
    }
  }
};
