import { api } from "api/elysia";

export const config = {
  runtime: "edge",
};

export default async function handler(request: Request) {
  return api.fetch(request);
}
