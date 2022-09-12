/* eslint-disable max-len */
import algosdk from 'algosdk'

let envObjs = null

export const getAlgodex = () => {
  if (!this.envObjs) {
    const environment = this.getEnvironment()
    const algodexEnvironment = this.getAlgodexEnvironment()
    const algodToken = ''
    const algodServer = 'https://node.algoexplorerapi.io/'
    const algodPort = ''

    const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort)

    envObjs = {
      algodClient,
      environment,
      algodexEnvironment,
    }
  }
  return envObjs
}

export const getAlgodexEnvironment = () => {
  return process.env.NEXT_PUBLIC_ALGODEX_ENVIRONMENT || 'public_test'
}

export const getEnvironment = () => {
  const algodexEnvironment = this.getAlgodexEnvironment()
  if (algodexEnvironment === 'production') {
    return 'mainnet'
  }
  return 'testnet'
}

export const shortenAddress = ({ address }) => {
  const list = address.split('')
  const first = list.slice(0, 6)
  const last = list.slice(list.length - 6, list.length)
  return `${first.join('')}...${last.join('')}`
}
