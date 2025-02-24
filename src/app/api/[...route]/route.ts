import { authHandler, verifyAuth } from "@hono/auth-js";
import { graphqlServer } from "@hono/graphql-server";
import { Hono } from "hono";
import { handle } from "hono/vercel";

import { schema } from "@/graphql/schema";
import { UserSimpleProfile } from "@/lib/type";

import { auth } from "../auth/[...nextauth]/auth";

const app = new Hono().basePath("/api");

console.log(process.env.DATABASE_URL);

app.get("/userProfile", async (c) => {
  const session = await auth();
  const user = session?.user as UserSimpleProfile;
  return c.json({ name: user.name, image: user.image });
});

app.use(
  "/graphql",
  graphqlServer({
    schema,
    graphiql: true,
  })
);

app.use("/auth/*", authHandler());

app.use("*", verifyAuth());

export const GET = handle(app);
export const POST = handle(app);
// export type AppType = typeof route;
