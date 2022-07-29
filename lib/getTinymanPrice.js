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
    const latestPrice = assetData[assetId].price / algoPrice
    return latestPrice
  } else {
    return ''
  }
}
