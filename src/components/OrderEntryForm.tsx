import React, { useState } from "react";
import axios from "axios";

type OrderType = "market" | "limit" | "stop-loss" | "take-profit";

interface OrderEntryFormProps {
  pair: string;
}

const OrderEntryForm: React.FC<OrderEntryFormProps> = ({ pair }) => {
  const [orderType, setOrderType] = useState<OrderType>("market");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [triggerPrice, setTriggerPrice] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string>("");

  const handlePlaceOrder = async () => {
    setOrderStatus("Placing order...");
    try {
      const payload = {
        pair,
        side,
        orderType,
        quantity,
        price: price || null,
        triggerPrice: triggerPrice || null,
      };
      const response = await axios.post("/api/deepbook/order", payload);
      if (response.data.error) {
        setOrderStatus(`Order failed: ${response.data.error}`);
      } else {
        setOrderStatus("Order placed successfully!");
      }
    } catch (err: any) {
      console.error("Error placing order:", err);
      setOrderStatus(`Order error: ${err.message || err.toString()}`);
    }
  };

  return (
    <div className="border p-4">
      <h3 className="font-bold mb-2">Place Order</h3>
      <div className="mb-2">
        <label className="block">Order Type:</label>
        <select
          value={orderType}
          onChange={(e) => setOrderType(e.target.value as OrderType)}
          className="border p-2 w-full"
        >
          <option value="market">Market</option>
          <option value="limit">Limit</option>
          <option value="stop-loss">Stop-Loss</option>
          <option value="take-profit">Take-Profit</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block">Side:</label>
        <select
          value={side}
          onChange={(e) => setSide(e.target.value as "buy" | "sell")}
          className="border p-2 w-full"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>
      {(orderType === "limit" ||
        orderType === "stop-loss" ||
        orderType === "take-profit") && (
        <div className="mb-2">
          <label className="block">Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            className="border p-2 w-full"
          />
        </div>
      )}
      {(orderType === "stop-loss" || orderType === "take-profit") && (
        <div className="mb-2">
          <label className="block">Trigger Price:</label>
          <input
            type="number"
            value={triggerPrice}
            onChange={(e) => setTriggerPrice(e.target.value)}
            placeholder="Enter trigger price"
            className="border p-2 w-full"
          />
        </div>
      )}
      <div className="mb-2">
        <label className="block">Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
          className="border p-2 w-full"
        />
      </div>
      <button
        onClick={handlePlaceOrder}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Place Order
      </button>
      {orderStatus && <p className="mt-2">{orderStatus}</p>}
    </div>
  );
};

export default OrderEntryForm;
