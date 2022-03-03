import * as React from 'react'
import {useTranslation} from 'next-i18next'
import PropTypes from 'prop-types'

// MUI Components
import MUIDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'

// Icons
import HomeIcon from '@mui/icons-material/Home'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import FavoriteIcon from '@mui/icons-material/Favorite'

// Custom MUI Components
import ListItemLink from '@/components/Nav/ListItemLink'


/**
 * Drawer
 * @component
 * @param width
 * @param offset
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Drawer({width, offset, ...props}){
  const {t} = useTranslation('drawer')
  const { t: common } = useTranslation('common')
  return (
    <MUIDrawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        ['& .MuiDrawer-paper']: { width, boxSizing: 'border-box' },
      }}
      {...props}
    >
      {/* Add Toolbar for spacing */}
      <Toolbar sx={{height: offset}}/>
      <Box sx={{ overflow: 'auto' }}>
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              {t('title')}
            </ListSubheader>
          }>
          <ListItemLink to="/" icon={<HomeIcon/>} primary={common('home')}/>
          <ListItemLink to="/favorites" icon={<FavoriteIcon/>} primary={common('favorites')}/>
        </List>
        <Divider />
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              {t('subtitle')}
            </ListSubheader>
          }
        >
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </MUIDrawer>
  )
}

Drawer.propTypes = {
  /**
   * width
   */
  width: PropTypes.number.isRequired,
  /**
   * offset
   */
  offset: PropTypes.number
}

Drawer.defaultProps = {
  width: 250
}
export default Drawer
