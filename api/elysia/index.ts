import { Elysia } from "elysia";
import users from "./routes/users.ts";
import cors from "@elysiajs/cors";

const api = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(cors())
  .use(users)
  .listen(parseInt(Bun.env.ELYSIA_API_PORT!));

export type Api = typeof api;
