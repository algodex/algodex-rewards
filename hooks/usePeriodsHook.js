import { getRewardsData, getVestedRewardsData } from '@/lib/getRewards'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getEpochEnd, getEpochStart } from '@/lib/getRewards'
import { DateTime } from 'luxon'

export const usePeriodsHook = ({ activeWallet }) => {
  const [rewards, setRewards] = useState([])
  const [vestedRewards, setVestedRewards] = useState([])
  const [loading, setLoading] = useState(false)

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

  const fetchRewards = useCallback(async (wallet) => {
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
      })
      .catch((err) => {
        setLoading(false)
        console.error(err)
        //TODO: This dummy data should be removed after production launch
        // setRewards(dummyReward)
        // setVestedRewards(dummyVestedRewards)
      })
  }, [])

  useEffect(() => {
    if (activeWallet) {
      fetchRewards(activeWallet?.address)
    }
  }, [activeWallet?.address])

  return { loading, rewards, vestedRewards, pendingPeriod }
}
