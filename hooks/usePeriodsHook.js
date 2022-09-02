import { getRewardsData, getVestedRewardsData } from '@/lib/getRewards'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getEpochEnd, getEpochStart } from '@/lib/getRewards'
import { DateTime } from 'luxon'
import { getAssets } from '@/lib/getTinymanPrice'
import { dummyReward, dummyVestedRewards } from '@/lib/dummyChartData'

export const usePeriodsHook = ({ activeWallet, isMobile }) => {
  const [rewards, setRewards] = useState([])
  const [vestedRewards, setVestedRewards] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeEpoch, setActiveEpoch] = useState(0)
  const [mobileAssets, setMobileAssets] = useState(false)
  const [tinymanAssets, setTinymanAssets] = useState({})
  const [periodAssets, setPeriodAssets] = useState([])

  useEffect(() => {
    const getAllAssets = async () => {
      const res = await getAssets()
      setTinymanAssets(res)
    }
    getAllAssets()
  }, [])

  const pendingPeriod = useMemo(() => {
    const curr_unix = Math.floor(Date.now() / 1000)
    const epoch = (curr_unix - getEpochStart(1)) / 604800 + 1

    const start = DateTime.fromJSDate(
      new Date(getEpochStart(epoch) * 1000)
    ).toLocaleString(DateTime.DATE_MED)

    const end = DateTime.fromJSDate(
      new Date(getEpochEnd(epoch) * 1000)
    ).toLocaleString(DateTime.DATE_MED)

    return {
      date: `${start} - ${end}`,
      number: epoch.toFixed(0),
    }
  }, [])

  const fetchRewards = useCallback(
    async (wallet) => {
      setLoading(true)
      const _rewards = new Promise((resolve) => {
        resolve(getRewardsData(wallet))
      })
      const _vestedRewards = new Promise((resolve) => {
        resolve(getVestedRewardsData(wallet))
      })
      await Promise.all([_rewards, _vestedRewards])
        .then((values) => {
          setLoading(false)
          setRewards(values[0].rows)
          setVestedRewards(values[1].rows)
          setActiveEpoch(
            isMobile
              ? 0
              : Math.max(...values[0].rows.map(({ value: { epoch } }) => epoch))
          )
        })
        .catch((err) => {
          setLoading(false)
          console.error(err)
          //TODO: This dummy data should be removed after production launch
          // setRewards(dummyReward)
          // setVestedRewards(dummyVestedRewards)
        })
    },
    [isMobile]
  )

  const getAssetsByEpoch = useCallback(
    async (_epoch) => {
      setActiveEpoch(_epoch)
      const rewardsCopy = rewards.filter(
        ({ value: { epoch } }) => epoch == _epoch
      )
      const data = []
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
        const now = new Date()
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
        const lastWkRwds = x.reduce((a, b) => a + b.earnedRewards, 0)

        data.push({
          assetId,
          lastWeek: lastWkRwds.toFixed(2),
          depthSum: list.reduce((a, b) => a + b.depthSum, 0) / 10080,
          assetName: tinymanAssets[assetId]?.unit_name || '??',
          assetLogo:
            tinymanAssets[assetId]?.logo?.svg ||
            'https://asa-list.tinyman.org/assets/??',
        })
      }
      setPeriodAssets(data)
      setMobileAssets(isMobile ? true : false)
    },
    [isMobile, rewards, tinymanAssets]
  )

  const completedPeriod = useMemo(() => {
    if (rewards.length > 0) {
      const list = rewards.concat(vestedRewards)
      const maxEpoch = Math.max(
        ...rewards.map(({ value: { epoch } }) => epoch)
      )
      const selected = list.filter(
        ({ value: { epoch } }) => epoch === activeEpoch
      )
      const start = DateTime.fromJSDate(
        new Date(
          getEpochStart(activeEpoch === 0 ? maxEpoch : activeEpoch) * 1000
        )
      ).toLocaleString(DateTime.DATE_MED)

      const end = DateTime.fromJSDate(
        new Date(getEpochEnd(activeEpoch === 0 ? maxEpoch : activeEpoch) * 1000)
      ).toLocaleString(DateTime.DATE_MED)

      const vestedUnixTime = vestedRewards.find(
        ({ value: { epoch } }) => epoch == activeEpoch
      )?.value?.vestedUnixTime

      const vestedDate = vestedUnixTime
        ? DateTime.fromJSDate(new Date(vestedUnixTime * 1000)).toLocaleString(
          DateTime.DATE_MED
        )
        : null

      return {
        date: `${start} - ${end}`,
        number: (activeEpoch === 0 ? maxEpoch : activeEpoch).toFixed(0),
        earnedRewards: selected.reduce(
          (a, b) => a + (b.value.earnedRewards || 0),
          0
        ),
        vestedRewards: selected.reduce(
          (a, b) => a + (b.value.vestedRewards || 0),
          0
        ),
        vestedDate,
      }
    } else {
      return {
        date: '---',
        number: 0,
      }
    }
  }, [rewards, activeEpoch])

  useEffect(() => {
    if (activeWallet) {
      setPeriodAssets([])
      fetchRewards(activeWallet?.address)
    }
  }, [activeWallet?.address])

  useEffect(() => {
    if (activeEpoch) {
      getAssetsByEpoch(activeEpoch)
    }
  }, [activeEpoch])

  return {
    loading,
    rewards,
    vestedRewards,
    pendingPeriod,
    mobileAssets,
    activeEpoch,
    setActiveEpoch,
    periodAssets,
    setMobileAssets,
    completedPeriod,
  }
}
