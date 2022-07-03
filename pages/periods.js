import { useContext } from 'react'
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


//context api
import { WalletsContext } from '@/hooks/useWallets'

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...defaults, 'periods'])),
    },
  }
}

export default function Periods() {
  const { t } = useTranslation('periods')
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
        <hr />
        <CurrentEpochCard isConnected={isConnected} />
        <EpochTable isConnected={isConnected} />
      </Container>
    </>
  )
}
