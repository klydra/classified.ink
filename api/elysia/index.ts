import { Elysia } from "elysia";
import users from "./routes/users.ts";
import cors from "@elysiajs/cors";
import notes from "./routes/notes.ts";

export const api = new Elysia()
  .use(cors())
  .use(users)
  .use(notes)
  .get("/health", () => "ok")
  .listen(parseInt((Bun.env.ELYSIA_API_PORT ?? Bun.env.PORT)!));

export type Api = typeof api;
