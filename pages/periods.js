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

import { useContext, useState } from 'react'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { defaults } from 'next-i18next.config'

// Material UI components
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// Custom components and hook(s)
import { WalletDropdown } from '@/components/WalletDropdown'
import { CurrentEpochCard } from '@/components/Periods/CurrentEpochCard'
import { PeriodTable } from '@/components/Tables/PeriodTable'
import { usePeriodsHook } from '@/hooks/usePeriodsHook'
import { AssetContainer } from '@/components/AssetContainer'
import { RewardsAddressesContext } from '../hooks/useRewardsAddresses'

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...defaults, 'periods'])),
    },
  }
}

export default function Periods() {
  const { t } = useTranslation('periods')
  const { t: c } = useTranslation('common')
  const { activeWallet, isConnected } = useContext(RewardsAddressesContext)
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
  const [activeCurrency, setActiveCurrency] = useState('ALGX')
  const {
    rewards,
    vestedRewards,
    loading,
    pendingPeriod,
    mobileAssets,
    activeEpoch,
    setActiveEpoch,
    periodAssets,
    setMobileAssets,
    completedPeriod,
    currentlyEarning,
  } = usePeriodsHook({
    activeWallet,
    isMobile,
  })
  return (
    <>
      <Head>
        <title>{t('title')}</title>
      </Head>
      <Container
        maxWidth="md"
        sx={{
          paddingInline: '2rem',
          ['@media(min-width:1300px)']: {
            maxWidth: '95%',
          },
          ['@media(min-width:1500px)']: {
            maxWidth: '85%',
          },
        }}
      >
        {isMobile && (
          <>
            <WalletDropdown />
            <hr />
          </>
        )}
        <Grid
          container
          spacing={2}
          direction={isMobile ? 'column-reverse' : 'row'}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={7}
            xl={5}
            sx={isMobile ? { maxWidth: '100% !important' } : {}}
          >
            <PeriodTable
              isConnected={isConnected}
              loading={loading}
              rewards={rewards}
              vestedRewards={vestedRewards}
              pendingPeriod={pendingPeriod}
              activeCurrency={activeCurrency}
              mobileAssets={mobileAssets}
              activeEpoch={activeEpoch}
              setActiveEpoch={setActiveEpoch}
              periodAssets={periodAssets}
              setMobileAssets={setMobileAssets}
              currentlyEarning={currentlyEarning}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={isConnected ? 6 : 12}
            lg={isConnected ? 5 : 12}
            xl={isConnected ? 7 : 12}
            sx={isMobile ? { maxWidth: '100% !important' } : {}}
          >
            <CurrentEpochCard
              isConnected={isConnected}
              loading={loading}
              pendingPeriod={pendingPeriod}
              activeCurrency={activeCurrency}
              setActiveCurrency={setActiveCurrency}
              completedPeriod={completedPeriod}
            />
            {!isMobile && periodAssets.length > 0 && (
              <>
                <Typography
                  fontSize={'0.95rem'}
                  fontWeight={600}
                  color={'secondary.light'}
                  marginBottom={'1rem'}
                >
                  {c(
                    // eslint-disable-next-line max-len
                    'These tiles below are for ASAs this wallet provided liquidity to over this period'
                  )}
                  .{' '}
                  {c(
                    '“Amount Supplied” is the average supplied over the period'
                  )}
                  .
                </Typography>
                <Typography
                  fontSize={'0.95rem'}
                  fontStyle={'italic'}
                  color={'secondary.light'}
                  marginBottom={'1rem'}
                >
                  {c(
                    // eslint-disable-next-line max-len
                    'Only ASAs that this wallet provided liquidity to over this period are shown here'
                  )}
                  .
                </Typography>
                <Grid container spacing={2}>
                  {periodAssets.map((asset) => (
                    <Grid
                      key={asset.accrualAssetId}
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={6}
                    >
                      <AssetContainer asset={asset} />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
