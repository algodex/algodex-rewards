/* 
 * Algodex Rewards 
 * Copyright (C) 2021-2022 Algodex VASP (BVI) Corp.
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

import axios from 'axios'


export const getRewardsData = async (wallet) => {
  if (wallet) {
    const baseUrl = '/rewards'
    const res = await axios({
      method: 'get',
      url: `${baseUrl}/accumulated/wallet/${wallet}`,
      timeout: 3000,
    })
    return {rows: res.data}
  } else {
    throw new TypeError(
      'You cannot get rewards with an invalid address'
    )
  }
}

export const getVestedRewardsData = async (wallet) => {
  if (wallet) {
    const baseUrl = '/rewards'
    const res = await axios({
      method: 'get',
      url: `${baseUrl}/vested/wallet/${wallet}`,
      timeout: 3000,
    })
    return {rows: res.data}
  } else {
    throw new TypeError(
      'You cannot get vested rewards with an invalid address'
    )
  }
}

const getSecondsInEpoch = () => {
  return 604800
}

export const getEpochStart = (epoch) => {
  const start = parseInt(process.env.NEXT_PUBLIC_EPOCH_LAUNCH_UNIX_TIME)
  return start + getSecondsInEpoch() * (epoch - 1)
}

export const getEpochEnd = (epoch) => {
  return getEpochStart(epoch) + getSecondsInEpoch()
}

export const CheckOptinStatus = async (wallet) => {
  const baseUrl = '/rewards'
  const res = await axios({
    method: 'get',
    url: `${baseUrl}/optin/${wallet}`,
    timeout: 3000,
  })
  return res
}

export const getAccruingStatus = async (wallet) => {
  const baseUrl = '/rewards'
  const res = await axios({
    method: 'get',
    url: `${baseUrl}/is_accruing/${wallet}`,
    timeout: 3000,
  })
  return res
}

export const checkIfRecorded = async (period) => {
  const baseUrl = '/rewards'
  const res = await axios({
    method: 'get',
    url: `${baseUrl}/is_recorded/period/${period}`,
    timeout: 3000,
  })
  return res
}
