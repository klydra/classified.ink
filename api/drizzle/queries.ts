import { db } from "api/drizzle/config.ts";
import {
  type UserInsert,
  type UserSelect,
  usersTable,
} from "api/drizzle/schema.ts";
import { count, eq } from "drizzle-orm";

export async function userCount(): Promise<Array<{ count: number }>> {
  return await db.select({ count: count() }).from(usersTable).execute();
}

export async function userGet(username: string): Promise<Array<UserSelect>> {
  return await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .execute();
}

export async function userCreate(user: UserSelect): Promise<Array<UserInsert>> {
  return await db.insert(usersTable).values(user).returning().execute();
}

export async function userDelete(username: string) {
  return await db
    .delete(usersTable)
    .where(eq(usersTable.username, username))
    .execute();
}
