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
import { getAlgoExplorerAssets, getAssets } from '@/lib/getTinymanPrice'
import { getEpochStart } from '../lib/getRewards'

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
  const { rewards, vestedRewards } = usePeriodsHook({ activeWallet })
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
        console.error('tinymanAsset error', error)
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

  const attachCurrency = (price) => {
    return `${
      activeCurrency === 'ALGX'
        ? price.toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        })
        : (price * conversionRate).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
    } ${activeCurrency}`
  }

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
    // eslint-disable-next-line max-len
    // If includeUnvested and earnedRewards has no data for the current filter, replace with vestedRewards data
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
        EDRewards: attachCurrency(estDailyRwd),
        total: attachCurrency(
          _includeUnvested
            ? rewardsCopy.reduce(
              (a, b) => a + b.value.earnedRewardsFormatted,
              0
            )
            : rewardsCopy.reduce(
              (a, b) => a + b.value.formattedVestedRewards,
              0
            )
        ),
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
    // console.log(assets)
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
            [`${accrualAssetId}`]: { unit_name: assetInfo['unit-name'] },
          }))

          data.push({
            asset: assetInfo?.['unit-name'] || '??',
            EDRewards: attachCurrency(dailyRwd),
            total: _includeUnvested
              ? attachCurrency(
                list.reduce((a, b) => a + b.earnedRewardsFormatted, 0)
              )
              : attachCurrency(
                list.reduce((a, b) => a + b.formattedVestedRewards, 0)
              ),
          })
        } catch (e) {
          console.error(e)
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

  const earnedAssetData = useMemo(() => {
    const rewardsCopy = [...rewards]
    const data = []
    const assets = {}

    if (rewardsCopy.length > 0) {
      rewardsCopy.forEach(({ value }) => {
        if (assets[value.accrualAssetId]) {
          assets[value.accrualAssetId] = [
            ...assets[value.accrualAssetId],
            value,
          ]
        } else {
          assets[value.accrualAssetId] = [value]
        }
      })
    }

    for (const accrualAssetId in assets) {
      const list = assets[accrualAssetId]
      const lastWkUnixStart = Math.floor(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7) / 1000
      )
      const lastWkEpochStart =
        (lastWkUnixStart - getEpochStart(1)) / 604800 + 1

      const lastWkUnixEnd = Math.floor(Date.now() / 1000)
      const lastWkEpochEnd = (lastWkUnixEnd - getEpochStart(1)) / 604800 + 1

      //Filter out all rewards within last weeks' epoch
      const x = list.filter(
        ({ epoch }) =>
          epoch >= lastWkEpochStart.toFixed(0) &&
          epoch <= lastWkEpochEnd.toFixed(0)
      )
      const lastWkRwds = x.reduce((a, b) => a + b.earnedRewardsFormatted, 0)
      data.push({
        accrualAssetId,
        lastWeek: lastWkRwds.toFixed(2),
        depthSum: list.reduce((a, b) => a + b.depthSum, 0) / 10080,
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
        earnedAssetData,
        activeCurrency,
        setActiveCurrency,
        includeUnvested,
        setIncludeUnvested,
        selected,
        setSelected,
      }}
    >
      {children}
    </ChartDataContext.Provider>
  )
}
ChartDataProvider.propTypes = {
  children: PropTypes.node,
}
