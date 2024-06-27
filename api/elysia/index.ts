import { Elysia } from "elysia";
import users from "api/elysia/routes/users.ts";
import cors from "@elysiajs/cors";

export const api = new Elysia()
  .use(cors())
  .use(users)
  .get("/health", () => "ok")
  .listen(parseInt((Bun.env.ELYSIA_API_PORT ?? Bun.env.PORT)!));

export type Api = typeof api;
