import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {useCallback} from 'react'
import MUIBottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import HomeIcon from '@mui/icons-material/Home'
import FavoriteIcon from '@mui/icons-material/Favorite'

/**
 * Example Bottom Navigation
 * @returns {JSX.Element}
 * @constructor
 */
function BottomNavigation({onChange, ...rest}) {
  const { t } = useTranslation('bottom-navigation')
  const router = useRouter()
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
        label={t('home')}
        icon={<HomeIcon />}
      />
      <BottomNavigationAction
        to="/favorites"
        value="/favorites"
        label={t('favorites')}
        icon={<FavoriteIcon />}
      />
    </MUIBottomNavigation>
  )
}

export default BottomNavigation
