import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { defaults } from '../next-i18next.config'
import Head from 'next/head'
import WalletConnect from "@walletconnect/client";
import QRCodeModal from 'algorand-walletconnect-qrcode-modal'

const connector = new WalletConnect({
  bridge: 'https://bridge.walletconnect.org', // Required
  qrcodeModal: QRCodeModal
})

// Material UI components
import Container from '@mui/material/Container'

//Custom components
import { EarningsChart } from '@/components/Chart/EarningsChart'
import { AssetList } from '@/components/AssetList'
import { WalletDropdown } from '@/components/WalletDropdown'
import { PendingEpochCard } from '@/components/Periods/PendingEpochCard'
import { TotalRewardsCard } from '@/components/Periods/TotalRewardsCard'

//Custom hooks
import useRewardsAddresses from '@/hooks/useRewardsAddresses'

// Lib files
import { signUpForRewards } from '@/lib/send_transaction'

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...defaults, 'index'])),
    },
  }
}
export default function Home() {
  const { t } = useTranslation('index')
  const { addresses, activeWallet, setActiveWallet } = useRewardsAddresses()
  const isConnected = addresses.length > 0
  const connectorRef = useRef(connector)
 

  useEffect(() => {
    // eslint-disable-next-line max-len
    // This useEffect is necessary because when getting the wallet from localStorage the sendCustomRequest method is undefined
    // rerunning peraConnect reAttaches the signing method to the connector.
    if (
      activeWallet?.type === 'wallet-connect' &&
      typeof activeWallet.connector.sendCustomRequest === 'undefined'
    ) {
      setActiveWallet({
        ...activeWallet, connector: connectorRef.current})
    }
  }, [activeWallet])

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="description" content={t("description")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth="md" sx={{ paddingInline: "2rem" }}>
        <WalletDropdown />
        <button onClick={() => signUpForRewards(activeWallet)}>
          Sign Up for rewards
        </button>
        <TotalRewardsCard isConnected={isConnected} />
        <PendingEpochCard isConnected={isConnected} />
        <hr />
        <EarningsChart isConnected={isConnected} />
        <hr />
        <AssetList isConnected={isConnected} />
      </Container>
    </>
  );
}
