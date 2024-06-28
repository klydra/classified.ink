import { defineConfig } from "vite";
import * as child_process from "node:child_process";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";

const commitHash = child_process
  .execSync("git rev-parse --short HEAD")
  .toString();

const buildTime = new Date().toLocaleString("de-DE").replaceAll("/", ".");

process.env = {
  ...process.env,
  VITE_COMMIT_HASH: commitHash,
  VITE_BUILD_TIME: buildTime,
};

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
