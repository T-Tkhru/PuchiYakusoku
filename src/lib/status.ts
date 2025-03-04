import { Promise, UserProfile } from "./type";

export enum StatusEnum {
  PENDING_SENDER = "pending_sender",      // 承認待ち（送信側）
  PENDING_RECEIVER = "pending_receiver",  // 承認待ち（受信側）
  IS_ACCEPTED  = "is_accepted",   // 承認済み
  IS_COMPLETED = "completed",     // 完了
  CANCELED = "canceled",          // 取り消し済み
}

const statusColors: Record<StatusEnum, string | null> = {
  [StatusEnum.PENDING_SENDER]: null,
  [StatusEnum.PENDING_RECEIVER]: "secondary",
  [StatusEnum.IS_ACCEPTED]: "primary",
  [StatusEnum.IS_COMPLETED]: null,
  [StatusEnum.CANCELED]: "gray",
};

interface Status {
  status: StatusEnum;
  baseColor: string | null;
}


export const defineStatus = (promise: Promise, user: UserProfile): Status => {
  const isMyPromise = promise.sender.displayName === user.displayName;

  if (promise.completedAt) {
    return {
      status: StatusEnum.IS_COMPLETED,
      baseColor: statusColors[StatusEnum.IS_COMPLETED],
    };
  }

  return {
    status: isMyPromise ? StatusEnum.PENDING_SENDER : StatusEnum.PENDING_RECEIVER,
    baseColor: statusColors[isMyPromise ? StatusEnum.PENDING_SENDER : StatusEnum.PENDING_RECEIVER],
  };

};

export const headerMessage = (senderName: string, status: Status) => {
  switch (status.status) {
    case StatusEnum.IS_ACCEPTED:
      return ["約束はまだ心の中...", "深呼吸しましょう...スー..."];
    case StatusEnum.IS_COMPLETED:
      return ["約束は達成されました！", "おめでとうございます！"];
    case StatusEnum.CANCELED:
      return ["約束はキャンセルされました", "また挑戦しましょう！"];
    case StatusEnum.PENDING_SENDER:
      return ["約束を送信しました", "相手の承認を待とう！"];
    case StatusEnum.PENDING_RECEIVER:
      return [`${senderName}さんから`, "約束が届いています！"];
    default:
      return [`${senderName}さんから`, "約束が届いています！"];
      
  }
};

export const imageSource = (status: Status) => {
  switch (status.status) {
    case StatusEnum.IS_ACCEPTED:
      return "/message.svg";
    case StatusEnum.IS_COMPLETED:
    case StatusEnum.CANCELED:
      return "/mail.svg";
    default:
      return "/mail.svg";
  }
};
