import { useEffect, useState } from 'react'
import getRewards from '../lib/getRewards'
import Container from '@mui/material/Container'

export default function TestPage() {
  // const { myAlgoConnect, peraConnect } = useWallets()
  const [rewards, setRewards] = useState('')
  useEffect(() => {
    const fetchRewards = async (wallet) => {
      const rewards = await getRewards(wallet)
      setRewards(JSON.stringify(rewards))
    }
    fetchRewards('KJMDX5PTKZCK3DMQXQ6JYSIDLVZOK5WX6FHGF7ZWPN2ROILIMO6GNBZLHA')
  }, [])
  return (
    <>
      <Container sx={{ paddingInline: '2rem', color: 'white' }}>
        Rewards JSON:
        {rewards}
      </Container>
    </>
  )
}
