import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    proxy: {
      "/analyze-resume": "https://resume-analyzer-xrb4.onrender.com/analyze-resume",
      "/health": "https://resume-analyzer-xrb4.onrender.com/analyze-resume",
    },
  },
});
