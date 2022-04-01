import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {useCallback} from 'react'

// MUI Components
import MUIBottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

// Icons
import HomeIcon from '@mui/icons-material/Home'
import FavoriteIcon from '@mui/icons-material/Favorite'

/**
 * Bottom Navigation
 * @param onChange
 * @param rest
 * @returns {JSX.Element}
 * @constructor
 * @component
 */
function BottomNavigation({onChange, ...rest}) {
  const {t: common} = useTranslation('common')
  const router = useRouter()
  // activeNav is set when the application routes to a new page
  const activeNav = router.asPath

  // Default onChange behavior
  const _onChange = useCallback((e, newValue)=>{
    router.push(newValue)
  }, [router])

  return (
    <MUIBottomNavigation
      showLabels
      value={activeNav}
      onChange={onChange || _onChange}
      {...rest}
    >
      <BottomNavigationAction
        to="/"
        value="/"
        label={common('home')}
        icon={<HomeIcon />}
      />
      <BottomNavigationAction
        to="/favorites"
        value="/favorites"
        label={common('favorites')}
        icon={<FavoriteIcon />}
      />
    </MUIBottomNavigation>
  )
}

export default BottomNavigation
