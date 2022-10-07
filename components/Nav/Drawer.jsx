/* 
 * Algodex Rewards 
 * Copyright (C) 2022 Algodex VASP (BVI) Corp.
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
import GitHubIcon from '@mui/icons-material/GitHub'

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
    link: 'https://docs.algodex.com',
  },
  {
    text: 'ABOUT',
    icon: () => <InfoIcon sx={{ color: 'secondary.light' }} />,
    link: 'https://app.algodex.com/about',
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
  {
    text: 'GITHUB',
    icon: () => <GitHubIcon sx={{ color: 'secondary.light' }} />,
    link: 'https://github.com/algodex/algodex-rewards ',
  },
]
function Drawer({ width, offset, isMobile, open, ...props }) {
  const { t: common } = useTranslation('common')
  return (
    <MUIDrawer
      variant={isMobile ? 'temporary' : 'permanent'}
      anchor="left"
      open={open}
      sx={{
        width: !isMobile || open ? width : 0,
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
      <Box sx={{ overflow: 'auto' }} data-testid="toolbar-links">
        <List>
          <ListItemLink
            to="/"
            icon={<HomeIcon sx={{ color: 'secondary.light' }} />}
            primary={common('home')}
            data-testid={'home-link'}
          />
          <ListItemLink
            to="/chart"
            icon={<StackedBarChartIcon sx={{ color: 'secondary.light' }} />}
            primary={common('chart')}
            data-testid={'chart-link'}
          />
          <ListItemLink
            to="/periods"
            icon={<AccessTimeFilledIcon sx={{ color: 'secondary.light' }} />}
            primary={common('periods')}
            data-testid={'period-link'}
          />
          <ListItemLink
            to="/wallet"
            icon={
              <AccountBalanceWalletIcon sx={{ color: 'secondary.light' }} />
            }
            primary={common('wallet')}
            data-testid={'wallet-link'}
          />
        </List>
        <Divider />
        <List
          data-testid="toolbar-links"
          subheader={
            <ListSubheader
              component="div"
              id="nested-list-subheader"
              sx={{
                marginBlock: '20px',
                border: '2px solid',
                borderColor: 'secondary.light',
              }}
            />
          }
        >
          {otherLinks.map(({ text, icon: IconComponent, link }) => (
            <ListItemLink
              key={text}
              to={link}
              icon={<IconComponent />}
              primary={common(text)}
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

  /** Mobile */
  isMobile: PropTypes.bool,
  open: PropTypes.bool,
}

Drawer.defaultProps = {
  width: 250,
}
export default Drawer
