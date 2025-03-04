"use server";

import { prisma } from "./prisma";
import { Promise as PromiseType, UserProfile } from "./type";

const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

export const sendMessage = async (
  user: UserProfile,
  promise: PromiseType,
  message: string,
  isReminder: boolean
): Promise<void | Error> => {
  try {
    const receiver = await prisma.user.findFirst({
        where: { id: promise.receiver?.id },
    });
    const sender = await prisma.user.findFirst({
        where: { id: promise.sender?.id },
    });
    
    const messageTo =
      user.id === promise.sender.id ? receiver : sender;
    const messageFrom = user;
    
    const response = await fetch(
      `https://api.line.me/v2/bot/message/multicast`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lineToken}`,
        },
        body: JSON.stringify({
          to: [messageTo?.userId],
          messages: [
            {
              type: "text",
              text: `${messageFrom?.displayName}が${message}と言っているよ！
            ${
              isReminder
                ? `\nhttps://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}` +
                  `/?query=${promise.id}`
                : ""
            }`,
            },
          ],
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Error fetching auth user data: ${response.status}`);
    }
  } catch (error) {
    return error instanceof Error
      ? error
      : new Error("An unknown error occurred");
  }
};
