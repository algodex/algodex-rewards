import getRewardsData from '@/lib/getRewards'
import { useEffect, useState } from 'react'

export const usePeriodsHook = ({ activeWallet }) => {
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchRewards = async (wallet) => {
      setLoading(true)
      const rewards = await getRewardsData(wallet)
      setRewards(rewards.rows)
      setLoading(false)
    }
    if (activeWallet) {
      fetchRewards(activeWallet.address)
    }
  }, [activeWallet])
  return { loading, rewards }
}
