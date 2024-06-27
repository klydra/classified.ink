import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { treaty } from "@elysiajs/eden";
import { Api } from "api/elysia";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const api = treaty<Api>(window.location.hostname + ":8080");
