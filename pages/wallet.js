/* 
 * Algodex Rewards 
 * Copyright (C) 2022 Algodex VASP (BVI) Corp.
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { defaults } from 'next-i18next.config'

// Material UI components
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
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
            lg={8}
            xl={7}
            marginX={'auto'}
            marginY={'1rem'}
          >
            <Box
              sx={{
                backgroundColor: '#232B3C',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                border: '1px solid',
                borderColor: 'secondary.light3',
                padding: '16px',
                borderRadius: '3px',
              }}
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
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
