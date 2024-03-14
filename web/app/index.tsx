import React from "react";
import ReactDOM from "react-dom/client";
import "@/app/globals.css";
import Home from "@/pages/home/home.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  </React.StrictMode>,
);
