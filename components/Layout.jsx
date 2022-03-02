import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import {BottomNavigation, BottomNavigationAction, Paper} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import FavoriteIcon from '@mui/icons-material/Favorite'
import {useRouter} from 'next/router'
import {useCallback} from 'react'

const DefaultToolbar = () => (<Toolbar>
  <IconButton
    size="large"
    edge="start"
    color="inherit"
    aria-label="menu"
    sx={{ mr: 2 }}
  >
    <MenuIcon />
  </IconButton>
  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
    Page Title
  </Typography>
  <Button color="inherit">Call To Action</Button>
</Toolbar>)

const DefaultBottomNavigation = () => {
  const router = useRouter()
  const activeNav = router.asPath

  const onChange = useCallback((e, newValue)=>{
    router.push(newValue)
  }, [router])

  return (
    <BottomNavigation
      showLabels
      value={activeNav}
      onChange={onChange}
    >
      <BottomNavigationAction
        to="/"
        value="/"
        label="Home"
        icon={<HomeIcon />}
      />
      <BottomNavigationAction
        to="/favorites"
        value="/favorites"
        label="Favorites"
        icon={<FavoriteIcon />}
      />
    </BottomNavigation>
  )
}

export function Layout({children, components, componentsProps}){
  const {Toolbar, BottomNavigation} = components
  return (
    <>
      <AppBar position="static">
        <Toolbar {...componentsProps.Toolbar}/>
      </AppBar>
      {children}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation {...componentsProps.BottomNavigation}/>
      </Paper>
    </>
  )
}

Layout.defaultProps = {
  components: {
    Toolbar: DefaultToolbar,
    BottomNavigation: DefaultBottomNavigation
  },
  componentsProps: {
    Toolbar: {},
    BottomNavigation: {}
  }
}

export default Layout
