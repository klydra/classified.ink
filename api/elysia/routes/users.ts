import { Elysia, t } from "elysia";
import { userCount, userCreate, userGet } from "../../drizzle/queries.ts";
import { UserUsername } from "../../drizzle/schema.ts";

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
        secretKey: t.String(),
      }),
    },
  )
  .post(
    "/delete",
    async ({ body: { username, secretKey }, error }) => {
      const user = await userGet(username);

      if (!user) return error(500, "Could not retrieve user");

      if (user.length !== 1) return error(404, "User does not exist");
    },
    {
      body: t.Object({
        username: t.String({ format: "regex", regex: UserUsername }),
        secretKey: t.String(),
      }),
    },
  );
