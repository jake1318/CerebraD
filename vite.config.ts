import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load all environment variables from .env files.
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    envPrefix: ["VITE_", "NAVI_"],
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true
        }
      }
    },
    build: {
      rollupOptions: {}
    },
    define: {
      "process.env.VITE_DEEPBOOK_INDEXER_URL": JSON.stringify(
        env.VITE_DEEPBOOK_INDEXER_URL || "https://deepbook-v3.sui.io"
      ),
      "process.env.VITE_SUI_NETWORK": JSON.stringify(env.VITE_SUI_NETWORK || "mainnet")
    }
  };
});
