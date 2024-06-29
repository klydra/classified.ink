import { Elysia, t } from "elysia";
import {
  userCount,
  userCreate,
  userDelete,
  userGet,
} from "api/drizzle/queries.ts";
import { UserUsername } from "api/drizzle/schema.ts";
import { SECRET_LOCK_DERIVED_LENGTH } from "encryption/src/secret-lock.ts";
import SecretKey, { SECRET_KEY_LENGTH } from "encryption/src/secret-key.ts";

export default new Elysia({ prefix: "/users" })
  .get("/", async ({ error }) => {
    const count = await userCount();

    if (!count) return error(500, "Could not retrieve user count");

    if (count.length !== 1) return error(500, "Could not find user count");

    return count[0].count;
  })
  .post(
    "/get",
    async ({ body: { username }, error }) => {
      const user = await userGet(username);

      if (!user) return error(500, "Could not retrieve user");

      if (user.length === 0) return error(404, "User not found");

      if (user.length > 1) return error(500, "Multiple matching users found");

      return user[0];
    },
    {
      body: t.Object({
        username: t.String({ format: "regex", regex: UserUsername }),
      }),
    },
  )
  .post(
    "/create",
    async ({ body: { username, secretKey }, error }) => {
      const user = await userGet(username);

      if (!user) return error(500, "Could not retrieve user");

      if (user.length > 0) return error(409, "User already exists");

      const insert = await userCreate({ username, secretKey });

      if (!insert) return error(500, "Failed to create user");

      if (insert.length === 0)
        return error(500, "Could not retrieve created user");

      return insert[0];
    },
    {
      body: t.Object({
        username: t.String({ format: "regex", regex: UserUsername }),
        secretKey: t.String({
          minLength: SECRET_KEY_LENGTH,
          maxLength: SECRET_KEY_LENGTH,
        }),
      }),
    },
  )
  .post(
    "/delete",
    async ({ body: { username, derived }, error }) => {
      const user = await userGet(username);

      if (!user) return error(500, "Could not retrieve user");

      if (user.length !== 1) return error(404, "User does not exist");

      const secretKey = SecretKey.fromString(user[0].secretKey);

      if (!secretKey.proof(derived)) return error(403, "Authentication failed");

      const deleteUser = await userDelete(username);

      if (!deleteUser) return error(500, "Failed to delete user");

      if (deleteUser.rowsAffected !== 1)
        return error(500, "Could not delete user");
    },
    {
      body: t.Object({
        username: t.String({ format: "regex", regex: UserUsername }),
        derived: t.String({
          minLength: SECRET_LOCK_DERIVED_LENGTH,
          maxLength: SECRET_LOCK_DERIVED_LENGTH,
        }),
      }),
    },
  );
