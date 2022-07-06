import useWallets from '@/hooks/useWallets'
import {createContext, useContext, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import algosdk from 'algosdk'


const RewardsAddressesContext = createContext(undefined)

export function RewardsAddressesProvider({ children }) {
  const [formattedAddresses, setFormattedAddresses] = useState([])
  const [addresses, setAddresses] = useState([])
  return (
    <RewardsAddressesContext.Provider value={
      {addresses, setAddresses, formattedAddresses, setFormattedAddresses}
    }>
      {children}
    </RewardsAddressesContext.Provider>
  )
}
RewardsAddressesProvider.propTypes = {
  children: PropTypes.node
}
const indexerClient = new algosdk.Indexer(
  '',
  'https://algoindexer.algoexplorerapi.io',
  443
)
/**
 * Account info from Algorand Indexer
 * @param {Wallet} wallet
 * @return {Object}
 * @private
 */
const _getEmptyAccountInfo = (wallet) => {
  return {
    'amount': 0,
    'amount-without-pending-rewards': 0,
    'apps-local-state': [],
    'apps-total-schema': {'num-byte-slice': 0, 'num-uint': 0},
    'assets': [],
    'created-apps': [],
    'created-assets': [],
    'pending-rewards': 0,
    'reward-base': 0,
    'rewards': 0,
    'round': -1,
    'status': 'Offline',
    ...wallet,
  }
}
export default function useRewardsAddresses(){
  const context = useContext(RewardsAddressesContext)
  if (context === undefined) {
    throw new Error('Must be inside of a Rewards Addresses Provider')
  }
  const {formattedAddresses, setFormattedAddresses, addresses, setAddresses} = context
  const {addresses: _addresses} = useWallets()

  useEffect(()=>{
    setFormattedAddresses(addresses.map(addr=>addr.name))
  },[addresses])

  useEffect(()=>{
    // handle storing and removing from localstorage
  },[])

  useEffect(()=>{
    async function updateAddresses(addrs){
      const result = await Promise.all(addrs.map(async (addr)=>{
        let accountInfo
        try{
          accountInfo = (await indexerClient
            .lookupAccountByID(addr.address)
            .includeAll(true)
            .do()).account
          if(typeof accountInfo?.assets ==='undefined' ){
            accountInfo.assets = []
          }
        } catch(e){
          if(e.status !== 404){
            throw e
          } else {
            accountInfo = _getEmptyAccountInfo(addr)
          }
        }
        return {
          ...addr,
          ...accountInfo
        }
      }))
      console.log(result)
      setAddresses(result)
    }
    updateAddresses(_addresses)
  },[_addresses])

  return {formattedAddresses, setFormattedAddresses, addresses, setAddresses}
}
