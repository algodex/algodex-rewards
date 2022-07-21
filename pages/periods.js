import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { defaults } from 'next-i18next.config'

// Material UI components
import Container from '@mui/material/Container'

// Custom components and hook(s)
import { WalletDropdown } from '@/components/WalletDropdown'
import { CurrentEpochCard } from '@/components/Periods/CurrentEpochCard'
import { EpochTable } from '@/components/Tables/EpochTable'
import useRewardsAddresses from '@/hooks/useRewardsAddresses'
import { useEffect, useState } from 'react'
import getRewardsData from 'lib/getRewards'

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
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(false)
  // const isConnected = false

  useEffect(() => {
    const fetchRewards = async (wallet) => {
      setLoading(true)
      const rewards = await getRewardsData(wallet)
      setRewards(rewards.rows)
      setLoading(false)
    }
    if (activeWallet) {
      fetchRewards(activeWallet.address)
    }
  }, [activeWallet])

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        maxWidth="md"
        sx={{ paddingInline: '2rem', paddingBottom: '2rem' }}
      >
        <WalletDropdown />
        <hr />
        <CurrentEpochCard
          isConnected={isConnected}
          loading={loading}
          rewards={rewards}
        />
        <EpochTable
          isConnected={isConnected}
          loading={loading}
          rewards={rewards}
        />
      </Container>
    </>
  )
}
