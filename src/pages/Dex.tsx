import React, { useState } from "react";
import TradingViewChart from "../components/TradingViewChart";
import OrderEntryForm from "../components/OrderEntryForm";
import { useDeepBookData } from "../hooks/useDeepBookData";

const Dex: React.FC = () => {
  // Default trading pair, e.g., "SUI_USDC"
  const [pair, setPair] = useState<string>("SUI_USDC");
  const { orderBook, error } = useDeepBookData(pair);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">DeepBook DEX – {pair}</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <TradingViewChart pair={pair} />
        </div>
        <div>
          <OrderEntryForm pair={pair} />
        </div>
      </div>
      <div className="mt-8">
        <h3 className="font-semibold">Order Book (Top 20)</h3>
        {orderBook ? (
          <div className="flex justify-between mt-4">
            <div className="w-1/2">
              <h4 className="font-bold">Bids</h4>
              <ul>
                {orderBook.bids.slice(0, 20).map((bid, index) => (
                  <li key={index}>
                    Price: {bid.price} - Qty: {bid.quantity}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-1/2">
              <h4 className="font-bold">Asks</h4>
              <ul>
                {orderBook.asks.slice(0, 20).map((ask, index) => (
                  <li key={index}>
                    Price: {ask.price} - Qty: {ask.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>Loading order book...</p>
        )}
      </div>
    </div>
  );
};

export default Dex;
