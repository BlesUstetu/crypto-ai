import { useEffect, useRef } from "react"
import { createChart } from "lightweight-charts"

export default function TradingChart() {
  const ref = useRef()

  useEffect(() => {
    const chart = createChart(ref.current, {
      width: ref.current.clientWidth,
      height: 400,
    })

    const series = chart.addCandlestickSeries()

    series.setData([
      { time: "2024-01-01", open: 100, high: 120, low: 90, close: 110 },
      { time: "2024-01-02", open: 110, high: 130, low: 100, close: 125 },
    ])

    return () => chart.remove()
  }, [])

  return <div ref={ref} />
}
