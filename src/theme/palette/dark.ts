import { PaletteOptions } from '@mui/material';

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  common: {
    black: '#000000',
    white: '#FFFFFF'
  },
  primary: {
    main: '#E0E0E0',
    dark: '#FFFFFF',
    light: '#828282',
    contrastText: '#000000',
    subtle: '#3A3A3A',
    subtleHover: '#4A4A4A',
    subtleContrast: '#FFFFFF'
  },
  secondary: {
    main: '#B280FF',
    dark: '#D1AFFF',
    light: '#5F249F',
    contrastText: '#000000',
    subtle: '#4B3B5F',
    subtleHover: '#614878',
    subtleContrast: '#FFFFFF'
  },
  error: {
    main: '#FB9189',
    dark: '#DD1708',
    light: '#FFB3A9',
    contrastText: '#000000',
    subtle: '#5C1A1A',
    subtleHover: '#802020',
    subtleContrast: '#FFFFFF'
  },
  warning: {
    main: '#F99934',
    dark: '#AB5A05',
    light: '#FFBD6B',
    contrastText: '#000000',
    subtle: '#5A3B1A',
    subtleHover: '#7A4F23',
    subtleContrast: '#FFFFFF'
  },
  info: {
    main: '#70B3FA',
    dark: '#086DD9',
    light: '#A4D2FE',
    contrastText: '#000000',
    subtle: '#1C2D49',
    subtleHover: '#23406C',
    subtleContrast: '#FFFFFF'
  },
  success: {
    main: '#3CC84A',
    dark: '#24802D',
    light: '#6FE376',
    contrastText: '#000000',
    subtle: '#193C1F',
    subtleHover: '#21502A',
    subtleContrast: '#FFFFFF'
  },
  grey: {
    50: '#2A2A2A',
    100: '#333333',
    200: '#444444',
    300: '#555555',
    400: '#666666',
    500: '#777777',
    600: '#888888',
    700: '#999999',
    800: '#AAAAAA',
    900: '#BBBBBB',
    A100: '#2D2D2D',
    A200: '#3D3D3D',
    A400: '#5C5C5C',
    A700: '#6D6D6D'
  },
  tonalOffset: 0.5,
  contrastThreshold: 4.5,
  text: {
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
    disabled: '#888888'
  },
  background: {
    default: '#121212',
    paper: '#1E1E1E'
  },
  action: {
    active: 'rgba(255,255,255,0.87)',
    hover: 'rgba(255,255,255,0.04)',
    hoverOpacity: 0.04,
    selected: 'rgba(255,255,255,0.08)',
    selectedHover: 'rgba(255,255,255,0.12)',
    selectedFocus: 'rgba(255,255,255,0.20)',
    selectedOpacity: 0.08,
    disabled: 'rgba(255,255,255,0.3)',
    disabledBackground: 'rgba(255,255,255,0.12)',
    disabledOpacity: 0.38,
    focus: 'rgba(255,255,255,0.12)',
    focusOpacity: 0.12,
    activatedOpacity: 0.12
  },
  divider: '#333333',
  category1: {
    main: '#B7CEFB',
    contrastText: '#000000',
    subtle: '#1F2A3A',
    subtleHover: '#2A3C5B',
    subtleContrast: '#FFFFFF'
  },
  category2: {
    main: '#94E0D7',
    contrastText: '#000000',
    subtle: '#1A2F2C',
    subtleHover: '#265B53',
    subtleContrast: '#FFFFFF'
  },
  category3: {
    main: '#F1C6D8',
    contrastText: '#000000',
    subtle: '#3C2830',
    subtleHover: '#5C3B47',
    subtleContrast: '#FFFFFF'
  },
  category4: {
    main: '#EFCD80',
    contrastText: '#000000',
    subtle: '#40341D',
    subtleHover: '#5C4E2A',
    subtleContrast: '#FFFFFF'
  },
  category5: {
    main: '#EBC5EC',
    contrastText: '#000000',
    subtle: '#3D2D3E',
    subtleHover: '#5A4261',
    subtleContrast: '#FFFFFF'
  },
  category6: {
    main: '#C4CFEE',
    contrastText: '#000000',
    subtle: '#272D3A',
    subtleHover: '#3A4766',
    subtleContrast: '#FFFFFF'
  },
  category7: {
    main: '#F3C8BF',
    contrastText: '#000000',
    subtle: '#432520',
    subtleHover: '#62352E',
    subtleContrast: '#FFFFFF'
  },
  category8: {
    main: '#DDC9F3',
    contrastText: '#000000',
    subtle: '#3C2E54',
    subtleHover: '#583E79',
    subtleContrast: '#FFFFFF'
  }
} as const;
