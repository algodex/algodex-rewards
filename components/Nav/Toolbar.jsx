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
function Toolbar({ height, isMobile, onClick, ...rest }) {
  return (
    <MUIToolbar
      sx={{ height, backgroundColor: 'background.default' }}
      {...rest}
    >
      <Box flex={1} display={'flex'} alignItems={'baseline'}>
        <Logo />
      </Box>
      <LocaleNavMenu isMobile={isMobile} onClick={onClick} />
      {/* TODO: Make Menu Collapsable*/}
      {isMobile && (
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ ml: '5px' }}
          onClick={() => {
            alert('TODO: Make Menu Collapse')
          }}
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
}

Toolbar.defaultProps = {
  onClick: console.log,
}
export default Toolbar
