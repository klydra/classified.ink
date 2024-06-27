import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { treaty } from "@elysiajs/eden";
import { Api } from "api/elysia";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const api = treaty<Api>(
  "https://" +
    import.meta.env.VITE_API_HOST +
    ":" +
    import.meta.env.VITE_API_PORT,
);
