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

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import PropTypes from 'prop-types'
import { usePeriodsHook } from '@/hooks/usePeriodsHook'
import useRewardsAddresses from '@/hooks/useRewardsAddresses'
import { getEpochEnd } from '@/lib/getRewards'
import { DateTime } from 'luxon'
import { usePriceConversionHook } from '@/hooks/usePriceConversionHook'
import { getAlgoExplorerAssets, getAssets } from '@/lib/getAlgoAssets'
import { getEpochStart } from '../lib/getRewards'
import { attachCurrency } from '../lib/helper'

export const ChartDataContext = createContext(undefined)

export function ChartDataProvider({ children }) {
  const stagesEnum = {
    0: 'Total',
    1: 'Mainnet Stage 1',
    2: 'Mainnet Stage 2',
  }
  const now = new Date()
  const timeRangeEnum = {
    '1Wk': {
      value: '1Wk',
      name: '1 Week',
      epoch: Date.parse(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      ),
    },
    '1M': {
      value: '1M',
      name: '1 Month',
      epoch: Date.parse(
        new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      ),
    },
    '3M': {
      value: '3M',
      name: '3 Months',
      epoch: Date.parse(
        new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
      ),
    },
    '1Y': {
      value: '1Y',
      name: '1 Year',
      epoch: Date.parse(
        new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      ),
    },
    YTD: {
      value: 'YTD',
      name: 'YTD',
      epoch: Date.parse(new Date(now.getFullYear(), 0, 1)),
    },
  }

  const [activeRange, setActiveRange] = useState(timeRangeEnum['1Y'].value)
  const [activeStage, setActiveStage] = useState(stagesEnum[0])
  const [activeCurrency, setActiveCurrency] = useState('ALGX')
  const [includeUnvested, setIncludeUnvested] = useState(true)
  const { conversionRate } = usePriceConversionHook({})
  const { activeWallet } = useRewardsAddresses()
  const { rewards, vestedRewards, pendingPeriod } = usePeriodsHook({
    activeWallet,
  })
  const [tinymanAssets, setTinymanAssets] = useState({})
  const [selected, setSelected] = useState(['ALL'])
  const [assetTableData, setAssetTableData] = useState([
    {
      asset: 'ALL',
      EDRewards: 0,
      total: 0,
    },
  ])
  const [availableAssets, setAvailableAssets] = useState({})

  useEffect(() => {
    const getAllAssets = async () => {
      try {
        const res = await getAssets()
        setTinymanAssets(res)
      } catch (error) {
        getAllAssets()
      }
    }
    getAllAssets()
  }, [])

  const withinTimeRange = (epoch) => {
    return epoch * 1000 >= timeRangeEnum[activeRange].epoch
  }

  const withinStageData = (epoch) => {
    if (activeStage == stagesEnum[1]) {
      return epoch <= 4
    } else if (activeStage == stagesEnum[2]) {
      return epoch > 4
    } else {
      return true
    }
  }

  const amoungSelected = (accrualAssetId) => {
    if (
      selected.includes(availableAssets[accrualAssetId]?.unit_name) ||
      selected.includes('ALL')
    ) {
      return true
    } else {
      return false
    }
  }

  const vestedChartData = useMemo(() => {
    const data = []
    const rewardsCopy = [
      ...vestedRewards.filter(
        ({ value: { epoch, vestedUnixTime, accrualAssetId } }) =>
          withinStageData(epoch) &&
          withinTimeRange(vestedUnixTime) &&
          amoungSelected(accrualAssetId)
      ),
    ]
    rewardsCopy.sort((a, b) => a.value.epoch - b.value.epoch)
    rewardsCopy.forEach(({ value }) => {
      const time = DateTime.fromJSDate(
        new Date(value.vestedUnixTime * 1000)
      ).toFormat('yyyy-LL-dd')
      const _value = value.formattedVestedRewards

      // Check if the current time exist in the data. If found, sum up the data
      const found = data.find(({ time: _time }) => _time == time)
      const foundIndex = data.findIndex(({ time: _time }) => _time == time)
      if (found) {
        data.splice(foundIndex, 1, {
          time,
          value: _value + found.value,
        })
      } else {
        data.push({
          time,
          value: _value,
        })
      }
    })
    return data
  }, [vestedRewards, activeStage, activeRange, selected])

  const earnedChartData = useMemo(() => {
    const data = []
    if (includeUnvested) {
      const rewardsCopy = [
        ...rewards.filter(
          ({ value: { epoch, accrualAssetId } }) =>
            withinStageData(epoch) &&
            withinTimeRange(getEpochEnd(epoch)) &&
            amoungSelected(accrualAssetId)
        ),
      ]

      rewardsCopy.sort((a, b) => a.value.epoch - b.value.epoch)
      rewardsCopy.forEach(({ value }) => {
        const time = DateTime.fromJSDate(
          new Date(getEpochEnd(value.epoch) * 1000)
        ).toFormat('yyyy-LL-dd')
        const _value = value.earnedRewardsFormatted

        // Check if the current time exist in the data. If found, sum up the data
        const found = data.find(({ time: _time }) => _time == time)
        const foundIndex = data.findIndex(({ time: _time }) => _time == time)
        if (found) {
          data.splice(foundIndex, 1, {
            time,
            value: _value + found.value,
          })
        } else {
          data.push({
            time,
            value: _value,
          })
        }
      })
    }
    return data
  }, [rewards, includeUnvested, activeStage, activeRange, selected])

  const getAssetTableData = useCallback(async () => {
    let _includeUnvested = includeUnvested
    let rewardsCopy = includeUnvested
      ? [
        ...rewards.filter(
          ({ value: { epoch } }) =>
            withinStageData(epoch) && withinTimeRange(getEpochEnd(epoch))
        ),
      ]
      : [
        ...vestedRewards.filter(
          ({ value: { epoch, vestedUnixTime } }) =>
            withinStageData(epoch) && withinTimeRange(vestedUnixTime)
        ),
      ]
    // If includeUnvested and earnedRewards has no data for the current filter,
    // replace with vestedRewards data
    if (rewardsCopy.length < 1 && _includeUnvested) {
      _includeUnvested = false
      rewardsCopy = [
        ...vestedRewards.filter(
          ({ value: { epoch, vestedUnixTime } }) =>
            withinStageData(epoch) && withinTimeRange(vestedUnixTime)
        ),
      ]
    }

    // Get epoch with the haighest number
    const totalMaxRwd = rewardsCopy.find(
      ({ value: { epoch } }) =>
        epoch === Math.max(...rewardsCopy.map(({ value: { epoch } }) => epoch))
    )

    let estDailyRwd = 0
    if (totalMaxRwd) {
      estDailyRwd = _includeUnvested
        ? totalMaxRwd.value.earnedRewardsFormatted / 7
        : totalMaxRwd.value.formattedVestedRewards / 7
    }

    const data = [
      {
        asset: 'ALL',
        EDRewards: attachCurrency({
          price: estDailyRwd,
          activeCurrency,
          conversionRate,
        }),
        total: attachCurrency({
          price: _includeUnvested
            ? rewardsCopy.reduce(
              (a, b) => a + b.value.earnedRewardsFormatted,
              0
            )
            : rewardsCopy.reduce(
              (a, b) => a + b.value.formattedVestedRewards,
              0
            ),
          activeCurrency,
          conversionRate,
        }),
      },
    ]

    const assets = {}
    if (rewardsCopy.length > 0) {
      rewardsCopy.forEach(({ value, value: { accrualAssetId } }) => {
        if (assets[accrualAssetId]) {
          assets[accrualAssetId] = [...assets[accrualAssetId], value]
        } else {
          assets[accrualAssetId] = [value]
        }
      })
    }
    await Promise.all(
      Object.keys(assets).map(async (accrualAssetId) => {
        const list = assets[accrualAssetId]
        const max = Math.max(...list.map(({ epoch }) => epoch))
        const maxRwd = list.find(({ epoch }) => epoch == max)
        let dailyRwd = 0
        if (maxRwd) {
          dailyRwd = _includeUnvested
            ? maxRwd.earnedRewardsFormatted / 7
            : maxRwd.formattedVestedRewards / 7
        }

        try {
          const assetInfo = await getAlgoExplorerAssets(accrualAssetId)
          setAvailableAssets((prev) => ({
            ...prev,
            [`${accrualAssetId}`]: {
              unit_name: assetInfo['unit-name'],
              ...assetInfo,
            },
          }))

          data.push({
            asset: assetInfo?.['unit-name'] || '??',
            EDRewards: attachCurrency({
              price: dailyRwd,
              activeCurrency,
              conversionRate,
            }),
            total: _includeUnvested
              ? attachCurrency({
                price: list.reduce((a, b) => a + b.earnedRewardsFormatted, 0),
                activeCurrency,
                conversionRate,
              })
              : attachCurrency({
                price: list.reduce((a, b) => a + b.formattedVestedRewards, 0),
                activeCurrency,
                conversionRate,
              }),
          })
        } catch (e) {
          // console.error(e)
        }
      })
    )
    setAssetTableData(data)
  }, [
    rewards,
    vestedRewards,
    includeUnvested,
    activeCurrency,
    activeStage,
    activeRange,
  ])

  useEffect(() => {
    getAssetTableData()
  }, [
    rewards,
    vestedRewards,
    includeUnvested,
    activeCurrency,
    activeStage,
    activeRange,
  ])

  const lastWkEarnedAssets = useMemo(() => {
    const data = []
    const assets = {}
    const lastWkUnixStart = Math.floor(
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6) / 1000
    )
    const lastWkEpochStart = Math.floor(
      (lastWkUnixStart - getEpochStart(1)) / 604800 + 1
    )
    if (rewards.length > 0) {
      rewards.forEach(({ value, value: { epoch } }) => {
        //calculate rewards within last week's epoch
        if (epoch === lastWkEpochStart) {
          if (assets[value.accrualAssetId]) {
            assets[value.accrualAssetId] = [
              ...assets[value.accrualAssetId],
              value,
            ]
          } else {
            assets[value.accrualAssetId] = [value]
          }
        }
      })
    }

    for (const accrualAssetId in assets) {
      const list = assets[accrualAssetId]
      data.push({
        accrualAssetId,
        lastWeek: list.reduce((a, b) => a + b.earnedRewardsFormatted, 0),
        algoTotalDepth:
          list.reduce((a, b) => a + b.algoTotalDepth, 0) /
          (10080 * list.length),
        asaTotalDepth:
          list.reduce((a, b) => a + b.asaTotalDepth, 0) / (10080 * list.length),
        assetName: tinymanAssets[accrualAssetId]?.unit_name || '??',
        assetLogo:
          tinymanAssets[accrualAssetId]?.logo?.svg ||
          'https://asa-list.tinyman.org/assets/??',
      })
    }

    return data
  }, [rewards, tinymanAssets])

  return (
    <ChartDataContext.Provider
      value={{
        assetTableData,
        timeRangeEnum,
        stagesEnum,
        activeRange,
        setActiveRange,
        activeStage,
        setActiveStage,
        vestedChartData,
        earnedChartData,
        lastWkEarnedAssets,
        activeCurrency,
        setActiveCurrency,
        includeUnvested,
        setIncludeUnvested,
        selected,
        setSelected,
        availableAssets,
        pendingPeriod,
        rewards,
      }}
    >
      {children}
    </ChartDataContext.Provider>
  )
}
ChartDataProvider.propTypes = {
  children: PropTypes.node,
}
