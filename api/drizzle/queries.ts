import { db } from "api/drizzle/config.ts";
import {
  type NoteInsert,
  type NoteSelect,
  notesTable,
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

export async function noteCount(): Promise<Array<{ count: number }>> {
  return await db.select({ count: count() }).from(notesTable).execute();
}

export async function noteGetByUsername(
  username: string,
): Promise<Array<NoteSelect>> {
  return await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.username, username))
    .execute();
}

export async function noteGetById(id: string): Promise<Array<NoteSelect>> {
  return await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.id, id))
    .execute();
}

export async function noteCreate(note: NoteSelect): Promise<Array<NoteInsert>> {
  return await db.insert(notesTable).values(note).returning().execute();
}

export async function noteDelete(id: string) {
  return await db.delete(notesTable).where(eq(notesTable.id, id)).execute();
}
