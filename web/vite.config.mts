import {defineConfig} from 'vite'
import {TanStackRouterVite} from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react-swc'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: "app",
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
})
