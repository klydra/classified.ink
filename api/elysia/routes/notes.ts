import { Elysia } from "elysia";
import { noteCount } from "../../drizzle/queries.ts";

export default new Elysia({ prefix: "/notes" }).get("/", async ({ error }) => {
  const count = await noteCount();

  if (!count) return error(500, "Could not retrieve note count");

  if (count.length !== 1) return error(500, "Could not find note count");

  return count[0].count;
});
