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

import React from 'react'
import PropTypes from 'prop-types'
import Link from '../Nav/Link'
import { useTranslation } from 'next-i18next'

// Material UI components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import CircularProgress from '@mui/material/CircularProgress'
import styled from '@emotion/styled'
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'

// custom hook and libs
import { usePriceConversionHook } from '@/hooks/usePriceConversionHook'
import { attachCurrency } from '../../lib/helper'

const styles = {
  selectorContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'secondary.light3',
    justifyContent: 'center',
    borderRadius: '3px',
    overflow: 'hidden',
    height: '28px',
  },
  selector: {
    padding: '5px 9px',
    fontSize: '0.8rem',
    fontWeight: 800,
    color: 'secondary.dark',
    cursor: 'pointer',
    minWidth: '3rem',
    textAlign: 'center',
  },
  activeSelector: {
    color: 'primary.contrastText',
    backgroundColor: 'accent.main',
  },
}

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.secondary.dark,
  },
}))

export const CurrentEpochCard = ({
  isConnected,
  loading,
  activeCurrency,
  setActiveCurrency,
  completedPeriod,
}) => {
  const { t } = useTranslation('common')

  const { conversionRate } = usePriceConversionHook({})

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'secondary.main',
          color: 'primary.contrastText',
          borderRadius: '3px',
          padding: '1rem',
          marginBlock: '1.2rem',
          border: '1px solid',
          borderColor: 'secondary.light2',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography fontSize={'1.1rem'} fontWeight={600}>
            {t('Period')} {completedPeriod.number} {t('Complete')}:
          </Typography>

          <Box sx={styles.selectorContainer}>
            <Typography
              variant="p"
              sx={[
                styles.selector,
                activeCurrency == 'ALGX' ? styles.activeSelector : {},
              ]}
              onClick={() => {
                setActiveCurrency('ALGX')
              }}
            >
              ALGX
            </Typography>
            <Typography
              variant="p"
              sx={[
                styles.selector,
                activeCurrency == 'USD' ? styles.activeSelector : {},
              ]}
              onClick={() => {
                setActiveCurrency('USD')
              }}
            >
              USD
            </Typography>
          </Box>
        </Box>
        {isConnected && (
          <Typography
            fontSize={'0.85rem'}
            fontWeight={700}
            sx={{ color: 'secondary.light', marginBottom: '1rem' }}
          >
            {completedPeriod.date}
          </Typography>
        )}
        {isConnected ? (
          <>
            <Box
              marginBottom={'0.5rem'}
              marginLeft={'0.6rem'}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography fontSize={'0.95rem'} fontWeight={600}>
                {t('Earned Rewards')}:
              </Typography>
              <Typography
                fontSize={'1rem'}
                fontWeight={600}
                textAlign={'right'}
                sx={{
                  // display: 'flex',
                  // alignItems: 'flex-start',
                  lineHeight: '1rem',
                }}
              >
                <HtmlTooltip
                  arrow
                  title={
                    <Box
                      sx={{
                        width: '300px',
                        maxWidth: '100%',
                        padding: '.5rem',
                      }}
                    >
                      <Typography
                        fontWeight={700}
                        marginBottom={'.6rem'}
                        fontSize={'.9rem'}
                      >
                        {
                          // eslint-disable-next-line max-len
                          'Rewards earned from Mainnet Version 1 and Mainnet Version 2 are subject to a vesting schedule. This vesting schedule is depicted in this document'
                        }
                        :
                      </Typography>
                      <Link
                        // eslint-disable-next-line max-len
                        href="https://docs.algodex.com/rewards-program/algx-liquidity-rewards-program"
                        sx={{
                          fontSize: '.9rem',
                          fontWeight: 700,
                          color: 'accent.main',
                        }}
                        target={'_blanc'}
                      >
                        {t('ALGX Liquidity Rewards Program')}
                      </Link>
                    </Box>
                  }
                >
                  <InfoRoundedIcon
                    sx={{
                      fontSize: '1rem',
                      marginRight: '0.3rem',
                      color: 'secondary.light',
                      cursor: 'pointer',
                    }}
                  />
                </HtmlTooltip>
                {loading ? (
                  <>
                    <CircularProgress size={'1rem'} />
                  </>
                ) : (
                  <>
                    {attachCurrency({
                      price: completedPeriod.earnedRewards || 0,
                      conversionRate,
                      activeCurrency,
                    })}
                  </>
                )}
              </Typography>
            </Box>
            <Box
              marginBottom={'0.5rem'}
              marginLeft={'0.6rem'}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography fontSize={'0.95rem'} fontWeight={600}>
                {t('Vested Rewards')}:
              </Typography>
              <Typography fontSize={'1rem'} fontWeight={600}>
                {loading ? (
                  <>
                    <CircularProgress size={'1rem'} />
                  </>
                ) : (
                  <>
                    {attachCurrency({
                      price: completedPeriod.vestedRewards || 0,
                      conversionRate,
                      activeCurrency,
                    })}
                  </>
                )}
              </Typography>
            </Box>
          </>
        ) : (
          <Typography
            fontSize={'0.85rem'}
            fontWeight={500}
            sx={{
              color: 'secondary.light',
              width: '80%',
              marginBlock: '1rem',
            }}
            data-testid={'connect-wallet'}
          >
            {t('Connect a wallet to see your pending rewards for each period')}
          </Typography>
        )}

        {completedPeriod.vestedDate && (
          <Typography
            variant="p"
            fontSize={'0.8rem'}
            fontStyle={'italic'}
            marginLeft={'0.5rem'}
          >
            {t('Rewards were paid out on')} {completedPeriod.vestedDate}.
          </Typography>
        )}
      </Box>
    </>
  )
}

CurrentEpochCard.propTypes = {
  isConnected: PropTypes.bool,
  loading: PropTypes.bool,
  completedPeriod: PropTypes.object,
  activeCurrency: PropTypes.string,
  setActiveCurrency: PropTypes.func,
}

CurrentEpochCard.defaultProps = {
  isConnected: false,
  loading: true,
}
