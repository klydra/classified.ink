import { defineConfig } from "vite";
import * as child_process from "node:child_process";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";

const commitHash = child_process
  .execSync("git rev-parse --short HEAD")
  .toString();

process.env = {
  ...process.env,
  VITE_COMMIT_HASH: commitHash,
};

export default defineConfig({
  define: {
    VITE_COMMIT_HASH: JSON.stringify(commitHash),
  },
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
