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

/* eslint-disable max-len */
import algosdk from 'algosdk'


export const getAlgodex = () => {
  let envObjs = null
  if (!envObjs) {
    const environment = getEnvironment()
    const algodexEnvironment = getAlgodexEnvironment()
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
  const algodexEnvironment = getAlgodexEnvironment()
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
