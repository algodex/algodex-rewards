import AppBar from '@mui/material/AppBar'
import Paper from '@mui/material/Paper'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useTheme} from '@mui/material/styles'

import DefaultToolbar from '@/components/Toolbar'
import DefaultBottomNavigation from '@/components/BottomNavigation'
import DefaultDrawer from '@/components/Drawer'
import Box from '@mui/material/Box'

/**
 * Layout Component
 *
 * Component includes three slots
 *
 * @param children
 * @param components
 * @param componentsProps
 * @returns {JSX.Element}
 * @constructor
 */
export function Layout({children, components, componentsProps}){
  const {Toolbar, BottomNavigation, Drawer} = components
  const drawerWidth = 240
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Example of a Responsive Layout
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: '100vh' }}>
      <AppBar position="static" sx={{ flex: 1, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar {...componentsProps.Toolbar}/>
      </AppBar>
      <Box sx={{display: 'flex', flex: 1, overflow: 'auto'}}>
        {
          // Show the Desktop Drawer
          !isMobile &&
        <Drawer
          width={drawerWidth}
          {...componentsProps.Drawer}
        />
        }
        <Box
          component="main"
          sx={{
            display: 'flex',
            flex:1,
            overflow: 'auto',
            height: '100%'
          }}>
          {children}
        </Box>
      </Box>
      {
        // Show the Mobile Navigation
        isMobile &&
        <Paper
          sx={{
            position: 'static',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: (theme) => theme.zIndex.drawer + 1}} elevation={3}>
          <BottomNavigation {...componentsProps.BottomNavigation}/>
        </Paper>
      }
    </Box>
  )
}

Layout.defaultProps = {
  components: {
    Toolbar: DefaultToolbar,
    BottomNavigation: DefaultBottomNavigation,
    Drawer: DefaultDrawer
  },
  componentsProps: {
    Toolbar: {},
    BottomNavigation: {},
    Drawer: {}
  }
}

export default Layout
