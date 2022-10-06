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

import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import PropTypes from 'prop-types'

// Defaults
import DefaultToolbar from '@/components/Nav/Toolbar'
import DefaultBottomNavigation from '@/components/Nav/BottomNavigation'
import DefaultDrawer from '@/components/Nav/Drawer'
import { useState } from 'react'

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
 * @component
 */
export function Layout({ children, components, componentsProps }) {
  const { Toolbar, BottomNavigation, Drawer } = components
  const drawerWidth = 240
  // Example for Changing Toolbar Height
  // const toolbarHeight = 200
  const toolbarHeight = undefined
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  // Example of a Responsive Layout with Fixed Viewport
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxHeight: '-webkit-fill-available',
      }}
    >
      <AppBar
        data-testid="app-bar"
        position="static"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar
          isMobile={isMobile}
          toggleDrawer={toggleDrawer}
          height={toolbarHeight}
          {...componentsProps.Toolbar}
        />
      </AppBar>
      {/* Flex row for when the Drawer is visible */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'auto' }}>
        {
          // Show the Desktop Drawer
          (!isMobile || drawerOpen) && (
            <Drawer
              width={drawerWidth}
              offset={toolbarHeight}
              open={drawerOpen || !isMobile}
              isMobile={isMobile}
              {...componentsProps.Drawer}
            />
          )
        }
        {/* Display the Page Component */}
        <Container
          sx={{
            padding: '0',
            width: isMobile ? '100%' : 'calc(100% - 240px)',
            maxWidth: isMobile ? '100%' : 'calc(100% - 240px) !important',
          }}
        >
          {children}
        </Container>
      </Box>
      {
        // Show the Mobile Navigation
        isMobile && (
          <Paper
            sx={{
              position: 'static',
              bottom: 0,
              left: 0,
              right: 0,
              boxShadow: 'none',
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            elevation={3}
          >
            <BottomNavigation {...componentsProps.BottomNavigation} />
          </Paper>
        )
      }
    </Box>
  )
}

Layout.propTypes = {
  components: PropTypes.shape({
    Toolbar: PropTypes.elementType.isRequired,
    BottomNavigation: PropTypes.elementType.isRequired,
    Drawer: PropTypes.elementType.isRequired,
  }).isRequired,
}

Layout.defaultProps = {
  components: {
    Toolbar: DefaultToolbar,
    BottomNavigation: DefaultBottomNavigation,
    Drawer: DefaultDrawer,
  },
  componentsProps: {
    Toolbar: {},
    BottomNavigation: {},
    Drawer: {},
  },
}

export default Layout
