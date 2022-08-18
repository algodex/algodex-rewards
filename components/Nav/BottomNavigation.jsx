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
        label={common('home')}
        sx={styles.link}
      />
      <BottomNavigationAction
        to="/chart"
        value="/chart"
        label={common('chart')}
        sx={styles.link}
      />
      <BottomNavigationAction
        to="#!"
        value="/periods"
        label={common('periods')}
        sx={styles.link}
      />
      <BottomNavigationAction
        to="/wallet"
        value="/wallet"
        label={common('wallet')}
        sx={{ ...styles.link, border: 'none' }}
      />
    </MUIBottomNavigation>
  )
}

export default BottomNavigation
