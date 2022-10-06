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

import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

// MUI Components
import MUIBottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

const styles = {
  link: {
    borderRight: '1px solid',
    borderColor: 'secondary.main',
    color: 'secondary.main',
    ['.MuiBottomNavigationAction-label']: {
      fontWeight: 700,
      fontSize: '0.99rem',
    },
  },
}
/**
 * Bottom Navigation
 * @param onChange
 * @param rest
 * @returns {JSX.Element}
 * @constructor
 * @component
 */
function BottomNavigation({ onChange, ...rest }) {
  const { t: common } = useTranslation('common')
  const router = useRouter()
  // activeNav is set when the application routes to a new page
  const activeNav = router.asPath

  // Default onChange behavior
  const _onChange = useCallback(
    (e, newValue) => {
      router.push(newValue)
    },
    [router]
  )

  return (
    <MUIBottomNavigation
      data-testid="menu-btn"
      showLabels
      value={activeNav}
      onChange={onChange || _onChange}
      sx={{
        backgroundColor: 'background.default',
        borderTop: '1px solid',
        borderColor: 'secondary.main',
        color: 'secondary.main',
      }}
      {...rest}
    >
      <BottomNavigationAction
        to="/"
        value="/"
        data-testid={'mb-home-link'}
        label={common('home')}
        sx={styles.link}
      />
      <BottomNavigationAction
        to="/chart"
        value="/chart"
        data-testid={'mb-chart-link'}
        label={common('chart')}
        sx={styles.link}
      />
      <BottomNavigationAction
        to="#!"
        value="/periods"
        data-testid={'mb-period-link'}
        label={common('periods')}
        sx={styles.link}
      />
      <BottomNavigationAction
        to="/wallet"
        value="/wallet"
        data-testid={'mb-wallet-link'}
        label={common('wallet')}
        sx={{ ...styles.link, border: 'none' }}
      />
    </MUIBottomNavigation>
  )
}

export default BottomNavigation
