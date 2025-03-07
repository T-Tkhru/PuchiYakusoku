import { Promise, UserProfile } from "./type";

export enum StatusEnum {
  PENDING_SENDER = "pending_sender", // 承認待ち（送信側）
  PENDING_RECEIVER = "pending_receiver", // 承認待ち（受信側）
  IS_ACCEPTED = "is_accepted", // 承認済み
  IS_COMPLETED = "completed", // 完了
  CANCELED = "canceled", // 取り消し済み
  EXPIRED = "expired", // 期限切れ
}

const statusColors: Record<StatusEnum, string | null> = {
  [StatusEnum.PENDING_SENDER]: null,
  [StatusEnum.PENDING_RECEIVER]: "secondary",
  [StatusEnum.IS_ACCEPTED]: "primary",
  [StatusEnum.IS_COMPLETED]: "amber",
  [StatusEnum.CANCELED]: "gray",
  [StatusEnum.EXPIRED]: "gray",
};

interface Status {
  status: StatusEnum;
  baseColor: string | null;
  textColor: string;
  bgImage?: string;
}

export const defineStatus = (promise: Promise, user: UserProfile): Status => {
  const isMyPromise = promise.sender.displayName === user.displayName;

  if (promise.completedAt) {
    return {
      status: StatusEnum.IS_COMPLETED,
      baseColor: statusColors[StatusEnum.IS_COMPLETED],
      textColor: "black",
      bgImage: "/background/bg_yellow_wai.svg",
    };
  }

  if (promise.dueDate && new Date(promise.dueDate) < new Date()) {
    return {
      status: StatusEnum.EXPIRED,
      baseColor: statusColors[StatusEnum.EXPIRED],
      textColor: "white",
    };
  }

  if (promise.canceledAt) {
    return {
      status: StatusEnum.CANCELED,
      baseColor: statusColors[StatusEnum.CANCELED],
      textColor: "white",
    };
  }

  if (promise.isAccepted || promise.isAccepted === false) {
    return {
      status: StatusEnum.IS_ACCEPTED,
      baseColor: statusColors[StatusEnum.IS_ACCEPTED],
      textColor: "white",
    };
  }

  return {
    status: isMyPromise
      ? StatusEnum.PENDING_SENDER
      : StatusEnum.PENDING_RECEIVER,
    baseColor:
      statusColors[
        isMyPromise ? StatusEnum.PENDING_SENDER : StatusEnum.PENDING_RECEIVER
      ],
    textColor: isMyPromise ? "black" : "white",
  };
};

export const headerMessage = (senderName: string, status: Status) => {
  switch (status.status) {
    case StatusEnum.IS_ACCEPTED:
      return ["約束はまだ心の中...", "深呼吸しましょう..."];
    case StatusEnum.IS_COMPLETED:
      return ["約束が達成されたよ！", "おめでとう！！"];
    case StatusEnum.CANCELED:
      return ["約束はキャンセルされました", "ガーン..."];
    case StatusEnum.PENDING_SENDER:
      return ["約束を送信しました", "相手の承認を待とう！"];
    case StatusEnum.PENDING_RECEIVER:
      return [`${senderName}さんから`, "約束が届いています！"];
    case StatusEnum.EXPIRED:
      return ["約束の期限が切れました", "次こそは..."];
    default:
      return [`${senderName}さんから`, "約束が届いています！"];
  }
};

export const imageSource = (status: Status) => {
  switch (status.status) {
    case StatusEnum.IS_ACCEPTED:
      return "/status/stable.svg";
    case StatusEnum.IS_COMPLETED:
      return "/character/yellow_wai.svg";
    case StatusEnum.PENDING_SENDER:
      return "/character/pink_wkwk.svg";
    case StatusEnum.EXPIRED:
    case StatusEnum.CANCELED:
      return "/character/gray_gakkari.svg";
    case StatusEnum.PENDING_RECEIVER:
      return "/status/excited.svg";
    default:
      return "/status/excited.svg";
  }
};
