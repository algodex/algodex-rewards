/* 
 * Algodex Rewards 
 * Copyright (C) 2022 Algodex VASP (BVI) Corp.
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
    MuiTableContainer: {
      styleOverrides: {
        root: {
          '@media(max-width: 992px)': {
            '&::-webkit-scrollbar': {
              width: '10px !important',
              height: '12px !important',
            },

            /* Track */
            '&::-webkit-scrollbar-track ': {
              WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.3) !important',
              WebkitBorderRadius: '10px !important',
              borderRadius: '10px !important',
              backgroundColor: '#1A202C',
            },

            /* Handle */
            '&::-webkit-scrollbar-thumb': {
              WebkitBorderRadius: '10px !important',
              borderRadius: '10px !important',
              WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.5) !important',
              backgroundColor: '#A1AEC0',
              //   width: '10px',
            },
          },
        },
      },
    },
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#F8FAFC',
      light: '#718096',
      light2: '#EDF2F6',
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
