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

import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { i18n } from 'next-i18next.config'

// MUI Components
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuList from '@mui/material/MenuList'

// Icons
import Flag from 'react-country-flag'

// Custom Components
import MenuItemLink from '@/components/Nav/MenuItemLink'
import { Typography } from '@mui/material'

// Map locale code to the flag used in 'react-country-flag'
const localeToFlags = {
  ca: 'CA',
  en: 'US',
  es: 'MX',
  nl: 'NL',
  ch: 'CN',
  tr: 'TR',
  vn: 'VN',
  id: 'ID',
  iq: 'IQ',
  my: 'MY',
  ir: 'IR',
  it: 'IT',
  jp: 'JP',
  ru: 'RU',
  se: 'SE',
  sk: 'SK',
  hu: 'HU',
  no: 'NO',
  ct: 'ES-CT',
  th: 'TH',
  in: 'IN',
  de: 'DE',
  kr: 'KR',
  fr: 'FR',
  pl: 'PL',
}

/**
 * LanguageNavMenu
 * @component
 * @param onClick
 * @returns {JSX.Element}
 * @constructor
 */
export const LocaleNavMenu = ({ onClick }) => {
  const { asPath, locale } = useRouter()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setOpen(false)
  }

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <>
      <Button
        data-testid="dropdown-container-web"
        variant="contained"
        color={'secondary'}
        sx={{
          backgroundColor: 'secondary.dark',
        }}
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Typography
          marginRight={'5px'}
          color={'primary.contrastext'}
          fontWeight={'700'}
          fontSize={'0.9rem'}
        >
          {locale}{' '}
        </Typography>{' '}
        <Flag
          countryCode={localeToFlags[locale]}
          svg
          style={{
            fontSize: '1.4rem',
          }}
        />
      </Button>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  {i18n.locales
                    .filter((localeCd) => localeCd !== locale)
                    .map((localeCd) => (
                      <MenuItemLink
                        to={asPath}
                        locale={localeCd}
                        onClick={onClick || handleClose}
                        key={localeCd}
                        primary={localeCd}
                        icon={
                          <Flag countryCode={localeToFlags[localeCd]} svg />
                        }
                        data-testid="dropdown-item-web"
                      ></MenuItemLink>
                    ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

LocaleNavMenu.propTypes = {
  /**
   * onClick
   */
  onClick: PropTypes.func,
}

LocaleNavMenu.displayName = 'LanguageSelection'

export default LocaleNavMenu
