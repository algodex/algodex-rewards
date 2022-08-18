import { getRewardsData, getVestedRewardsData } from '@/lib/getRewards'
import { useCallback, useEffect, useState } from 'react'

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

  const fetchRewards = useCallback(
    async (wallet) => {
      setLoading(true)
      try {
        const rewards = await getRewardsData(wallet)
        const vestedRewards = await getVestedRewardsData(wallet)
        setRewards(rewards.rows)
        setVestedRewards(vestedRewards.rows)
        setLoading(false)
      } catch (error) {
        //TODO: This should be removed after production launch
        setRewards(dummyReward)
        setVestedRewards(dummyVestedRewards)
        setLoading(false)
      }
    },
    [setRewards]
  )

  useEffect(() => {
    if (activeWallet) {
      fetchRewards(activeWallet?.address)
    }
  }, [activeWallet])

  return { loading, rewards, vestedRewards }
}
