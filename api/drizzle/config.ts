import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const client = createClient({
  url: Bun.env.TURSO_DATABASE_URL!,
  authToken: Bun.env.TURSO_AUTH_TOKEN!,
});
export const db = drizzle(client);
