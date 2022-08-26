import React from 'react'
import PropTypes from 'prop-types'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import Link from './Nav/Link'

export const WarningCard = ({ title, warnings, link }) => {
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
      }}
    >
      <WarningRoundedIcon sx={{ marginRight: '5px' }} />
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
}
