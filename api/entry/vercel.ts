import { api } from "api/elysia";

export default async function handler(request: Request) {
  return api.fetch(request);
}
