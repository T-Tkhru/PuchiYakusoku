import { Promise, UserProfile } from "./type";

export enum StatusEnum {
  IS_PENDING = "pending",         // 承認待ち
  IS_ACCEPTED = "is_accepted",    // 承認済み
  IS_COMPLETED = "completed",      // 完了
  CANCELED = "canceled",          // 取り消し済み
  MY_PROMISE = "my_promise",      // 自分の約束
  MY_PENDING = "my_pending",      // 自分が送ったが未承認の約束
}

const statusColors: Record<StatusEnum, string> = {
  [StatusEnum.IS_PENDING]: "white",
  [StatusEnum.IS_ACCEPTED]: "primary",
  [StatusEnum.IS_COMPLETED]: "white",
  [StatusEnum.CANCELED]: "gray",
  [StatusEnum.MY_PROMISE]: "primary",
  [StatusEnum.MY_PENDING]: "white",
};

interface Status {
  status: StatusEnum;
  baseColor: string;
}


export const defineStatus = (promise: Promise, user: UserProfile): Status => {
  const isMyPromise = promise.sender.displayName === user.displayName;

  if (promise.cancelAt) {
    return {
      status: StatusEnum.CANCELED,
      baseColor: statusColors[StatusEnum.CANCELED],
    };
  }

  if (promise.completedAt) {
    return {
      status: StatusEnum.IS_COMPLETED,
      baseColor: statusColors[StatusEnum.IS_COMPLETED],
    };
  }

  if (isMyPromise) {
    return {
      status: promise.isAccepted ? StatusEnum.MY_PROMISE : StatusEnum.MY_PENDING,
      baseColor: statusColors[promise.isAccepted ? StatusEnum.MY_PROMISE : StatusEnum.MY_PENDING],
    };
  }

  return {
    status: promise.isAccepted ? StatusEnum.IS_ACCEPTED : StatusEnum.IS_PENDING,
    baseColor: statusColors[promise.isAccepted ? StatusEnum.IS_ACCEPTED : StatusEnum.IS_PENDING],
  };
};

export const headerMessage = (senderName: string, status: Status) => {
  switch (status.status) {
    case StatusEnum.MY_PROMISE:
      return ["約束の達成は", "あなた次第だ！"];
    case StatusEnum.MY_PENDING:
      return ["相手の承認待ち...", "しばらく待ちましょう"];
    case StatusEnum.IS_ACCEPTED:
      return ["約束はまだ心の中...", "深呼吸しましょう...スー..."];
    case StatusEnum.IS_COMPLETED:
    case StatusEnum.IS_PENDING:
      return ["約束は達成されました！", "おめでとうございます！"];
    case StatusEnum.CANCELED:
      return ["約束はキャンセルされました", "また挑戦しましょう！"];
    default:
      return [`${senderName}さんから`, "約束が届いています！"];
  }
};

export const imageSource = (status: Status) => {
  switch (status.status) {
    case StatusEnum.MY_PROMISE:
    case StatusEnum.IS_ACCEPTED:
    case StatusEnum.MY_PENDING:
      return "/message.svg";
    case StatusEnum.IS_COMPLETED:
    case StatusEnum.IS_PENDING:
    case StatusEnum.CANCELED:
      return "/mail.svg";
    default:
      return "/mail.svg";
  }
};
