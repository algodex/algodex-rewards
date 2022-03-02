import Head from 'next/head'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@/components/Link'

export default function Home() {
  return (
    <>
      <Head>
        <title>About</title>
        <meta name="description" content="About Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Example Favorites Page
          </Typography>
          <Link href="/" color="secondary">
            Go to the home page
          </Link>
        </Box>
      </Container>
    </>
  )
}
