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
  const {
    vestedChartData,
    earnedChartData,
    activeCurrency,
    setIncludeUnvested,
  } = context

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
          return '$' + price.toFixed(2)
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
          top: 0.3,
          bottom: 0.25,
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
              ? `$ ${(price * conversionRate).toFixed(2)}`
              : `ALGX ${price.toFixed(2)}`
          },
        },
      })
    } else {
      areaSeries.vested.setData(dummyChartData)
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

  useEffect(() => {
    if (isConnected && vestedChartData.length < 1) {
      setIncludeUnvested(true)
    }
  }, [isConnected])

  // Resize chart on container resizes.
  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      chart?.current?.applyOptions({ width, height })
      setTimeout(() => {
        chart?.current?.timeScale().fitContent()
      }, 0)
    })

    resizeObserver.current.observe(chartContainerRef.current)

    return () => resizeObserver.current.disconnect()
  }, [vestedChartData, earnedChartData])

  return (
    <>
      <div ref={chartContainerRef} className="chart-container" />
    </>
  )
}
