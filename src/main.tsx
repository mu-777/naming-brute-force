import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import App from './App.tsx'

// https://mui.com/joy-ui/customization/theme-colors/#adding-new-palettes
import type { PaletteRange } from '@mui/joy/styles';
declare module '@mui/joy/styles' {
  interface ColorPalettePropOverrides {
    // apply to all Joy UI components that support `color` prop
    secondary: true;
  }

  interface Palette {
    // this will make the node `secondary` configurable in `extendTheme`
    // and add `secondary` to the theme's palette.
    secondary: PaletteRange;
    gradient:{
      main: string,
      heavy: string,
      light: string,
      background: string,
    }
  }
}

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#fb7185',
          600: '#e11d48',
          700: '#e11d48',
          800: '#9f1239',
          900: '#881337',
        },
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#fedc40',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        background: {
          body: 'var(--joy-palette-background-level1)',
          surface: '#FFFFFF',
        },
        text: {
          primary: '#2C3E50',
          secondary: '#7F8C8D',
        },
        gradient: {
          main: 'linear-gradient(60deg, var(--joy-palette-primary-500) 0%, var(--joy-palette-primary-300) 40%, var(--joy-palette-secondary-300) 60%, var(--joy-palette-secondary-500) 100%)',
          heavy: 'linear-gradient(60deg, var(--joy-palette-primary-800) 0%, var(--joy-palette-primary-500) 40%, var(--joy-palette-secondary-500) 60%, var(--joy-palette-secondary-800) 100%)',
          light: 'linear-gradient(60deg, var(--joy-palette-primary-400) 0%, var(--joy-palette-primary-200) 40%, var(--joy-palette-secondary-200) 60%, var(--joy-palette-secondary-400) 100%)',
          background: 'linear-gradient(180deg, var(--joy-palette-background-level1) 75%, #FFFFFF 100%)',
        },
      },
    },
  },
  fontFamily: {
    body: '"M PLUS Rounded 1c", Hiragino Kaku Gothic ProN, Meiryo, sans-serif',
  },
  typography: {
    h1: {
      fontSize: 'var(--joy-fontSize-xl4)',
      fontWeight: 'var(--joy-fontWeight-xl)',
      textAlign: 'center',
      background: 'var(--joy-palette-gradient-main)',
      // `Webkit*` properties must come later.
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: '0 0 6px rgba(0, 0, 0, 0.1)',
    },
    h2: {
      fontSize: 'var(--joy-fontSize-xl2)',
      fontWeight: 'var(--joy-fontWeight-md)',
    },
    'title-lg': {
      fontSize: 'var(--joy-fontSize-lg)',
      fontWeight: 'var(--joy-fontWeight-md)',
    },
    'body-md': {
      fontSize: 'var(--joy-fontSize-md)',
      lineHeight: 1.7,
    },
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px',
          fontWeight: 'var(--joy-fontWeight-md)',
          fontSize: 'var(--joy-fontSize-lg)',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    JoyCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(0px)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    JoyInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontSize: 'var(--joy-fontSize-md)'
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssVarsProvider theme={theme}>
      <App />
    </CssVarsProvider>
  </StrictMode>,
)
