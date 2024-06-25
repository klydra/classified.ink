import {defineConfig} from 'vite'
import {TanStackRouterVite} from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: "app",
  plugins: [TanStackRouterVite(
    {
      routesDirectory: path.resolve(__dirname, "pages"),
      generatedRouteTree: path.resolve(__dirname, "app", "pages.gen.ts"),
      routeFileIgnorePrefix: "-",
      quoteStyle: "double"
    }
  ), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
})
