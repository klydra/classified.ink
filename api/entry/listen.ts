import { api } from "elysia";

api.listen(parseInt(Bun.env.ELYSIA_API_PORT!));
