import React from 'react'
import Image from 'next/image'

//Material UI
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'

//Custom hook
import useWallets from '@/hooks/useWallets'

const styles = {
  accordionStyles: {
    marginBlock: '1rem',
    boxShadow: 'none',
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
}

export const WalletList = () => {
  const { addresses, myAlgoDisconnect, peraDisconnect } = useWallets()

  const shortenAddress = (address) => {
    const list = address.split('')
    const first = list.slice(0, 6)
    const last = list.slice(list.length - 6, list.length)
    return `${first.join('')}...${last.join('')}`
  }

  const disconnectWallet = (address, type) => {
    if (type == 'my-algo-wallet') {
      myAlgoDisconnect(address)
    } else {
      peraDisconnect(address)
    }
  }

  return (
    <>
      {addresses.map(({ address, type }) => (
        <Box key={address} marginY={'2rem'}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              color: 'primary.light',
            }}
          >
            <Typography fontSize={'0.95rem'}>WALLET NAME</Typography>
            <Typography fontSize={'0.95rem'}>BALANCE</Typography>
          </Box>
          <Accordion sx={styles.accordionStyles}>
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ color: 'primary.contrastText' }} />
              }
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                ['&.Mui-expanded']: { minHeight: 'auto' },
                ['.css-o4b71y-MuiAccordionSummary-content.Mui-expanded']: {
                  margin: 0,
                },
              }}
            >
              <Typography
                fontWeight={500}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'primary.contrastText',
                }}
              >
                <Image
                  src="/wallet-outline.svg"
                  height={13}
                  width={14}
                  alt="wallet"
                />
                <span style={{ marginLeft: '10px' }}>
                  {shortenAddress(address)}
                </span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {[
                ...Array(
                  '812,569.26589',
                  '512.456',
                  '10.2',
                  '1007898.56',
                  '5.668',
                  '22.224'
                ),
              ].map((asset) => (
                <Box
                  key={asset}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '5px',
                  }}
                >
                  <Typography
                    color={'primary.main'}
                    fontSize={'0.8rem'}
                    fontWeight={600}
                  >
                    ALGO
                  </Typography>
                  <Typography
                    color={'primary.light2'}
                    fontSize={'0.8rem'}
                    textAlign={'right'}
                  >
                    {asset}
                  </Typography>
                </Box>
              ))}

              <Box sx={{ marginBlock: '1.5rem', textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  sx={{ fontSize: '0.8rem' }}
                  onClick={() => disconnectWallet(address, type)}
                >
                  Disconnect {shortenAddress(address)}
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      ))}
    </>
  )
}
