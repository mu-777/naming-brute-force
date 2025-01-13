import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from "vite-tsconfig-paths"
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES
    ? "naming-brute-force"
    : "/",
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    watch: {
      usePolling: true
    },
    host: "0.0.0.0",
    port: 5173,
  },
})
