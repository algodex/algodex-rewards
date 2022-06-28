import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

const fontFamilies = {
  heading: '\'Alliance No.1\', Inter, sans-serif',
  body: 'Inter, sans-serif',
  monospace: '\'Roboto Mono\', monospace',
}

// Regular Colors
const theme = createTheme({
  typography: {
    fontFamily: [fontFamilies.body],
  },
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#cc4444',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f5f5f5',
    },
    titleBar: {
      main: '#eeeeee',
      contrastText: '#222222',
    },
  },
})

export default theme
