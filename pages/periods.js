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

// Custom components and hook(s)
import { WalletDropdown } from '@/components/WalletDropdown'
import { CurrentEpochCard } from '@/components/Periods/CurrentEpochCard'
import { PeriodTable } from '@/components/Tables/PeriodTable'
import useRewardsAddresses from '@/hooks/useRewardsAddresses'
import { usePeriodsHook } from '@/hooks/usePeriodsHook'
import { AssetContainer } from '@/components/AssetContainer'
import { PeriodContext } from 'context/periodContext'

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...defaults, 'periods'])),
    },
  }
}

export default function Periods() {
  const { t } = useTranslation('periods')
  const { addresses, activeWallet } = useRewardsAddresses()
  const isConnected = addresses.length > 0
  const { rewards, vestedRewards, loading, pendingPeriod } = usePeriodsHook({
    activeWallet,
  })
  const context = useContext(PeriodContext)
  const { periodAssets } = context
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
  const [activeCurrency, setActiveCurrency] = useState('ALGX')
  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
        <link rel="icon" href="/favicon.ico" />
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
            lg={5}
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
              activeWallet={activeWallet}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={isConnected ? 6 : 12}
            lg={isConnected ? 7 : 12}
            xl={isConnected ? 7 : 12}
            sx={isMobile ? { maxWidth: '100% !important' } : {}}
          >
            <CurrentEpochCard
              isConnected={isConnected}
              loading={loading}
              rewards={rewards}
              vestedRewards={vestedRewards}
              pendingPeriod={pendingPeriod}
              activeCurrency={activeCurrency}
              setActiveCurrency={setActiveCurrency}
            />
            {!isMobile && periodAssets.length > 0 && (
              <Grid container spacing={2}>
                {periodAssets.map((asset) => (
                  <Grid
                    key={asset.assetId}
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    xl={6}
                  >
                    <AssetContainer asset={asset} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
