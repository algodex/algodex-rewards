import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@/components/Link'
import {useTranslation} from 'next-i18next'

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['common', 'favorites', 'bottom-navigation', 'app-bar-toolbar']
      )),
    },
  }
}

export default function Home() {
  const { t } = useTranslation('favorites')
  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content="About Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('heading')}
          </Typography>
          <Link href="/" color="secondary">
            Go to the home page
          </Link>
          <Typography variant="body1">
            {t('body')}
          </Typography>
        </Box>
      </Container>
    </>
  )
}
