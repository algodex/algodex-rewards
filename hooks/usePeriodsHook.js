import { getRewardsData, getVestedRewardsData } from '@/lib/getRewards'
import { useCallback, useEffect, useState } from 'react'
import { getEpochEnd, getEpochStart } from '@/lib/getRewards'
import { DateTime } from 'luxon'

export const usePeriodsHook = ({ activeWallet }) => {
  const [rewards, setRewards] = useState([])
  const [vestedRewards, setVestedRewards] = useState([])
  const [loading, setLoading] = useState(false)

  const dummyReward = [
    {
      value: {
        _id: 'da42b5aa00230629bb6b9175a302c4dc',
        _rev: '5-278b8ed0e08a7edbeb6724d2964ae872',
        ownerWallet:
          'NN3BAWDPHEJAPIGO3IDB6I4ITGUMYG3QMN26ZYICXEZM3QRWISGXUK6J4Y',
        uptime: 2845,
        depthSum: 1598.4046350579222,
        qualitySum: 25138621675447583000,
        algxAvg: 0,
        qualityFinal: 8.544528521298251e27,
        earnedRewards: 3500,
        epoch: 1,
        assetId: 386192725,
      },
    },
  ]

  const dummyVestedRewards = [
    {
      value: {
        _id: 'a73c6696ac4a6e897daa3f101a02c3cf',
        _rev: '2-1175a83b81ec74ebf467652df953e087',
        ownerWallet:
          'NN3BAWDPHEJAPIGO3IDB6I4ITGUMYG3QMN26ZYICXEZM3QRWISGXUK6J4Y',
        vestedRewards: 3500,
        epoch: 1,
        vestedUnixTime: 1658439940,
        assetId: 386192725,
      },
    },
  ]

  const pendingPeriod = () => {
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
  }

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
        console.debug(err)
        //TODO: This dummy data should be removed after production launch
        setRewards(dummyReward)
        setVestedRewards(dummyVestedRewards)
      })
  }, [])

  useEffect(() => {
    if (activeWallet) {
      fetchRewards(activeWallet?.address)
    }
  }, [activeWallet?.address])

  return { loading, rewards, vestedRewards, pendingPeriod }
}
