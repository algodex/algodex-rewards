import Head from 'next/head'

// Material UI components
import Container from '@mui/material/Container'

/**
 * Custom 500 Error
 * @returns {JSX.Element}
 * @constructor
 */
export default function Custom404() {
  return (
    <>
      <Head>
        <title> Service Error</title>
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
        <h1>500 - Service Error</h1>
      </Container>
    </>
  )
}
