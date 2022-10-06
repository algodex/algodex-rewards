/* 
 * Algodex Rewards 
 * Copyright (C) 2021-2022 Algodex VASP (BVI) Corp.
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

import algosdk from 'algosdk'
import axios from 'axios'

const getTinymanPrice = async () => {
  const tinymanPriceURL =
    'https://mainnet.analytics.tinyman.org/api/v1/current-asset-prices/'
  // : 'https://testnet.analytics.tinyman.org/api/v1/current-asset-prices/'

  const assetData = await axios({
    method: 'get',
    url: tinymanPriceURL,
    responseType: 'json',
    timeout: 3000,
  })
  return assetData.data
}

export const getUSDPrice = async (assetId) => {
  if (assetId) {
    const assetData = await getTinymanPrice(assetId)
    return assetData[assetId].price
  } else {
    return ''
  }
}

export const getAlgoPrice = async (assetId) => {
  if (assetId) {
    const assetData = await getTinymanPrice(assetId)
    const algoPrice = assetData[0].price
    const latestPrice = (assetData[assetId]?.price || 0) / algoPrice
    return latestPrice
  } else {
    return ''
  }
}

export const getAssets = async () => {
  const tinymanAssetsURL = 'https://asa-list.tinyman.org/assets.json'

  const assetList = await axios({
    method: 'get',
    url: tinymanAssetsURL,
    responseType: 'json',
    timeout: 3000,
  })
  return assetList.data
}

const indexerClient = new algosdk.Indexer(
  '',
  'https://algoindexer.algoexplorerapi.io',
  443
)

export const getAlgoExplorerAssets = async (assetId) => {
  const res = await indexerClient
    .lookupAssetByID(assetId)
    .includeAll(true)
    .do()
  return res?.asset?.params
}
