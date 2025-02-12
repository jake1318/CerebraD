import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Use a relative base to ensure assets load correctly in production
  base: "./",
  plugins: [react()],
});
