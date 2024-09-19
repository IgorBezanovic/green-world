/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '480px',
      sm: '600px',
      md: '768px',
      lg: '976px',
      lgm: '1024px',
      xl: '1440px'
    },
    colors: {
      groupTransparent: 'rgba(81, 81, 81, 0.60)',
      whiteLinen: '#FDFFFB',
      snowDrift: '#FBFEF7',
      mintCream: '#F1F8E8',
      teaGreen: '#D8EFD3',
      seaFoamGreen: '#95D2B3',
      polishedPine: '#55AD9B',
      wintergreenDream: '#448A7C',
      deepTeal: '#3D7C70',
      forestGreen: '#316357',
      mint: '#92C7CF',
      lightMint: '#AAD7D9',
      lightCream: '#FBF9F1',
      lightGray: '#E5E1DA',
      primary: '#5C62F9',
      mainGreen: '#35C89F',
      mainYellow: '#FFCC00',
      mainRed: '#F97F88',
      red: '#c30010',
      white: '#FFFFFF',
      black: '#01082D',
      gray80: '#343957',
      gray60: '#676B81',
      gray40: '#999CAB',
      gray20: '#CCCED5',
      gray10: '#E6E6EA',
      gray5: '#F2F3F5',
      cream: '#F9F6F3',
      tertiaryYellow: '#FFEDA6',
      disabled: '#E0E2EC',
      disabledDark: '#A0A3AF',
      yellow: '#FFD940',
      lightPurple: '#F7F7FF'
    },
    fontFamily: {
      sans: ['Montserrat', 'sans-serif']
    },
    extend: {
      borderRadius: {
        '4xl': '2rem'
      },
      gridTemplateColumns: {
        landing: 'repeat(2, minmax(0, 832px))'
      },
      minHeight: {
        viewHeight: 'calc(100vh - 360px)'
      },
      backgroundImage: {
        'custom-gradient':
          'linear-gradient(145deg, rgba(202, 202, 202, 0.2), rgba(240, 240, 240, 0.2))',
        'image-box-gradient':
          'linear-gradient(145deg, rgba(202, 202, 202, 0.4), rgba(240, 240, 240, 0.4))'
      }
    }
  },
  plugins: []
};
