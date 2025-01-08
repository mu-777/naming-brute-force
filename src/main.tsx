import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import App from './App.tsx'

const mantineTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          solidBg: '#4dabf7',
          solidHoverBg: '#74c0fc',
          solidActiveBg: undefined,
          softColor: '#228be6',
          softBg: 'rgba(231, 245, 255, 1)',
          softHoverBg: 'rgba(208, 235, 255, 0.65)',
          softActiveBg: undefined,
          outlinedColor: '#228be6',
          outlinedBorder: '#228be6',
          outlinedHoverBg: 'rgba(231, 245, 255, 0.35)',
          outlinedHoverBorder: undefined,
          outlinedActiveBg: undefined,
        },
        background: {
          body: '#ffffff',
          surface: '#f8f9fa',
        },
        text: {
          primary: '#495057',
          secondary: '#868e96',
        }
      },
    },
  },
  fontFamily: {
    body: 'Hiragino Kaku Gothic ProN, Meiryo, sans-serif',
  },
  typography: {
    h1: {
      // `--joy` is the default CSS variable prefix.
      // If you have a custom prefix, you have to use it instead.
      // For more details about the custom prefix, go to https://mui.com/joy-ui/customization/using-css-variables/#custom-prefix
      background:
        'linear-gradient(-30deg, var(--joy-palette-primary-700), var(--joy-palette-primary-400))',
      // `Webkit*` properties must come later.
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontSize: 'var(--joy-fontSize-xl3)',
    },
  },
  focus: {
    default: {
      outlineWidth: '3px',
      outlineOffset: '2px',
      outlineColor: '#4dabf7',
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssVarsProvider theme={mantineTheme}>
      <App />
    </CssVarsProvider>
  </StrictMode>,
)
