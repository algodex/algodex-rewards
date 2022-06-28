import { dummyChartData } from 'lib/dummyChartData'
import React, { useEffect, useRef } from 'react'

export default function AreaChart() {
  const chartContainerRef = useRef()
  const chart = useRef()
  const resizeObserver = useRef()

  const initializeChart = async () => {
    const { createChart, CrosshairMode } = await import('lightweight-charts')
    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
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

    const areaSeries = chart.current.addAreaSeries({
      topColor: 'rgba(38,198,218, 0.56)',
      bottomColor: 'rgba(38,198,218, 0.04)',
      lineColor: 'rgba(38,198,218, 1)',
      lineWidth: 2,
    })

    areaSeries.setData(dummyChartData)
  }

  useEffect(() => {
    initializeChart()
  }, [])

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
  }, [])

  return (
    <>
      <div ref={chartContainerRef} className="chart-container" />
    </>
  )
}
