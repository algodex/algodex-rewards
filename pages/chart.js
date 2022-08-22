import { useContext } from 'react'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { defaults } from 'next-i18next.config'

// Material UI components
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

// Custom components and hook(s)
import { WalletDropdown } from '@/components/WalletDropdown'
import { EarningsChart } from '@/components/Chart/EarningsChart'
import { AssetTable } from '@/components/Tables/AssetTable'

//context api
import { RewardsAddressesContext } from '@/hooks/useRewardsAddresses'

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...defaults, 'chart'])),
    },
  }
}

export default function Chart() {
  const { t } = useTranslation('chart')
  const { addresses } = useContext(RewardsAddressesContext)
  const isConnected = addresses.length > 0
  // const isConnected = false
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))

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
        <EarningsChart isConnected={isConnected} isMobile={isMobile} />
        <Box sx={{ paddingBlock: '2rem' }}>
          <AssetTable isConnected={isConnected} />
        </Box>
      </Container>
    </>
  )
}
