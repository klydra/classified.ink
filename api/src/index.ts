import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello Elysia").listen(8080);
