import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { treaty } from "@elysiajs/eden";
import { Api } from "api/elysia";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const api = treaty<Api>(
  (import.meta.env.VITE_API_PROTOCOL ?? "https") +
    "://" +
    (import.meta.env.VITE_API_HOST ?? window.location.host) +
    (import.meta.env.VITE_API_PORT != null
      ? ":" + import.meta.env.VITE_API_PORT
      : ""),
);
