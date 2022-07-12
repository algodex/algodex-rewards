import Big from 'big.js'

/**
 * Converts limit price or balance in ALGOs to ASA units (for ASAs with
 * different `decimal` properties than ALGO).
 *
 * Formula: asa_units = algo_units * (10 ^ (6 - decimals))
 *
 * @param {Number} toConvert a price/balance in ALGOs
 * @param {Number} decimals ASA's `decimals` property
 * @returns {Number} converted price/balance
 */
export const convertToAsaUnits = (toConvert, decimals) => {
  if (!toConvert) {
    return 0
  }
  const multiplier = new Big(10).pow(6 - decimals)
  const algoUnits = new Big(toConvert)
  return algoUnits.times(multiplier).toNumber()
}
