import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { treaty } from "@elysiajs/eden";
import { Api } from "api/elysia";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

console.log(import.meta.env);

export const api = treaty<Api>(
  window.location.hostname + ":" + import.meta.env.VITE_API_PORT,
);
