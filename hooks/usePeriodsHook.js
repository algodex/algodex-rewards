import { getRewardsData, getVestedRewardsData } from '@/lib/getRewards'
import { useCallback, useEffect, useState } from 'react'

export const usePeriodsHook = ({ activeWallet }) => {
  const [rewards, setRewards] = useState([])
  const [vestedRewards, setVestedRewards] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchRewards = useCallback(
    async (wallet) => {
      setLoading(true)
      const rewards = await getRewardsData(wallet)
      const vestedRewards = await getVestedRewardsData(wallet)
      setRewards(rewards.rows)
      setVestedRewards(vestedRewards.rows)
      setLoading(false)
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
