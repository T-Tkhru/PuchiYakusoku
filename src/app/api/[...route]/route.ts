import { authHandler, verifyAuth } from "@hono/auth-js";
import { graphqlServer } from "@hono/graphql-server";
import { Hono } from "hono";
import { handle } from "hono/vercel";

import { schema } from "@/graphql/schema";
import { UserSimpleProfile, UserSimpleProfileSchema } from "@/lib/type";

import { auth } from "../auth/[...nextauth]/auth";

type Variables = {
  user: UserSimpleProfile;
};

const app = new Hono<{ Variables: Variables }>().basePath("/api");

app.use(async (c, next) => {
  const session = await auth();
  if (!session) {
    const lineLoginUrl = "/";
    return c.redirect(lineLoginUrl);
  }
  const user = UserSimpleProfileSchema.parse(session?.user);
  c.set("user", user);
  await next();
});

app.use("/userProfile", async (c) => {
  const session = await auth();
  console.log(session);
  const user = UserSimpleProfileSchema.parse(session?.user);
  return c.json({ name: user.name, image: user.image, id: user.id });
});

const rootResolver = (c: {
  get: (arg0: string) => { image: string; name: string; id: string };
}) => {
  return {
    user: () => c.get("user") as UserSimpleProfile,
  };
};

app.use(
  "/graphql",
  graphqlServer({
    schema,
    rootResolver,
    graphiql: true,
  })
);

app.use("/auth/*", authHandler());

app.use("*", verifyAuth());

export const GET = handle(app);
export const POST = handle(app);
// export type AppType = typeof route;
