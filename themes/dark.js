import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

const fontFamilies = {
  heading: '\'Alliance No.1\', Inter, sans-serif',
  body: 'Inter, sans-serif',
  monospace: '\'Roboto Mono\', monospace',
}

// Create a theme instance.
const dark = createTheme({
  typography: {
    fontFamily: [fontFamilies.body],
    p: {
      display: 'block',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        outlined: {
          borderWidth: '1.8px',
        },
      },
    },
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#F8FAFC',
      light: '#718096',
      light2:'#EDF2F6',
      dark: '#1A202C',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4A5568',
      light: '#A1AEC0',
      light2: '#ABB0BC',
      light3: '#626E81',
      dark: '#2D3748',
      contrastText: '#DADADA',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#1A202C',
    },
    accent: {
      main: '#579F6E',
      contrastText: '#FFFFFF',
    },
    gray: {
      main: '#707070',
    },
    titleBar: {
      main: '#eeeeee',
      contrastText: '#222222',
    },
  },
})

export default dark
