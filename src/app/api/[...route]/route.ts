import { authHandler, verifyAuth } from "@hono/auth-js";
import { graphqlServer } from "@hono/graphql-server";
import axios from "axios";
import { Hono } from "hono";
import { handle } from "hono/vercel";

import { schema } from "@/graphql/schema";
import { prisma } from "@/lib/prisma";
import { UserSimpleProfileSchema } from "@/lib/type";
import { Level } from "@prisma/client";

import { auth } from "../auth/[...nextauth]/auth";

type Variables = {
  user: {
    userId: string;
    displayName: string;
    pictureUrl: string;
  };
  token: string;
};

interface LineProfileResponse {
  userId: string;
  displayName: string;
  pictureUrl: string;
}

const app = new Hono<{ Variables: Variables }>().basePath("/api");

function incrementNumbersInUUID(uuid: string, n: number): string {
  return uuid.replace(
    /\d/g,
    (digit) => ((parseInt(digit) + n) % 10).toString(),
  );
}

const validateToken = async (token: string) => {
  try {
    const response = await axios.get("https://api.line.me/oauth2/v2.1/verify", {
      params: { access_token: token },
    });
    return response.status === 200;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

const getUser = async (token: string) => {
  try {
    // LINEのプロフィール情報を取得するためのAPI
    const response = await axios.get("https://api.line.me/v2/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { userId, displayName, pictureUrl } = response
      .data as LineProfileResponse;
    return { userId, displayName, pictureUrl };
  } catch (error) {
    console.error("Error fetching user info from LINE:", error);
    return null;
  }
};

const createUser = async (token: string) => {
  const userProfile = await getUser(token);
  if (!userProfile) {
    console.error("Error fetching user info from LINE");
    return null;
  }

  const { userId, displayName, pictureUrl } = userProfile;
  const user = await prisma.user.upsert({
    where: { userId },
    update: { displayName, pictureUrl },
    create: {
      userId,
      displayName,
      pictureUrl,
    },
  });
  const promise = await prisma.promise.findUnique({
    where: {
      id: incrementNumbersInUUID(user.id, 1),
    },
  });
  if (promise) {
    return user;
  } else {
    await prisma.promise.createMany({
      data: [
        {
          id: incrementNumbersInUUID(user.id, 1),
          content: "ハッカソン優勝する！！🔥🔥🔥",
          level: Level.MEDIUM,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1日後
          direction: true,
          senderUserId: user.userId,
          receiverUserId: "Ueeaf4c5146e6f188a5f4a03c129bba16",
          isAccepted: true,
          isShare: true,
        },
        {
          id: incrementNumbersInUUID(user.id, 2),
          content: "終わったら打ち上げじゃい！🍻",
          level: Level.MEDIUM,
          dueDate: null,
          direction: true,
          senderUserId: user.userId,
          receiverUserId: "Ueb5d5f269e76bc2e38487ddac3d0b920",
          isAccepted: true,
          isShare: true,
        },
        {
          id: incrementNumbersInUUID(user.id, 3),
          content: "100万円貸してくれ、、🥹",
          level: Level.HIGH,
          dueDate: null,
          direction: false,
          senderUserId: user.userId,
          receiverUserId: "U07804dd37802a76aaacd85051d2f3780",
          isAccepted: true,
          isShare: false,
        },
      ],
    });
    return user;
  }
};

// ミドルウェアでアクセストークンを検証
app.use(async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1]; // Bearer token
  if (!token) {
    return c.json({ message: "Unauthorized" }, 401);
  }
  const isValid = await validateToken(token);
  if (!isValid) {
    return c.json({ message: "Invalid token" }, 401);
  }
  const user = await getUser(token);
  if (!user) {
    return c.json({ message: "Failed to fetch user info" }, 500);
  }
  c.set("token", token);
  c.set("user", user);
  await next();
});

// ログイン処理　コンテキストにユーザー情報をセット
app.post("/login", async (c) => {
  const token = c.get("token");
  const user = await createUser(token);
  if (!user) {
    return c.json({ message: "Failed to fetch user info" }, 500);
  }
  return c.json(
    { name: user.displayName, image: user.pictureUrl, id: user.id },
    200,
  );
});

app.use("/userProfile", async (c) => {
  const session = await auth();
  console.log(session);
  const user = UserSimpleProfileSchema.parse(session?.user);
  return c.json({ id: user.id });
});

app.use(
  "/graphql",
  graphqlServer({
    schema,
    graphiql: true,
  }),
);

app.use("/auth/*", authHandler());

app.use("*", verifyAuth());

export const GET = handle(app);
export const POST = handle(app);
// export type AppType = typeof route;
