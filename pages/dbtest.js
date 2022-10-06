/* 
 * Algodex Rewards 
 * Copyright (C) 2022 Algodex VASP (BVI) Corp.
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { useEffect, useState } from 'react'
import getRewards from '../lib/getRewards'
import Container from '@mui/material/Container'

export default function TestPage() {
  // const { myAlgoConnect, peraConnect } = useWallets()
  const [rewards, setRewards] = useState('')
  useEffect(() => {
    const fetchRewards = async (wallet) => {
      const rewards = await getRewards(wallet)
      console.log({ rewards })
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
