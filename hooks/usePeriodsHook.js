import getRewardsData from '@/lib/getRewards'
import { useCallback, useEffect, useState } from 'react'

export const usePeriodsHook = ({ activeWallet }) => {
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchRewards = useCallback(
    async (wallet) => {
      setLoading(true)
      const rewards = await getRewardsData(wallet)
      setRewards(rewards.rows)
      setLoading(false)
    },
    [setRewards]
  )

  useEffect(() => {
    if (activeWallet) {
      fetchRewards(activeWallet?.address)
    }
  }, [activeWallet])

  return { loading, rewards }
}
