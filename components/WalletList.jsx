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

/* eslint-disable max-len */
import React, { useMemo } from 'react'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'

//Material UI
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'

//Custom hook
import useRewardsAddresses from '@/hooks/useRewardsAddresses'
import { WarningCard } from './WarningCard'
import { shortenAddress } from '../lib/helper'

const styles = {
  accordionStyles: {
    boxShadow: 'none',
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
}

export const WalletList = () => {
  const { t } = useTranslation('common')
  const { addresses, activeWallet, handleDisconnect, minAmount } =
    useRewardsAddresses()

  const formattedAddresses = useMemo(() => {
    const copy = [...addresses]
    if (activeWallet) {
      const index = copy.findIndex(
        (wallet) => wallet?.address == activeWallet.address
      )
      if (index >= 0) {
        copy.splice(index, 1)
      }
      copy.unshift(activeWallet)
    }
    return copy
  }, [addresses, activeWallet])

  return (
    <>
      {formattedAddresses.length > 0 ? (
        <>
          <Typography
            fontSize={'0.8rem'}
            sx={{ color: 'secondary.light', marginBlock: '2rem' }}
          >
            {t(
              'Click the arrow beside each wallet to expand for the option to disconnect and to view ALGO and ALGX balances. Other ASAs are not shown on this page'
            )}
            .
          </Typography>
          {formattedAddresses.map(({ address, type, assets, amount }) => (
            <Box key={address} marginY={'2rem'}>
              <Grid>
                <Grid
                  item
                  xs={12}
                  sm={11}
                  md={10}
                  lg={10}
                  xl={9}
                  marginX={'auto'}
                >
                  <Box
                    sx={{
                      backgroundColor: 'secondary.dark',
                      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                      border: '1px solid',
                      borderColor: 'secondary.main',
                      padding: '10px',
                      borderRadius: '3px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: 'primary.light',
                      }}
                    >
                      <Typography fontSize={'0.95rem'}>
                        {t('WALLET NAME')}
                      </Typography>
                      <Typography fontSize={'0.95rem'}>
                        {t('BALANCE')}
                      </Typography>
                    </Box>
                    <Accordion sx={styles.accordionStyles}>
                      <AccordionSummary
                        data-testid={'addr-summary'}
                        expandIcon={
                          <ExpandMoreIcon
                            sx={{ color: 'primary.contrastText' }}
                          />
                        }
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{
                          ['&.Mui-expanded']: { minHeight: 'auto' },
                          ['.css-o4b71y-MuiAccordionSummary-content.Mui-expanded']:
                            {
                              margin: 0,
                            },
                          opacity: `${
                            address == activeWallet?.address ? 1 : '0.65'
                          }`,
                        }}
                      >
                        <Typography
                          fontWeight={500}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'primary.contrastText',
                          }}
                        >
                          <Image
                            src="/wallet-outline.svg"
                            height={13}
                            width={14}
                            alt="wallet"
                          />
                          <span
                            style={{ marginLeft: '10px' }}
                            data-testid={'addr'}
                          >
                            {shortenAddress({ address })}
                          </span>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {amount < minAmount ? (
                          <WarningCard
                            title="Not enough ALGX in wallet for rewards"
                            link={{
                              title: 'View info on earning rewards here',
                              url: 'https://docs.algodex.com/rewards-program/algx-liquidity-rewards-program',
                            }}
                            styles={{
                              backgroundColor: 'primary.dark',
                            }}
                          />
                        ) : (
                          <>
                            {assets
                              ?.filter(
                                (asset) =>
                                  asset['asset-id'] == 724480511 ||
                                  asset['asset-id'] == 31566704
                              )
                              .map((asset) => (
                                <Box
                                  key={asset['asset-id']}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '5px',
                                  }}
                                >
                                  <Typography
                                    color={'primary.main'}
                                    fontSize={'0.8rem'}
                                    fontWeight={600}
                                  >
                                    {asset['asset-id'] == 724480511 && 'ALGX'}
                                    {asset['asset-id'] == 31566704 && 'ALGO'}
                                  </Typography>
                                  <Typography
                                    color={'primary.light2'}
                                    fontSize={'0.8rem'}
                                    textAlign={'right'}
                                    data-testid={'balance'}
                                  >
                                    {(asset.amount / 1000000).toLocaleString()}
                                  </Typography>
                                </Box>
                              ))}
                          </>
                        )}
                        <Box
                          sx={{ marginBlock: '1.5rem', textAlign: 'center' }}
                        >
                          <Button
                            variant="outlined"
                            sx={{ fontSize: '0.8rem' }}
                            onClick={() => handleDisconnect(address, type)}
                            data-testid={'disconnect'}
                          >
                            {t('Disconnect')} {shortenAddress({ address })}
                          </Button>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}
        </>
      ) : (
        <>
          <Typography
            fontSize={'0.95rem'}
            fontStyle={'italic'}
            color={'primary.contrastText'}
            marginBlock={'10vh'}
            textAlign={'center'}
          >
            {t('Connect wallets and manage here')}
          </Typography>
        </>
      )}
    </>
  )
}
