import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    proxy: {
      "/analyze-resume": "http://localhost:5000",
      "/health": "http://localhost:5000",
    },
  },
});
