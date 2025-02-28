import { Level } from "@prisma/client";

import { UserProfile } from "./type";

export function getDueDate(value: string | null): string | null {
  const today = new Date();

  switch (value) {
    case "1day":
      today.setDate(today.getDate() + 1);
      break;
    case "1week":
      today.setDate(today.getDate() + 7);
      break;
    case "1month":
      today.setMonth(today.getMonth() + 1);
      break;
    case "none":
    case "other":
    default:
      return null;
  }

  return today.toISOString();
}

export const createMessageString = (user: UserProfile, importance: Level) => {
  let messageDetail = "";

  switch (importance) {
    case Level.LOW:
      messageDetail = "気軽な約束みたいだよ！";
      break;
    case Level.MEDIUM:
      messageDetail = "ちょっと大事な約束みたいだよ。";
      break;
    case Level.HIGH:
      messageDetail = "重要な約束みたいだから、忘れずにチェックしてね！";
      break;
    default:
      messageDetail = "約束の内容を確認してみてね！";
  }

  return `${user.displayName}さんが約束をプチりました！ ${messageDetail} 約束を確認してみてね！`;
};
