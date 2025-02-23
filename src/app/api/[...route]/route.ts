import { authHandler, verifyAuth } from "@hono/auth-js";
import { Hono } from "hono";
import { handle } from "hono/vercel";

import { UserSimpleProfile } from "@/lib/type";

import { auth } from "../auth/[...nextauth]/auth";

const app = new Hono().basePath("/api");

app.get("/userProfile", async (c) => {
  const session = await auth();
  // const name = session?.user?.name ?? "John Doe";
  const user = session?.user as UserSimpleProfile;
  return c.json({ name: user.name, image: user.image });
});

app.use("/auth/*", authHandler());

app.use("*", verifyAuth());

export const GET = handle(app);
export const POST = handle(app);
// export type AppType = typeof route;
