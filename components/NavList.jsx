import {useRouter} from 'next/router'
import Box from '@mui/material/Box'
import {List} from '@mui/icons-material'
import {ListItemButton, ListItemIcon, ListItemText} from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'
import DraftsIcon from '@mui/icons-material/Drafts'

const NavList = () => {
  const router = useRouter()
  const activeNav = router.asPath

  return (
    <Box>
      <List component="nav" aria-label="main mailbox folders">
        <ListItemButton
          selected={activeNav === '/'}
          to='/'
        >
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
        </ListItemButton>
        <ListItemButton
          selected={activeNav === '/'}
          to='/about'
        >
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary="Drafts" />
        </ListItemButton>
      </List>
    </Box>
  )
}

export default NavList
