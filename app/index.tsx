import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/app/pages.gen.ts";
import "@/app/globals.css";

const router = createRouter({
  routeTree,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);
