import useWallets from '@/hooks/useWallets.js'
import { useEffect } from 'react'
import useRewardsAddresses from '@/hooks/useRewardsAddresses.js'

export default function TestPage() {
  const {addresses} = useRewardsAddresses()
  const { myAlgoConnect, peraConnect } = useWallets()
  useEffect(() => {
    console.log(peraConnect)
  }, [])
  return (
    <>
      <button onClick={myAlgoConnect}>MyAlgo</button>
      <button
        onClick={() => {
          peraConnect()
        }}
      >
        Pera
      </button>
      {addresses.map((addr, index) => {
        return <div key={index}>Hello {addr.name} {addr.address}</div>
      })}
    </>
  )
}
