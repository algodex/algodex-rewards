import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { defaults } from 'next-i18next.config'

// Material UI components
import Container from '@mui/material/Container'

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

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="md" sx={{ paddingInline: '2rem' }}>
        <WalletDropdown screen={'wallet'} />
        <WalletList />
      </Container>
    </>
  )
}
