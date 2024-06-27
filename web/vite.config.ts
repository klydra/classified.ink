import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: path.resolve(__dirname, "pages"),
      generatedRouteTree: path.resolve(__dirname, "app", "pages.gen.ts"),
      routeFileIgnorePrefix: "-",
      quoteStyle: "double",
      semicolons: true,
      enableRouteGeneration: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@/app": path.resolve(__dirname, "app"),
      "@/components": path.resolve(__dirname, "components"),
      "@/pages": path.resolve(__dirname, "pages"),
    },
  },
});
