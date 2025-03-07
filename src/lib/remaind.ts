"use server";

import { prisma } from "./prisma";
import { Promise as PromiseType, UserProfile } from "./type";

const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

enum PromiseStatus {
  NORMAL = "normal",
  NEAR_DEADLINE = "near_deadline",
  DEADLINE_TODAY = "deadline_today",
}

const getPromiseStatus = (dueDateStr: string | null): PromiseStatus => {
  if (!dueDateStr) return PromiseStatus.NORMAL;

  const now = new Date();
  const dueDate = new Date(dueDateStr);

  if (isNaN(dueDate.getTime())) {
    console.error(`約束の内容が無効かも?: ${dueDateStr}`);
    return PromiseStatus.NORMAL;
  }

  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays < 1 && diffDays >= 0) {
    return PromiseStatus.DEADLINE_TODAY;
  } else if (diffDays < 7 && diffDays >= 1) {
    return PromiseStatus.NEAR_DEADLINE;
  } else {
    return PromiseStatus.NORMAL;
  }
};

export const sendRemind = async (
  user: UserProfile,
  promise: PromiseType
): Promise<void | Error> => {
  try {
    const receiver = await prisma.user.findFirst({
      where: { id: promise.receiver?.id },
    });
    const sender = await prisma.user.findFirst({
      where: { id: promise.sender?.id },
    });

    const messageFrom = user;
    const messageTo = user.id === promise.sender.id ? receiver : sender;
    if (messageTo == null) {
      return;
    }

    const status = getPromiseStatus(promise.dueDate);

    let messageText = `${messageFrom?.displayName}さんとの約束、忘れてない…？`;
    let imageUrl = "https://i.gyazo.com/c5f84a06b8a799695d26b20c688ac9a7.jpg";

    switch (status) {
      case PromiseStatus.DEADLINE_TODAY:
        messageText += " 今日が期限だよ！";
        imageUrl = "https://i.gyazo.com/b22b461614cd8d2823b78b9641211a55.jpg";
        break;
      case PromiseStatus.NEAR_DEADLINE:
        messageText += " そろそろ期限が近いみたいだよ！";
        imageUrl = "https://i.gyazo.com/b652e487fdd3c44f4f099c5dd41efd63.jpg";
        break;
      default:
        break;
    }

    const response = await fetch(
      "https://api.line.me/v2/bot/message/multicast",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lineToken}`,
        },
        body: JSON.stringify({
          to: [messageTo.id],
          messages: [
            {
              type: "template",
              altText: messageText,
              template: {
                type: "buttons",
                thumbnailImageUrl: imageUrl,
                imageAspectRatio: "rectangle",
                imageSize: "cover",
                imageBackgroundColor: "#6ac1b7",
                text: messageText,
                actions: [
                  {
                    type: "uri",
                    label: "プチ約束を確認する",
                    uri: `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/?query=${promise.id}`,
                  },
                ],
              },
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
