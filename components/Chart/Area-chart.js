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

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { dummyChartData } from '@/lib/dummyChartData'

//Context
import { ChartDataContext } from 'context/chartContext'
import { usePriceConversionHook } from '@/hooks/usePriceConversionHook'

export default function AreaChart({ isConnected }) {
  const { conversionRate } = usePriceConversionHook({})
  const [areaSeries, setAreaSeries] = useState()
  const context = useContext(ChartDataContext)
  if (context === undefined) {
    throw new Error('Must be inside of a Chart Provider')
  }
  const { vestedChartData, earnedChartData, activeCurrency } = context

  const chartContainerRef = useRef()
  const chart = useRef()
  const resizeObserver = useRef()

  const initializeChart = async () => {
    const { createChart, CrosshairMode } = await import('lightweight-charts')
    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 350,
      localization: {
        priceFormatter: (price) => {
          return '$' + price.toLocaleString()
        },
      },
      layout: {
        backgroundColor: 'transparent',
        textColor: '#d1d4dc',
        // fontFamily: 'Inter',
      },
      grid: {
        vertLines: {
          color: '#334158',
        },
        horzLines: {
          color: '#334158',
        },
      },
      leftPriceScale: {
        visible: true,
      },
      rightPriceScale: {
        visible: false,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      priceScale: {
        borderColor: '#485c7b',
        scaleMargins: {
          top: 0.1,
          bottom: 0.05,
        },
        borderVisible: true,
      },
      timeScale: {
        borderColor: '#485c7b',
      },
    })
    const vested = chart.current.addAreaSeries({
      topColor: 'rgba(38,198,218, 0.56)',
      bottomColor: 'rgba(38,198,218, 0.04)',
      lineColor: 'rgba(38,198,218, 1)',
      lineWidth: 2,
    })
    const earned = chart.current.addAreaSeries({
      topColor: 'rgba(67, 83, 254, 0.7)',
      bottomColor: 'rgba(67, 83, 254, 0.3)',
      lineColor: 'rgba(67, 83, 254, 1)',
      lineWidth: 2,
    })
    setAreaSeries({ vested, earned })
  }

  useEffect(() => {
    initializeChart()
  }, [])

  const updateChart = useCallback(async () => {
    if (isConnected) {
      areaSeries.vested.setData(vestedChartData)
      areaSeries.earned.setData(earnedChartData)
      chart.current.applyOptions({
        localization: {
          priceFormatter: (price) => {
            return activeCurrency == 'USD'
              ? `$ ${(price * conversionRate).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
              : `ALGX ${price.toLocaleString()}`
          },
        },
      })
    } else {
      setTimeout(() => {
        areaSeries.vested.setData(dummyChartData)
      }, 2000)
    }
  }, [
    vestedChartData,
    earnedChartData,
    activeCurrency,
    areaSeries,
    conversionRate,
    isConnected,
  ])

  useEffect(() => {
    if (areaSeries) {
      updateChart()
    }
  }, [
    vestedChartData,
    earnedChartData,
    activeCurrency,
    areaSeries,
    isConnected,
  ])

  // Resize chart on container resizes.
  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      chart?.current?.applyOptions({ width, height })
      chart?.current?.timeScale().fitContent()
      // setTimeout(() => {
      //   chart?.current?.timeScale().fitContent()
      // }, 0)
    })

    resizeObserver.current.observe(chartContainerRef.current)

    return () => resizeObserver.current.disconnect()
  }, [vestedChartData, earnedChartData])

  return (
    <>
      <div ref={chartContainerRef} className="chart-container" data-testid={'chart'} />
    </>
  )
}
