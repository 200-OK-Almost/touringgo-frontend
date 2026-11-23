import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/lugares": {
        target: "http://localhost:8082",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/lugares/, ""),
      },
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});