import { useEffect, useState } from "react";
import axios from "axios";

interface Order {
  price: string;
  quantity: string;
}

export interface OrderBookData {
  bids: Order[];
  asks: Order[];
}

export const useDeepBookData = (pair: string) => {
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        const response = await axios.get(
          `https://deepbook-v3.sui.io/orderbook?pair=${encodeURIComponent(
            pair
          )}`
        );
        setOrderBook(response.data);
      } catch (err: any) {
        console.error("Error fetching order book:", err);
        setError(err.message || "Error fetching order book");
      }
    };

    fetchOrderBook();
    const intervalId = setInterval(fetchOrderBook, 10000);
    return () => clearInterval(intervalId);
  }, [pair]);

  return { orderBook, error };
};
