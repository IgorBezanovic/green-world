import { PaletteOptions } from '@mui/material';

export const lightPalette: PaletteOptions = {
  mode: 'light',
  common: {
    black: '#000000',
    white: '#FFFFFF'
  },
  custom: {
    forestGreen: '#316357',
    mint: '#92C7CF',
    lightMint: '#AAD7D9',
    lightCream: '#FBF9F1',
    lightGray: '#E5E1DA',
    teaGreen: '#D8EFD3'
  },
  primary: {
    main: '#303030',
    dark: '#1A1A1A',
    light: '#828282',
    contrastText: '#FFFFFF',
    subtle: '#E0E0E0',
    subtleHover: '#CFCFCF',
    subtleContrast: '#000000'
  },
  secondary: {
    main: '#5F249F',
    dark: '#42196F',
    light: '#B280FF',
    contrastText: '#FFFFFF',
    subtle: '#ECE1FE',
    subtleHover: '#E0CDFE',
    subtleContrast: '#2F124F'
  },
  error: {
    main: '#DD1708',
    dark: '#890802',
    light: '#FB9189',
    contrastText: '#FFFFFF',
    subtle: '#FDE3E3',
    subtleHover: '#FBCCCB',
    subtleContrast: '#710B01'
  },
  warning: {
    main: '#AB5A05',
    dark: '#653700',
    light: '#F99934',
    contrastText: '#FFFFFF',
    subtle: '#FCE3CA',
    subtleHover: '#FAD4AD',
    subtleContrast: '#552C07'
  },
  info: {
    main: '#086DD9',
    dark: '#134085',
    light: '#70B3FA',
    contrastText: '#FFFFFF',
    subtle: '#D8ECFD',
    subtleHover: '#BBDEFB',
    subtleContrast: '#053570'
  },
  success: {
    main: '#24802D',
    dark: '#064E05',
    light: '#3CC84A',
    contrastText: '#FFFFFF',
    subtle: '#DAEED8',
    subtleHover: '#C3E3C0',
    subtleContrast: '#08400E'
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    A100: '#F5F5F5',
    A200: '#EEEEEE',
    A400: '#BDBDBD',
    A700: '#616161'
  },
  tonalOffset: 0.5,
  contrastThreshold: 4.5,
  text: {
    primary: '#212121',
    secondary: '#656565',
    disabled: '#9E9E9E'
  },
  background: {
    default: '#FAFAFA',
    paper: '#FFFFFF'
  },
  action: {
    active: 'rgba(0,0,0,54%)',
    hover: 'rgba(0,0,0,4%)',
    hoverOpacity: 0.04,
    selected: 'rgba(0,0,0,8%)',
    selectedHover: 'rgba(0,0,0,12%)',
    selectedFocus: 'rgba(0,0,0,20%)',
    selectedOpacity: 0.08,
    disabled: 'rgba(0,0,0,26%)',
    disabledBackground: 'rgba(0,0,0,12%)',
    disabledOpacity: 0.38,
    focus: 'rgba(0,0,0,12%)',
    focusOpacity: 0.12,
    activatedOpacity: 0.12
  },
  divider: '#E0E0E0',
  category1: {
    main: '#2B69DD',
    contrastText: '#FFFFFF',
    subtle: '#E2EBFD',
    subtleHover: '#B7CEFB',
    subtleContrast: '#07307D'
  },
  category2: {
    main: '#139A7F',
    contrastText: '#FFFFFF',
    subtle: '#E4F6F4',
    subtleHover: '#94E0D7',
    subtleContrast: '#07453E'
  },
  category3: {
    main: '#A6305C',
    contrastText: '#FFFFFF',
    subtle: '#F8E2EC',
    subtleHover: '#F1C6D8',
    subtleContrast: '#621E3A'
  },
  category4: {
    main: '#B9840E',
    contrastText: '#FFFFFF',
    subtle: '#FCF4E4',
    subtleHover: '#EFCD80',
    subtleContrast: '#583C0E'
  },
  category5: {
    main: '#C461C6',
    contrastText: '#FFFFFF',
    subtle: '#F7E8F7',
    subtleHover: '#EBC5EC',
    subtleContrast: '#69156A'
  },
  category6: {
    main: '#213873',
    contrastText: '#FFFFFF',
    subtle: '#E7ECF8',
    subtleHover: '#C4CFEE',
    subtleContrast: '#1E3267'
  },
  category7: {
    main: '#D85337',
    contrastText: '#FFFFFF',
    subtle: '#F9E5E1',
    subtleHover: '#F3C8BF',
    subtleContrast: '#622113'
  },
  category8: {
    main: '#5F249F',
    contrastText: '#FFFFFF',
    subtle: '#F0E6F9',
    subtleHover: '#DDC9F3',
    subtleContrast: '#48157F'
  }
} as const;
