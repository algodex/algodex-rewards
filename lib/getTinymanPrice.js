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
