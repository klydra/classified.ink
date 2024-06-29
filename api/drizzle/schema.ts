import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";

export const usersTable = sqliteTable("users", {
  username: text("username").primaryKey(),
  secretKey: text("secret_key").notNull(),
});

export type UserSelect = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;

export const UserUsername = "^[\\w\\.\\-]{3,20}$";

export const notesTable = sqliteTable("notes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => ulid(new Date().getTime())),
  username: text("username")
    .notNull()
    .references(() => usersTable.username),
  blob: text("blob").notNull(),
  iv: text("iv").notNull(),
});

export type NoteSelect = typeof notesTable.$inferSelect;
export type NoteInsert = typeof notesTable.$inferInsert;
