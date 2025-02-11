// src/components/TradingViewChart.tsx
import React, { useEffect, useRef } from "react";
import { createChart, IChartApi } from "lightweight-charts";

const TradingViewChart: React.FC = () => {
  // Ref to hold the container div where the chart will be rendered
  const chartContainerRef = useRef<HTMLDivElement>(null);
  // Ref to store the chart instance for later cleanup
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create the chart in the container with desired options
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        backgroundColor: "#ffffff",
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" },
      },
      // Add any additional options as needed
    });

    // Add a line series to the chart
    const lineSeries = chartRef.current.addLineSeries({
      color: "#2196F3",
      lineWidth: 2,
    });

    // Set some sample data for the line series
    lineSeries.setData([
      { time: "2022-01-01", value: 80.01 },
      { time: "2022-01-02", value: 96.63 },
      { time: "2022-01-03", value: 76.64 },
      { time: "2022-01-04", value: 81.89 },
      { time: "2022-01-05", value: 74.43 },
    ]);

    // Adjust the chart width on window resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "300px" }} />
  );
};

export default TradingViewChart;
