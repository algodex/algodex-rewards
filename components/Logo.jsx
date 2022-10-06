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

import { Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import PropTypes from 'prop-types'

// custom components
import Link from './Nav/Link'

export const Logo = ({ styles, isMobile }) => {
  return (
    <div style={styles}>
      <Link
        href="/"
        sx={{ display: 'flex', alignItems: 'baseline', textDecoration: 'none' }}
      >
        {isMobile ? (
          <Image
            src="/algodex-icon.svg"
            alt="Algodex Icon Logo"
            width="24"
            height="24"
          />
        ) : (
          <Image
            src="/algodex-logo.svg"
            alt="Algodex Logo"
            width="188"
            height="30"
          />
        )}
        <Typography fontWeight={700} fontSize={'1.2rem'} marginLeft={'8px'}>
          REWARDS
        </Typography>
      </Link>
    </div>
  )
}

Logo.propTypes = {
  styles: PropTypes.object,
  isMobile: PropTypes.bool,
}

Logo.defaultProps = {
  styles: {},
  isMobile: true,
}
