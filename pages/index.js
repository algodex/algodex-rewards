import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { defaults } from '../next-i18next.config'
import Head from 'next/head'

// Material UI components
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import LoadingButton from '@mui/lab/LoadingButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

//Custom components
import { EarningsChart } from '@/components/Chart/EarningsChart'
import { AssetList } from '@/components/AssetList'
import { WalletDropdown } from '@/components/WalletDropdown'
import { PendingEpochCard } from '@/components/Periods/PendingEpochCard'
import { TotalRewardsCard } from '@/components/Periods/TotalRewardsCard'
import { WarningCard } from '@/components/WarningCard'
import { SignUpResponse } from '@/components/Modals/SignUpResponse'

//Custom hooks
import useRewardsAddresses from '@/hooks/useRewardsAddresses'
import { useSignUpHook } from '@/hooks/useSignUpHook'
import { usePeriodsHook } from '@/hooks/usePeriodsHook'

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...defaults, 'index'])),
    },
  }
}
export default function Home() {
  const { t } = useTranslation('index')
  const { addresses, activeWallet, minAmount } = useRewardsAddresses()
  const isConnected = addresses.length > 0
  const [walletSignedUp, setWalletSignedUp] = useState(activeWallet?.signedUp)
  const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'))
  const { loading, openModal, setOpenModal, actionStatus, signUp } =
    useSignUpHook({
      setWalletSignedUp,
      activeWallet,
    })
  const {
    rewards,
    loading: loadingReward,
    vestedRewards,
  } = usePeriodsHook({ activeWallet })

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
        <link rel="icon" href="/favicon.ico" />
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
        {isConnected && !isMobile && activeWallet?.amount < minAmount && (
          <WarningCard
            warnings={[
              // eslint-disable-next-line max-len
              `At least ${minAmount} ALGX must be held for a wallet to vest retroactive rewards and/or earn new rewards. Plan is subject to change as nessesary.`,
            ]}
          />
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            {isMobile && <WalletDropdown />}
            <Box sx={{ paddingTop: !isMobile ? '2rem' : '' }}>
              <SignUpResponse
                open={openModal}
                address={activeWallet?.address}
                actionStatus={actionStatus}
                handleClose={() => setOpenModal(!openModal)}
              />
            </Box>
            {!walletSignedUp && isConnected && (
              <LoadingButton
                variant="outline"
                sx={{
                  textDecoration: 'capitalize',
                  color: 'primary.dark',
                  fontWeight: '600',
                  backgroundColor: 'primary.main',
                  ['&:hover']: {
                    backgroundColor: 'primary.main',
                  },
                }}
                onClick={signUp}
                loading={loading}
              >
                Sign Up for rewards
              </LoadingButton>
            )}
            <TotalRewardsCard
              isConnected={isConnected}
              rewards={rewards}
              loading={loadingReward}
              vestedRewards={vestedRewards}
            />
            <PendingEpochCard
              isConnected={isConnected}
              rewards={rewards}
              loading={loadingReward}
              isMobile={isMobile}
              activeWallet={activeWallet}
              minAmount={minAmount}
            />
            {isMobile && (
              <Divider sx={{ borderColor: 'primary.contrastText' }} />
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={8} xl={8}>
            <EarningsChart isConnected={isConnected} />
            {isMobile && (
              <Divider sx={{ borderColor: 'primary.contrastText' }} />
            )}
          </Grid>
        </Grid>
        <AssetList isConnected={isConnected} rewards={rewards} />
      </Container>
    </>
  )
}
