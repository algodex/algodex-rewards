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

import { getUSDPrice } from '@/lib/getAlgoAssets'
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
