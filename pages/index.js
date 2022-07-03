import React, { useContext } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { defaults } from '../next-i18next.config'
import Head from 'next/head'

// Material UI components
import Container from '@mui/material/Container'

//Custom components
import { EarningsChart } from '@/components/Chart/EarningsChart'
import { AssetList } from '@/components/AssetList'

//Custom hooks
import { WalletDropdown } from '@/components/WalletDropdown'
import { PendingEpochCard } from '@/components/Periods/PendingEpochCard'
import { TotalRewardsCard } from '@/components/Periods/TotalRewardsCard'

//context api
import { WalletsContext } from '@/hooks/useWallets'

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...defaults, 'index'])),
    },
  }
}
export default function Home() {
  const { t } = useTranslation('index')
  const {addresses} = useContext(WalletsContext)
  const isConnected = addresses.length > 0
  // const isConnected = false


  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="md" sx={{ paddingInline: '2rem' }}>
        <WalletDropdown />
        <TotalRewardsCard isConnected={isConnected} />
        <PendingEpochCard isConnected={isConnected} />
        <hr />
        <EarningsChart isConnected={isConnected} />
        <hr />
        <AssetList isConnected={isConnected} />
      </Container>
    </>
  )
}
