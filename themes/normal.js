/* 
 * Algodex Rewards 
 * Copyright (C) 2021-2022 Algodex VASP (BVI) Corp.
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
