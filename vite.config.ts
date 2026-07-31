import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["portfolio-bsg.onrender.com"],
  },
  preview: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT || "8080"),
    allowedHosts: ["portfolio-bsg.onrender.com"],
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
