"use server"

import { Promise as PromiseType } from "./type";

const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

export const sendMessage = async (promise: PromiseType, message:string): Promise<void | Error> => {
  try {
    const messageTo = promise.direction ? promise.receiver : promise.sender;
    const messageFrom = promise.direction ? promise.sender : promise.receiver;
    const response = await fetch(`https://api.line.me/v2/bot/message/multicast`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lineToken}`,
      },
      body: JSON.stringify({
          to: messageTo?.id,
          messages: [
            {
              type: "text",
              text: `${messageFrom?.displayName}から${message}と言っているよ！`,
            },
          ],
        }),
    });
    if (!response.ok) {
      throw new Error(`Error fetching auth user data: ${response.status}`);
    }
    
  } catch (error) {
    return error instanceof Error
      ? error
      : new Error("An unknown error occurred");
  }
};

