import { useContext } from 'react'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { defaults } from 'next-i18next.config'

// Material UI components
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

// Custom components and hook(s)
import { WalletDropdown } from '@/components/WalletDropdown'
import { EarningsChart } from '@/components/Chart/EarningsChart'
import { AssetTable } from '@/components/Tables/AssetTable'


//context api
import { WalletsContext } from '@/hooks/useWallets'

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...defaults, 'chart'])),
    },
  }
}

export default function Chart() {
  const { t } = useTranslation('chart')
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
        <EarningsChart isConnected={isConnected} />
        <Box sx={{ paddingBlock: '2rem' }}>
          <AssetTable isConnected={isConnected} />
        </Box>
      </Container>
    </>
  )
}
