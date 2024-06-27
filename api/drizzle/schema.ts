import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  username: text("username").primaryKey(),
  secretKey: text("secret_key").notNull(),
});

export type UserSelect = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;

export const UserUsername = "^[\\w\\.\\-]{3,20}$";
