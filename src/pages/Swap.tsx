import React, { useEffect, useState } from "react";
import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { getRoute, swapPTB } from "navi-aggregator-sdk";

const COIN_TYPE_MAP: Record<string, string> = {
  SUI: "0x2::sui::SUI",
  USDC: "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
};

const Swap: React.FC = () => {
  const [fromToken, setFromToken] = useState<string>("SUI");
  const [toToken, setToToken] = useState<string>("USDC");
  const [amount, setAmount] = useState<string>("");
  const [slippage, setSlippage] = useState<number>(0.5);
  const [quoteOut, setQuoteOut] = useState<string>("");
  const [txStatus, setTxStatus] = useState<string>("");

  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction, isLoading } =
    useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  useEffect(() => {
    const fetchQuote = async () => {
      if (!amount) {
        setQuoteOut("");
        return;
      }
      try {
        const response = await fetch(
          `/api/quote?from=${encodeURIComponent(
            COIN_TYPE_MAP[fromToken]
          )}&target=${encodeURIComponent(
            COIN_TYPE_MAP[toToken]
          )}&amount=${amount}`
        );
        const data = await response.json();
        if (data.error) {
          setQuoteOut("Error fetching quote");
        } else {
          setQuoteOut(data.data.amount_out.toString());
        }
      } catch (err) {
        console.error("Error fetching quote:", err);
        setQuoteOut("Error");
      }
    };
    fetchQuote();
  }, [fromToken, toToken, amount]);

  const fetchCoinObject = async (): Promise<string> => {
    if (!currentAccount) {
      throw new Error("Wallet not connected");
    }
    const coinsResponse = await suiClient.getCoins({
      owner: currentAccount.address,
      coinType: COIN_TYPE_MAP[fromToken],
    });
    if (!coinsResponse.data?.coins || coinsResponse.data.coins.length === 0) {
      throw new Error("No coins available for the selected token");
    }
    return coinsResponse.data.coins[0].coinObjectId;
  };

  const handleSwap = async () => {
    if (!currentAccount) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!amount || BigInt(amount) === BigInt(0)) {
      alert("Please enter a valid amount.");
      return;
    }
    setTxStatus("Preparing transaction...");
    try {
      const userAddress = currentAccount.address;
      const amountIn = BigInt(amount);
      const quote = await getRoute(
        COIN_TYPE_MAP[fromToken],
        COIN_TYPE_MAP[toToken],
        amountIn
      );
      const expectedOut = BigInt(quote.amount_out);
      const slippageTolerance = slippage / 100;
      const minOut =
        expectedOut -
        (expectedOut * BigInt(Math.floor(slippageTolerance * 100))) /
          BigInt(100);

      const coinObjectId = await fetchCoinObject();
      const tx = new Transaction();
      await swapPTB(
        userAddress,
        tx,
        COIN_TYPE_MAP[fromToken],
        COIN_TYPE_MAP[toToken],
        tx.pure(coinObjectId),
        amountIn,
        Number(minOut)
      );

      setTxStatus("Signing and executing transaction...");
      signAndExecuteTransaction(
        { transactionBlock: tx, chain: "sui:mainnet" },
        {
          onSuccess: (result) => {
            console.log("Swap executed successfully:", result);
            setTxStatus(
              `✅ Swap complete! Transaction digest: ${result.digest}`
            );
          },
          onError: (error: any) => {
            console.error("Transaction error:", error);
            setTxStatus(`❌ Swap failed: ${error.message || error}`);
          },
        }
      );
    } catch (err: any) {
      console.error("Swap error:", err);
      setTxStatus(`❌ Error: ${err.message || err.toString()}`);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Token Swap</h2>
      {currentAccount ? (
        <p>Connected as: {currentAccount.address}</p>
      ) : (
        <p>Please connect your Sui wallet using the button below.</p>
      )}
      <ConnectButton />
      <div className="mt-4 space-y-4">
        <div>
          <label className="block">From Token:</label>
          <select
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="SUI">SUI</option>
            <option value="USDC">USDC</option>
          </select>
        </div>
        <div>
          <label className="block">To Token:</label>
          <select
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="USDC">USDC</option>
            <option value="SUI">SUI</option>
          </select>
        </div>
        <div>
          <label className="block">Amount (in smallest unit):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Slippage Tolerance (%):</label>
          <input
            type="number"
            step="0.1"
            value={slippage}
            onChange={(e) => setSlippage(parseFloat(e.target.value))}
            className="border p-2 w-full"
          />
        </div>
      </div>
      {quoteOut && (
        <p className="mt-2">Expected Output: ~{quoteOut} (before slippage)</p>
      )}
      <button
        onClick={handleSwap}
        disabled={!currentAccount || isLoading || !amount}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
      >
        {isLoading ? "Swapping..." : "Swap"}
      </button>
      {txStatus && (
        <div className="mt-4">
          <p>{txStatus}</p>
        </div>
      )}
    </div>
  );
};

export default Swap;
