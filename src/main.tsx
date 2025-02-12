// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "@mysten/dapp-kit/dist/index.css";
import "./index.css";

// Create a new QueryClient instance.
const queryClient = new QueryClient();

// Define the network configuration for Sui.
const networkConfig = {
  mainnet: { url: getFullnodeUrl("mainnet"), transport: fetch },
  testnet: { url: getFullnodeUrl("testnet"), transport: fetch },
};

// Use default network from environment variables or fallback to "mainnet"
const defaultNetwork = import.meta.env.VITE_SUI_NETWORK || "mainnet";

// Get the root element from the HTML.
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider
          networks={networkConfig}
          defaultNetwork={defaultNetwork}
        >
          <WalletProvider autoConnect={true}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
