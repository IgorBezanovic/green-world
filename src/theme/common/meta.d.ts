import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    display1: React.CSSProperties;
    display2: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    display1?: React.CSSProperties;
    display2?: React.CSSProperties;
  }

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

  interface CustomColorExtension {
    subtle?: string;
    subtleHover?: string;
    subtleContrast?: string;
  }

  interface PaletteColor extends CustomColorExtension {}
  interface SimplePaletteColorOptions extends CustomColorExtension {}

  interface Palette {
    category1: PaletteColor;
    category2: PaletteColor;
    category3: PaletteColor;
    category4: PaletteColor;
    category5: PaletteColor;
    category6: PaletteColor;
    category7: PaletteColor;
    category8: PaletteColor;
  }

  interface PaletteOptions {
    category1?: SimplePaletteColorOptions;
    category2?: SimplePaletteColorOptions;
    category3?: SimplePaletteColorOptions;
    category4?: SimplePaletteColorOptions;
    category5?: SimplePaletteColorOptions;
    category6?: SimplePaletteColorOptions;
    category7?: SimplePaletteColorOptions;
    category8?: SimplePaletteColorOptions;
  }

  interface TypeAction {
    selectedHover?: string;
    selectedFocus?: string;
  }

  interface TypeActionOptions {
    selectedHover?: string;
    selectedFocus?: string;
  }
}
