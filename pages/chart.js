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

import { useContext } from 'react'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { defaults } from 'next-i18next.config'

// Material UI components
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

// Custom components and hook(s)
import { WalletDropdown } from '@/components/WalletDropdown'
import { EarningsChart } from '@/components/Chart/EarningsChart'
import { AssetTable } from '@/components/Tables/AssetTable'

//context api
import { RewardsAddressesContext } from '@/hooks/useRewardsAddresses'

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...defaults, 'chart'])),
    },
  }
}

export default function Chart() {
  const { t } = useTranslation('chart')
  const { isConnected } = useContext(RewardsAddressesContext)
  // const isConnected = false
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))

  return (
    <>
      <Head>
        <title>{t('title')}</title>
      </Head>
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
        {isMobile && (
          <>
            <WalletDropdown />
            <hr />
          </>
        )}
        <EarningsChart isConnected={isConnected} isMobile={isMobile} />
        <Box sx={{ paddingBlock: '2rem' }}>
          <AssetTable isConnected={isConnected} />
        </Box>
      </Container>
    </>
  )
}
