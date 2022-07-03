import { Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import PropTypes from 'prop-types'

// custom components
import Link from './Nav/Link'

export const Logo = ({ styles }) => {
  return (
    <div style={styles}>
      <Link href="/" sx={{ display: 'flex', alignItems: 'baseline', textDecoration: 'none' }}>
        <Image
          src="/algodex-icon.svg"
          alt="Algodex Icon Logo"
          width="24"
          height="24"
        />
        <Typography
          fontWeight={700}
          fontSize={'1.2rem'}
          marginLeft={'8px'}
        >
          REWARDS
        </Typography>
      </Link>
    </div>
  )
}

Logo.propTypes = {
  styles: PropTypes.object,
}

Logo.defaultProps = {
  styles: { },
}
