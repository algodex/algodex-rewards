import React, { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { defaults } from '../next-i18next.config'
import Head from 'next/head'

// Material UI components
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

//Custom components
import { EarningsChart } from '@/components/Chart/EarningsChart'
import { AssetList } from '@/components/AssetList'
import { WalletDropdown } from '@/components/WalletDropdown'
import { PendingEpochCard } from '@/components/Periods/PendingEpochCard'
import { TotalRewardsCard } from '@/components/Periods/TotalRewardsCard'

//Custom hooks
import useRewardsAddresses from '@/hooks/useRewardsAddresses'

// Lib files
import { signUpForRewards } from '@/lib/send_transaction'

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...defaults, 'index'])),
    },
  }
}
export default function Home() {
  const { t } = useTranslation('index')
  const { addresses, activeWallet, peraConnect } = useRewardsAddresses()
  const isConnected = addresses.length > 0
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))

  // const isConnected = false

  useEffect(() => {
    // eslint-disable-next-line max-len
    // This useEffect is necessary because when getting the wallet from localStorage the sendCustomRequest method is undefined
    // rerunning peraConnect reAttaches the signing method to the connector.
    if (
      activeWallet?.type === 'wallet-connect' &&
      typeof activeWallet.connector.sendCustomRequest === 'undefined'
    ) {
      peraConnect(activeWallet)
    }
  }, [activeWallet])

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="md" sx={{ paddingInline: '2rem' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <WalletDropdown />
            <button onClick={() => signUpForRewards(activeWallet)}>
              Sign Up for rewards
            </button>
            <TotalRewardsCard isConnected={isConnected} />
            <PendingEpochCard isConnected={isConnected} />
            {isMobile && (
              <Divider sx={{ borderColor: 'primary.contrastText' }} />
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={8} xl={8}>
            <EarningsChart isConnected={isConnected} />
            {isMobile && (
              <Divider sx={{ borderColor: 'primary.contrastText' }} />
            )}
          </Grid>
        </Grid>
        <AssetList isConnected={isConnected} />
      </Container>
    </>
  )
}
