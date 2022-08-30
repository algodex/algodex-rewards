import { getRewardsData, getVestedRewardsData } from '@/lib/getRewards'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getEpochEnd, getEpochStart } from '@/lib/getRewards'
import { DateTime } from 'luxon'

export const usePeriodsHook = ({ activeWallet }) => {
  const [rewards, setRewards] = useState([])
  const [vestedRewards, setVestedRewards] = useState([])
  const [loading, setLoading] = useState(false)

  const dummyReward = [
    {
      id: 'aeddaefef414434de3',
      key: 'NN3BAWDPHEJAPIGO3IDB6I4ITGUMYG3QMN26ZYICXEZM3QRWISGXUK6J4Y',
      value: {
        algxAvg: 0,
        assetId: 230946361,
        depthSum: 1298.4046350579222,
        earnedRewards: 500,
        epoch: 3,
        qualityFinal: 8241412412,
        qualitySum: 15138621675447583000,
        uptime: 2843,
      },
    },
    {
      id: 'aeddaefe1442334de3',
      key: 'NN3BAWDPHEJAPIGO3IDB6I4ITGUMYG3QMN26ZYICXEZM3QRWISGXUK6J4Y',
      value: {
        algxAvg: 0,
        assetId: 230946361,
        depthSum: 1298.4046350579222,
        earnedRewards: 500,
        epoch: 29,
        qualityFinal: 8241412412,
        qualitySum: 15138621675447583000,
        uptime: 2843,
      },
    },
    {
      id: 'aeddaefe1442334de3',
      key: 'NN3BAWDPHEJAPIGO3IDB6I4ITGUMYG3QMN26ZYICXEZM3QRWISGXUK6J4Y',
      value: {
        algxAvg: 0,
        assetId: 230946361,
        depthSum: 1298.4046350579222,
        earnedRewards: 5000,
        epoch: 29,
        qualityFinal: 8241412412,
        qualitySum: 15138621675447583000,
        uptime: 2843,
      },
    },
    {
      id: 'aeddaefef44w43443de3',
      key: 'NN3BAWDPHEJAPIGO3IDB6I4ITGUMYG3QMN26ZYICXEZM3QRWISGXUK6J4Y',
      value: {
        algxAvg: 0,
        assetId: 386192725,
        depthSum: 1298.4046350579222,
        earnedRewards: 100,
        epoch: 4,
        qualityFinal: 8241412412,
        qualitySum: 15138621675447583000,
        uptime: 2843,
      },
    },
    {
      id: 'aeddaefef44434de3',
      key: 'NN3BAWDPHEJAPIGO3IDB6I4ITGUMYG3QMN26ZYICXEZM3QRWISGXUK6J4Y',
      value: {
        algxAvg: 0,
        assetId: 386195940,
        depthSum: 1298.4046350579222,
        earnedRewards: 20,
        epoch: 7,
        qualityFinal: 8241412412,
        qualitySum: 15138621675447583000,
        uptime: 2843,
      },
    },
    {
      id: 'aedadaefef443434de3',
      key: 'NN3BAWDPHEJAPIGO3IDB6I4ITGUMYG3QMN26ZYICXEZM3QRWISGXUK6J4Y',
      value: {
        algxAvg: 0,
        assetId: 386192725,
        depthSum: 1298.4046350579222,
        earnedRewards: 100,
        epoch: 2,
        qualityFinal: 8241412412,
        qualitySum: 15138621675447583000,
        uptime: 2843,
      },
    },
    {
      id: 'aedadaefef4434w34de3',
      key: 'NN3BAWDPHEJAPIGO3IDB6I4ITGUMYG3QMN26ZYICXEZM3QRWISGXUK6J4Y',
      value: {
        algxAvg: 0,
        assetId: 31566704,
        depthSum: 1298.4046350579222,
        earnedRewards: 200,
        epoch: 1,
        qualityFinal: 8241412412,
        qualitySum: 15138621675447583000,
        uptime: 2843,
      },
    },
    {
      id: 'aedadaefef443234w34de3',
      key: 'NN3BAWDPHEJAPIGO3IDB6I4ITGUMYG3QMN26ZYICXEZM3QRWISGXUK6J4Y',
      value: {
        algxAvg: 0,
        assetId: 386192725,
        depthSum: 1298.4046350579222,
        earnedRewards: 2000,
        epoch: 19,
        qualityFinal: 8241412412,
        qualitySum: 15138621675447583000,
        uptime: 2843,
      },
    },
    {
      id: 'aedadaefef4432234w34de3',
      key: 'NN3BAWDPHEJAPIGO3IDB6I4ITGUMYG3QMN26ZYICXEZM3QRWISGXUK6J4Y',
      value: {
        algxAvg: 0,
        assetId: 31566704,
        depthSum: 1298.4046350579222,
        earnedRewards: 2000,
        epoch: 28,
        qualityFinal: 8241412412,
        qualitySum: 15138621675447583000,
        uptime: 2843,
      },
    },
    {
      id: 'aedadaef22234w34de3',
      key: 'NN3BAWDPHEJAPIGO3IDB6I4ITGUMYG3QMN26ZYICXEZM3QRWISGXUK6J4Y',
      value: {
        algxAvg: 0,
        assetId: 31566704,
        depthSum: 1298.4046350579222,
        earnedRewards: 300,
        epoch: 30,
        qualityFinal: 8241412412,
        qualitySum: 15138621675447583000,
        uptime: 2843,
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
    {
      value: {
        _id: 'a73c6696ac4a6e897daa3f101a02c3cf',
        _rev: '2-1175a83b81ec74ebf467652df953e087',
        ownerWallet:
          'NN3BAWDPHEJAPIGO3IDB6I4ITGUMYG3QMN26ZYICXEZM3QRWISGXUK6J4Y',
        vestedRewards: 3500,
        epoch: 29,
        vestedUnixTime: 1661807421,
        assetId: 386192725,
      },
    },
  ]

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
        setRewards([...dummyReward, ...values[0].rows])
        setVestedRewards([...dummyVestedRewards, ...values[1].rows])
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
