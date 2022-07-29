import { getUSDPrice } from '@/lib/getTinymanPrice'
import { useCallback, useEffect, useState } from 'react'

export const usePriceConversionHook = ({ assetId = '724480511', conversionFunc = getUSDPrice }) => {
  const [conversionRate, setConversionRate] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchRate = useCallback(
    async (assetId) => {
      setLoading(true)
      const price = await conversionFunc(assetId)
      setConversionRate(price)
      setLoading(false)
    },
    [setConversionRate, conversionFunc]
  )

  useEffect(() => {
    if(assetId){
      fetchRate(assetId)
    }
  }, [assetId])

  return { conversionRate, fetchRate, loading }
}
