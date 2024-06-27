import { api } from "api/elysia";
import cors from "@elysiajs/cors";

api.use(cors()).listen(parseInt(Bun.env.ELYSIA_API_PORT!));
