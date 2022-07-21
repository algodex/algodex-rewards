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
