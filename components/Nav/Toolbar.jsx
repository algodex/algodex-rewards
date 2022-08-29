import React from 'react'
import PropTypes from 'prop-types'

// MUI Components
import MUIToolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Box from '@mui/material/Box'

// Custom Language Selector
import LocaleNavMenu from '@/components/Nav/LocaleNavMenu'
import { Logo } from '../Logo'
import { WalletDropdown } from '../WalletDropdown'

/**
 * Toolbar
 * @param title
 * @param height
 * @param isMobile
 * @param onClick
 * @param rest
 * @returns {JSX.Element}
 * @constructor
 */
function Toolbar({ height, isMobile, onClick, toggleDrawer, ...rest }) {
  return (
    <MUIToolbar
      sx={{ height, backgroundColor: 'background.default' }}
      {...rest}
    >
      <Box flex={1} display={'flex'} alignItems={'baseline'}>
        <Logo isMobile={isMobile} />
      </Box>
      {!isMobile && (
        <WalletDropdown
          sx={{
            marginBlock: '0',
            padding: '0rem 0.7rem',
            position: 'absolute',
            top: '0.7rem',
            right: '7rem',
          }}
          fontSize={'1rem'}
        />
      )}
      <LocaleNavMenu isMobile={isMobile} onClick={onClick} />
      {/* TODO: Make Menu Collapsable*/}
      {isMobile && (
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ ml: '5px' }}
          onClick={toggleDrawer}
        >
          <MenuIcon sx={{ fontSize: '2.4rem' }} />
        </IconButton>
      )}
    </MUIToolbar>
  )
}

Toolbar.propTypes = {
  /**
   * onClick
   */
  onClick: PropTypes.func.isRequired,
  /**
   * height
   */
  height: PropTypes.number,
  /**
   * isMobile
   */
  isMobile: PropTypes.bool,

  toggleDrawer: PropTypes.func.isRequired,
}

Toolbar.defaultProps = {
  onClick: console.log,
}
export default Toolbar
