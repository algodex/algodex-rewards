import * as React from 'react'
import {useTranslation} from 'next-i18next'

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
import ListItemLink from '@/components/ListItemLink'

function Drawer({width, ...props}){
  const {t} = useTranslation('drawer')
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
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              {t('Routeable Pages')}
            </ListSubheader>
          }>
          <ListItemLink to="/" icon={<HomeIcon/>} primary={t('Home')}/>
          <ListItemLink to="/favorites" icon={<FavoriteIcon/>} primary={t('Favorites')}/>
        </List>
        <Divider />
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              {t('Example List Items')}
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

Drawer.defaultProps = {
  width: 250
}
export default Drawer
