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

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import Link from './Nav/Link'

export const WarningCard = ({
  title,
  warnings,
  link,
  icon: IconComponent,
  note,
  styles,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: 'secondary.dark',
        color: 'primary.contrastText',
        borderRadius: '3px',
        padding: '1rem',
        marginBlock: '1.2rem',
        border: '1px solid',
        borderColor: 'secondary.light3',
        display: 'flex',
        alignItems: 'flex-start',
        ...styles,
      }}
    >
      {IconComponent == 'Empty' ? (
        <></>
      ) : IconComponent ? (
        <IconComponent />
      ) : (
        <WarningRoundedIcon sx={{ marginRight: '5px' }} />
      )}
      <Box>
        {title && (
          <Typography variant="p" fontSize={'0.85rem'} fontWeight={700}>
            <span>{title} </span>
          </Typography>
        )}
        {warnings && (
          <Typography
            variant="p"
            fontSize={'0.8rem'}
            fontWeight={500}
            sx={{
              lineHeight: '1.5rem',
            }}
          >
            {warnings.map((text) => (
              <span key={text}>
                {text} <br />
              </span>
            ))}
          </Typography>
        )}
        {note && (
          <Typography
            variant="p"
            fontSize={'0.7rem'}
            fontWeight={500}
            fontStyle="italic"
            sx={{
              color: 'secondary.light',
            }}
          >
            {note}
          </Typography>
        )}
        {link && (
          <Link
            href={link.url}
            target={'_blanc'}
            sx={{ color: 'accent.main', marginTop: '1rem', display: 'block' }}
          >
            {link.title}
          </Link>
        )}
      </Box>
    </Box>
  )
}

WarningCard.propTypes = {
  title: PropTypes.string,
  warnings: PropTypes.arrayOf(PropTypes.string),
  link: PropTypes.object,
  IconComponent: PropTypes.element || PropTypes.string,
  note: PropTypes.string,
  styles: PropTypes.object
}
