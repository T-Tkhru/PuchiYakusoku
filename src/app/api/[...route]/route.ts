import { Hono } from "hono";

import { handle } from "hono/vercel";
import { auth } from "../auth/[...nextauth]/auth";

import { authHandler, verifyAuth } from "@hono/auth-js";
import {
  UserProfile,
  UserSimpleProfile,
  UserSimpleProfileSchema,
} from "@/lib/type";

const app = new Hono().basePath("/api");

const route = app.get("/userProfile", async (c) => {
  const session = await auth();
  // const name = session?.user?.name ?? "John Doe";
  console.log(session?.user);
  const user = session?.user as UserSimpleProfile;

  return c.json({ name: user.name, image: user.image });
});

app.use("/auth/*", authHandler());

app.use("*", verifyAuth());

export const GET = handle(app);
export const POST = handle(app);
export type AppType = typeof route;
