import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { defaults } from 'next-i18next.config'

// Material UI components
import Container from '@mui/material/Container'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

// Custom components and hook(s)
import { WalletDropdown } from '@/components/WalletDropdown'
import { CurrentEpochCard } from '@/components/Periods/CurrentEpochCard'
import { EpochTable } from '@/components/Tables/EpochTable'
import useRewardsAddresses from '@/hooks/useRewardsAddresses'
import { usePeriodsHook } from '@/hooks/usePeriodsHook'
import { useState } from 'react'

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
  const { rewards, vestedRewards, loading } = usePeriodsHook({ activeWallet })
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
        <CurrentEpochCard
          isConnected={isConnected}
          loading={loading}
          rewards={rewards}
          vestedRewards={vestedRewards}
          activeCurrency={activeCurrency}
          setActiveCurrency={setActiveCurrency}
        />
        <EpochTable
          isConnected={isConnected}
          loading={loading}
          rewards={rewards}
          vestedRewards={vestedRewards}
          activeCurrency={activeCurrency}
        />
      </Container>
    </>
  )
}
