import * as React from 'react'
import Container from '@mui/material/Container'
// import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Head from 'next/head'
import Link from '@/components/Link'

export default function Home() {
  return (
    <>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Example Homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="md" sx={{ my: 4, flex: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
            Example Home Page
        </Typography>
        <Link href="/favorites" color="secondary">
            Go to the favorites page
        </Link>
      </Container>
    </>
  )
}
