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
import { WalletList } from '@/components/WalletList'

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...defaults, 'wallet'])),
    },
  }
}

export default function Wallet() {
  const { t } = useTranslation('wallet')
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
        {isMobile && <WalletDropdown screen={'wallet'} />}
        <WalletList />
      </Container>
    </>
  )
}
