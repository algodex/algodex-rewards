import Head from 'next/head'

// Material UI components
import Container from '@mui/material/Container'

/**
 * Custom 404 Error
 * @returns {JSX.Element}
 * @constructor
 */
export default function Custom404() {
  return (
    <>
      <Head>
        <title>Not Found</title>
      </Head>
      <Container
        maxWidth="md"
        sx={{
          color: 'primary.main',
          backgroundColor: 'background.default',
          textAlign: 'center',
          marginTop: '40vh',
        }}
      >
        <h1>404 - Page Not Found</h1>
      </Container>
    </>
  )
}
