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

import { getRewardsData, getVestedRewardsData } from '@/lib/getRewards'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getEpochEnd, getEpochStart } from '@/lib/getRewards'
import { DateTime } from 'luxon'
import { getAssets } from '@/lib/getAlgoAssets'
import { getAccruingStatus } from '../lib/getRewards'
import { dummyReward, dummyVestedRewards } from '@/lib/dummyChartData'

export const usePeriodsHook = ({ activeWallet, isMobile }) => {
  const [rewards, setRewards] = useState([])
  const [vestedRewards, setVestedRewards] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeEpoch, setActiveEpoch] = useState(0)
  const [mobileAssets, setMobileAssets] = useState(false)
  const [tinymanAssets, setTinymanAssets] = useState({})
  const [periodAssets, setPeriodAssets] = useState([])
  const [currentlyEarning, setCurrentlyEarning] = useState({})

  useEffect(() => {
    const getAllAssets = async () => {
      try {
        const res = await getAssets()
        setTinymanAssets(res)
      } catch (error) {
        console.error('tinymanAsset error', error)
        getAllAssets()
      }
    }
    getAllAssets()
  }, [])

  const pendingPeriod = useMemo(() => {
    const curr_unix = Math.floor(new Date().getTime() / 1000)
    const epoch = Math.floor((curr_unix - getEpochStart(1)) / 604800 + 1)
    const UTC = DateTime.fromJSDate(new Date()).offsetNameShort
    const start = DateTime.fromJSDate(
      new Date(getEpochStart(epoch) * 1000)
    ).toLocaleString(DateTime.DATETIME_MED)

    const end = DateTime.fromJSDate(
      new Date(getEpochEnd(epoch) * 1000)
    ).toLocaleString(DateTime.DATETIME_MED)

    return {
      date: `${start} - ${end} ${UTC}`,
      number: epoch,
    }
  }, [])

  const fetchRewards = useCallback(
    async (wallet) => {
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
          if (typeof window.end2end !== 'undefined') {
            setRewards(dummyReward)
            setVestedRewards(dummyVestedRewards)
            setActiveEpoch(
              isMobile
                ? 0
                : Math.max(...dummyReward.map(({ value: { epoch } }) => epoch))
            )
          } else {
            setRewards(values[0].rows)
            setVestedRewards(values[1].rows)
            setActiveEpoch(
              isMobile
                ? 0
                : Math.max(
                  ...values[0].rows.map(({ value: { epoch } }) => epoch)
                )
            )
          }
        })
        .catch(() => {
          setLoading(false)
        })
    },
    [isMobile]
  )

  const getAssetsByEpoch = async (_epoch) => {
    setActiveEpoch(_epoch)
    const rewardsCopy = rewards.filter(
      ({ value: { epoch } }) => epoch == _epoch
    )
    const data = []
    const assets = {}
    if (rewardsCopy.length > 0) {
      rewardsCopy.forEach(({ value }) => {
        if (assets[value.accrualAssetId]) {
          assets[value.accrualAssetId] = [
            ...assets[value.accrualAssetId],
            value,
          ]
        } else {
          assets[value.accrualAssetId] = [value]
        }
      })
    }
    for (const accrualAssetId in assets) {
      const list = assets[accrualAssetId]
      // console.log(list)
      data.push({
        accrualAssetId,
        earnedRewards: list.reduce((a, b) => a + b.earnedRewardsFormatted, 0),
        algoTotalDepth:
          list.reduce((a, b) => a + b.algoTotalDepth, 0) /
          (10080 * list.length),
        asaTotalDepth:
          list.reduce((a, b) => a + b.asaTotalDepth, 0) / (10080 * list.length),
        assetName: tinymanAssets[accrualAssetId]?.unit_name || '??',
        assetLogo:
          tinymanAssets[accrualAssetId]?.logo?.svg ||
          'https://asa-list.tinyman.org/assets/??',
        transactionId: vestedRewards.find(
          ({ value }) =>
            value.transactionId != null &&
            parseInt(accrualAssetId) === value.accrualAssetId
        )?.value?.transactionId,
      })
    }
    setPeriodAssets(data)
    setMobileAssets(isMobile ? true : false)
  }

  const completedPeriod = useMemo(() => {
    if (rewards.length > 0) {
      const list = rewards.concat(vestedRewards)
      const maxEpoch = Math.max(
        ...rewards.map(({ value: { epoch } }) => epoch)
      )
      const selected = list.filter(
        ({ value: { epoch } }) => epoch === activeEpoch
      )
      const start = DateTime.fromJSDate(
        new Date(
          getEpochStart(activeEpoch === 0 ? maxEpoch : activeEpoch) * 1000
        )
      ).toLocaleString(DateTime.DATETIME_MED)

      const end = DateTime.fromJSDate(
        new Date(getEpochEnd(activeEpoch === 0 ? maxEpoch : activeEpoch) * 1000)
      ).toLocaleString(DateTime.DATETIME_MED)

      const vestedUnixTime = vestedRewards.find(
        ({ value: { epoch } }) => epoch == activeEpoch
      )?.value?.vestedUnixTime

      const vestedDate = vestedUnixTime
        ? DateTime.fromJSDate(new Date(vestedUnixTime * 1000)).toLocaleString(
          DateTime.DATETIME_MED
        )
        : null
      return {
        date: `${start} - ${end}`,
        number: (activeEpoch === 0 ? maxEpoch : activeEpoch).toFixed(0),
        earnedRewards: selected.reduce(
          (a, b) => a + (b.value.earnedRewardsFormatted || 0),
          0
        ),
        vestedRewards: selected.reduce(
          (a, b) => a + (b.value.formattedVestedRewards || 0),
          0
        ),
        vestedDate,
      }
    } else {
      return {
        date: '---',
        number: 0,
      }
    }
  }, [rewards, activeEpoch, vestedRewards])

  useEffect(() => {
    if (activeWallet?.address) {
      const getStatus = async () => {
        try {
          const res = await getAccruingStatus(activeWallet.address)
          setCurrentlyEarning(res.data)
        } catch (error) {
          // console.error(error)
        }
      }
      getStatus()
    }
  }, [activeWallet])

  useEffect(() => {
    if (activeWallet) {
      setPeriodAssets([])
      fetchRewards(activeWallet?.address)
    }
  }, [activeWallet])

  useEffect(() => {
    if (activeEpoch) {
      getAssetsByEpoch(activeEpoch)
    }
  }, [activeEpoch])

  return {
    loading,
    rewards,
    vestedRewards,
    pendingPeriod,
    mobileAssets,
    activeEpoch,
    setActiveEpoch,
    periodAssets,
    setMobileAssets,
    completedPeriod,
    currentlyEarning,
  }
}
