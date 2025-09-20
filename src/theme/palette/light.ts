import { PaletteOptions } from '@mui/material';

export const lightPalette: PaletteOptions = {
  mode: 'light',
  common: {
    black: '#000000',
    white: '#FFFFFF'
  },
  primary: {
    main: '#ef8354', // coral
    dark: '#b04010',
    light: '#f29a75',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#266041', // hunter green (najzastupljenija)
    dark: '#173927',
    light: '#5dbe8b',
    contrastText: '#ffffff'
  },
  error: {
    main: '#b04010', // tamna nijansa corala
    dark: '#762b0b',
    light: '#f9cdba',
    contrastText: '#ffffff'
  },
  warning: {
    main: '#f29a75', // svetliji coral kao warning
    dark: '#e95718',
    light: '#fce6dc',
    contrastText: '#000000'
  },
  info: {
    main: '#82a0bc', // air superiority blue
    dark: '#42607b',
    light: '#b3c5d6',
    contrastText: '#ffffff'
  },
  success: {
    main: '#308d29', // iz nyanza skale (zelena)
    dark: '#184614',
    light: '#D4F2D2', // nyanza
    contrastText: '#ffffff'
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  },
  background: {
    default: '#ffffff',
    paper: '#FDFFFB',
    main: '#D4F2D2' // nyanza
  },
  text: {
    primary: '#12263a', // prussian blue (tamna)
    secondary: '#54807f', // myrtle green
    disabled: '#9e9e9e'
  },
  divider: '#e0e0e0',
  action: {
    active: 'rgba(0,0,0,0.54)',
    hover: 'rgba(0,0,0,0.04)',
    hoverOpacity: 0.04,
    selected: 'rgba(0,0,0,0.08)',
    disabled: 'rgba(0,0,0,0.26)',
    disabledBackground: 'rgba(0,0,0,0.12)',
    focus: 'rgba(0,0,0,0.12)',
    activatedOpacity: 0.12
  },
  contrastThreshold: 4.5,
  tonalOffset: 0.5
} as const;
