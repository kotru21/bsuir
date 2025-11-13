import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: path.resolve(rootDir),
  base: "/admin/",
  build: {
    outDir: "../../dist/admin",
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      "/admin/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
