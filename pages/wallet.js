import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { defaults } from 'next-i18next.config'

// Material UI components
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

// Custom components and hook(s)
import { WalletDropdown } from '@/components/WalletDropdown'
import { WalletList } from '@/components/WalletList'
import Link from '../components/Nav/Link'

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
      <Link
        href="/"
        fontSize={'0.9rem'}
        sx={{
          color: 'secondary.light',
          marginTop: '2rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
        }}
        data-testid={'return-home'}
      >
        <ChevronLeftIcon /> {t('Return Home')}
      </Link>
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
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={12}
            md={10}
            lg={7}
            xl={6}
            marginX={'auto'}
            marginY={'1rem'}
          >
            <Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={8}
                lg={7}
                xl={6}
                marginX={'auto'}
              >
                <WalletDropdown screen={'wallet'} />
              </Grid>
            </Grid>
            <WalletList />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
