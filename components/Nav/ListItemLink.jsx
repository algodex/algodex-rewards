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

import React, { forwardRef, useMemo } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'

// MUI Components
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'

// Custom Components
import CustomLink from '@/components/Nav/Link'

/**
 * ListItemLink
 *
 * @param icon
 * @param primary
 * @param to
 * @returns {JSX.Element}
 * @see https://mui.com/guides/routing/#list
 * @constructor
 */
function ListItemLink({ icon, primary, to, ...res }) {
  const router = useRouter()
  const activeNav = router.asPath

  const renderLink = useMemo(
    () =>
      forwardRef(function Link(itemProps, ref) {
        return (
          <CustomLink
            href={to}
            ref={ref}
            {...itemProps}
            role={undefined}
            {...res}
          />
        )
      }),
    [to, res]
  )

  return (
    <li>
      <ListItem button component={renderLink} selected={activeNav === to}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  )
}

ListItemLink.propTypes = {
  /**
   * icon
   */
  icon: PropTypes.element,
  /**
   * primary
   */
  primary: PropTypes.string.isRequired,
  /**
   * to
   */
  to: PropTypes.string.isRequired,
}

export default ListItemLink
