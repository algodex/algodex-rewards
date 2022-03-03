import * as React from 'react'
import Container from '@mui/material/Container'
// import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Head from 'next/head'
import Link from '@/components/Nav/Link'
import {useTranslation} from 'next-i18next'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {defaults} from '../next-i18next.config'
import Box from '@mui/material/Box'
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        [...defaults, 'index']
      )),
    },
  }
}
export default function Home() {
  const { t } = useTranslation('index')
  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('heading')}
          </Typography>
          <Link href="/favorites" color="secondary">
            {t('favorites-page-link')}
          </Link>
          <Typography variant="body1">
            {t('body')}
          </Typography>
        </Box>
      </Container>
    </>
  )
}
