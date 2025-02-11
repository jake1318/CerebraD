import React from "react";
import TradingViewWidget from "react-tradingview-widget";

interface TradingViewChartProps {
  pair: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ pair }) => {
  // Convert pair to a symbol TradingView understands; adjust mapping as needed.
  const symbol = pair.replace("_", "");
  return (
    <div className="border p-2">
      <TradingViewWidget
        symbol={symbol}
        interval="60"
        timezone="Etc/UTC"
        theme="Light"
        style="1"
        locale="en"
        autosize
      />
    </div>
  );
};

export default TradingViewChart;
