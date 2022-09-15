/* eslint-disable max-len */
import React, { useMemo } from 'react'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'

//Material UI
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
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
    marginBlock: '1rem',
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'primary.light',
                }}
              >
                <Typography fontSize={'0.95rem'}>{t('WALLET NAME')}</Typography>
                <Typography fontSize={'0.95rem'}>{t('BALANCE')}</Typography>
              </Box>
              <Accordion sx={styles.accordionStyles}>
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon sx={{ color: 'primary.contrastText' }} />
                  }
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  sx={{
                    ['&.Mui-expanded']: { minHeight: 'auto' },
                    ['.css-o4b71y-MuiAccordionSummary-content.Mui-expanded']: {
                      margin: 0,
                    },
                    opacity: `${address == activeWallet?.address ? 1 : '0.65'}`,
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
                      data-testid={'address'}
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
                  <Box sx={{ marginBlock: '1.5rem', textAlign: 'center' }}>
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
