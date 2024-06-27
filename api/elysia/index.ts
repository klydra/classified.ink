import { Elysia } from "elysia";
import users from "./routes/users.ts";
import cors from "@elysiajs/cors";

export const api = new Elysia()
  .use(cors())
  .use(users)
  .get("/health", () => "ok");

export type Api = typeof api;
