import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [react(), tailwind()],
    server: isDev
      ? {
          proxy: {
            "/api": {
              target: process.env.VITE_API_URL || "http://localhost:3000",
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined,
  };
});
