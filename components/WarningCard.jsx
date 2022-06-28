import React from 'react'
import PropTypes from 'prop-types'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'

export const WarningCard = ({ warnings }) => {
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
      <Typography
        variant="p"
        fontSize={'0.8rem'}
        fontWeight={600}
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
    </Box>
  )
}

WarningCard.propTypes = {
  warnings: PropTypes.array,
}
