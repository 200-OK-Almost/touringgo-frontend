import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const lugaresTarget = env.VITE_LUGARES_API_TARGET;

  return {
    plugins: [react()],
    server: {
      proxy: {
        ...(lugaresTarget
          ? {
              "/api/lugares": {
                target: lugaresTarget,
                changeOrigin: true,
                rewrite: (path: string) => path.replace(/^\/api\/lugares/, ""),
              },
            }
          : {}),
        "/api": {
          target: env.VITE_GATEWAY_TARGET || "http://localhost:8000",
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
