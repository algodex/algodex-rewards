import * as React from 'react'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'

// MUI Components
import MUIDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListSubheader from '@mui/material/ListSubheader'

// Icons
import HomeIcon from '@mui/icons-material/Home'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import OutboxIcon from '@mui/icons-material/Outbox'
import ArticleIcon from '@mui/icons-material/Article'
import HelpCenterIcon from '@mui/icons-material/HelpCenter'
import InfoIcon from '@mui/icons-material/Info'

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

const otherLinks = [
  {
    text: 'TRADE',
    icon: () => <TrendingDownIcon sx={{ color: 'secondary.light' }} />,
    link: 'https://app.algodex.com/trade',
  },
  {
    text: 'DOCS',
    icon: () => <ArticleIcon sx={{ color: 'secondary.light' }} />,
    link: 'https://app.algodex.com/docs',
  },
  {
    text: 'ABOUT',
    icon: () => <InfoIcon sx={{ color: 'secondary.light' }} />,
    link: 'https://app.algodex.com',
  },
  {
    text: 'SUPPORT',
    icon: () => <HelpCenterIcon sx={{ color: 'secondary.light' }} />,
    link: 'https://app.algodex.com/support',
  },
  {
    text: 'MAILBOX',
    icon: () => <OutboxIcon sx={{ color: 'secondary.light' }} />,
    link: 'https://mailbox.algodex.com/',
  },
  // {
  //   text: 'REWARDS',
  //   icon: () => <ArticleIcon sx={{ color: 'secondary.light' }} />,
  // link:'/'
  // },
]
function Drawer({ width, offset, ...props }) {
  const { t: common } = useTranslation('common')
  return (
    <MUIDrawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        ['& .MuiDrawer-paper']: {
          width,
          boxSizing: 'border-box',
          backgroundColor: 'background.default',
          color: 'secondary.light',
        },
      }}
      {...props}
    >
      {/* Add Toolbar for spacing */}
      <Toolbar sx={{ height: offset }} />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItemLink
            to="/"
            icon={<HomeIcon sx={{ color: 'secondary.light' }} />}
            primary={common('home')}
          />
          <ListItemLink
            to="/chart"
            icon={<StackedBarChartIcon sx={{ color: 'secondary.light' }} />}
            primary={common('chart')}
          />
          <ListItemLink
            to="/periods"
            icon={<AccessTimeFilledIcon sx={{ color: 'secondary.light' }} />}
            primary={common('periods')}
          />
          <ListItemLink
            to="/wallet"
            icon={
              <AccountBalanceWalletIcon sx={{ color: 'secondary.light' }} />
            }
            primary={common('wallet')}
          />
        </List>
        <Divider />
        <List
          subheader={
            <ListSubheader
              component="div"
              id="nested-list-subheader"
              sx={{ backgroundColor: 'secondary.light', color:'secondary.dark', fontWeight:500 }}
            >
              Other Links
            </ListSubheader>
          }
        >
          {otherLinks.map(({ text, icon: IconComponent, link }) => (
            <ListItemLink
              key={text}
              to={link}
              icon={<IconComponent />}
              primary={text}
              target={'_blank'}
            />
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
  offset: PropTypes.number,
}

Drawer.defaultProps = {
  width: 250,
}
export default Drawer
