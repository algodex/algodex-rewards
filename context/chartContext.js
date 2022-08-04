import { createContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { usePeriodsHook } from '@/hooks/usePeriodsHook'
import useRewardsAddresses from '@/hooks/useRewardsAddresses'
import { getEpochEnd } from '@/lib/getRewards'
import { DateTime } from 'luxon'
import { dummyChartData } from '@/lib/dummyChartData'
import { usePriceConversionHook } from '@/hooks/usePriceConversionHook'
import { getAssets } from '@/lib/getTinymanPrice'

export const ChartDataContext = createContext(undefined)

export function ChartDataProvider({ children }) {
  const stagesEnum = {
    0: 'Total',
    1: 'Mainnet Stage 1',
    2: 'Mainnet Stage 2',
  }
  const now = new Date()
  const timeRangeEnum = {
    '1D': {
      value: '1D',
      epoch: Date.parse( // Using the same epoch for 1WK
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      ),
    },
    '1Wk': {
      value: '1Wk',
      epoch: Date.parse(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      ),
    },
    '3M': {
      value: '3M',
      epoch: Date.parse(
        new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
      ),
    },
    '1Y': {
      value: '1Y',
      epoch: Date.parse(
        new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      ),
    },
  }
  const [activeRange, setActiveRange] = useState(timeRangeEnum['1Y'].value)
  const [activeStage, setActiveStage] = useState(stagesEnum[0])
  const [activeCurrency, setActiveCurrency] = useState('ALGX')
  const [includeUnvested, setIncludeUnvested] = useState(false)
  const { conversionRate } = usePriceConversionHook({})
  const { activeWallet } = useRewardsAddresses()
  const { rewards, vestedRewards } = usePeriodsHook({ activeWallet })
  const [tinymanAssets, setTinymanAssets] = useState(null)

  useEffect(() => {
    const getAllAssets = async () => {
      const res = await getAssets()
      setTinymanAssets(res)
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

  const vestedChartData = useMemo(() => {
    const data = []
    if (vestedRewards.length > 0) {
      const rewardsCopy = [
        ...vestedRewards.filter(
          ({ value: { epoch, vestedUnixTime } }) =>
            withinStageData(epoch) && withinTimeRange(vestedUnixTime)
        ),
      ]

      rewardsCopy.sort((a, b) => a.value.epoch - b.value.epoch)
      rewardsCopy.forEach(({ value }) => {
        data.push({
          time: DateTime.fromJSDate(
            new Date(value.vestedUnixTime * 1000)
          ).toFormat('yyyy-LL-dd'),
          value: value.vestedRewards,
        })
      })

      return data
    } else {
      return dummyChartData
    }
  }, [vestedRewards, activeStage, activeRange])

  const earnedChartData = useMemo(() => {
    const data = []
    if (includeUnvested) {
      const rewardsCopy = [
        ...rewards.filter(
          ({ value: { epoch } }) =>
            withinStageData(epoch) && withinTimeRange(getEpochEnd(epoch))
        ),
      ]

      rewardsCopy.sort((a, b) => a.value.epoch - b.value.epoch)

      rewardsCopy.forEach(({ value }) => {
        data.push({
          time: DateTime.fromJSDate(
            new Date(getEpochEnd(value.epoch) * 1000)
          ).toFormat('yyyy-LL-dd'),
          value: value.earnedRewards,
        })
      })
    }
    return data
  }, [rewards, includeUnvested, activeStage, activeRange])

  const attachCurrency = (price) => {
    return `${
      activeCurrency === 'ALGX'
        ? price.toFixed(2)
        : (price * conversionRate).toFixed(2)
    } ${activeCurrency}`
  }

  const assetTableData = useMemo(() => {
    const rewardsCopy = includeUnvested
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

    const totalMaxRwd = rewardsCopy.find(
      ({ value: { epoch } }) =>
        epoch == Math.max(...rewardsCopy.map(({ value: { epoch } }) => epoch))
    )

    let totalDailyRwd = 0
    if (totalMaxRwd) {
      totalDailyRwd = includeUnvested
        ? totalMaxRwd.value.earnedRewards / 7
        : totalMaxRwd.value.vestedRewards / 7
    }
    const data = [
      {
        asset: 'All',
        EDRewards: attachCurrency(totalDailyRwd),
        total: attachCurrency(
          includeUnvested
            ? rewardsCopy.reduce((a, b) => a + b.value.earnedRewards, 0)
            : rewardsCopy.reduce((a, b) => a + b.value.vestedRewards, 0)
        ),
      },
    ]

    const assets = {}
    if (rewardsCopy.length > 0) {
      rewardsCopy.forEach(({ value }) => {
        if (assets[value.assetId]) {
          assets[value.assetId] = [...assets[value.assetId], value]
        } else {
          assets[value.assetId] = [value]
        }
      })
    }

    for (const assetId in assets) {
      const list = assets[assetId]
      const max = Math.max(...list.map(({ epoch }) => epoch))
      const maxRwd = list.find(({ epoch }) => epoch == max)
      let dailyRwd = 0
      if (maxRwd) {
        dailyRwd = includeUnvested
          ? maxRwd.earnedRewards / 7
          : maxRwd.vestedRewards / 7
      }
      data.push({
        asset: tinymanAssets[assetId].name,
        EDRewards: attachCurrency(dailyRwd),
        total: includeUnvested
          ? attachCurrency(list.reduce((a, b) => a + b.earnedRewards, 0))
          : attachCurrency(list.reduce((a, b) => a + b.vestedRewards, 0)),
      })
    }

    return data
  }, [
    rewards,
    vestedRewards,
    includeUnvested,
    activeCurrency,
    activeStage,
    activeRange,
  ])

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
        activeCurrency,
        setActiveCurrency,
        includeUnvested,
        setIncludeUnvested,
      }}
    >
      {children}
    </ChartDataContext.Provider>
  )
}
ChartDataProvider.propTypes = {
  children: PropTypes.node,
}
