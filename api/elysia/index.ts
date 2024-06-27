import { Elysia } from "elysia";
import users from "api/elysia/routes/users.ts";

export const api = new Elysia().use(users).get("/health", () => "ok");

export type Api = typeof api;
