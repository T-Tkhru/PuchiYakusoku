import { Promise, UserProfile } from "./type";

export enum StatusEnum {
  UN_READ = "unread",
  IS_ACCEPTED = "is_accepted",
  IS_COMPLETED = "completed",
  MY_PROMISE = "my_promise",
}

const statusColors: Record<StatusEnum, string> = {
  [StatusEnum.UN_READ]: "secondary",
  [StatusEnum.IS_ACCEPTED]: "primary",
  [StatusEnum.MY_PROMISE]: "white",
  [StatusEnum.IS_COMPLETED]: "white",
};

interface Status {
  status: StatusEnum;
  baseColor: string;
}

export const taskStatus: Status = {
  status: StatusEnum.UN_READ,
  baseColor: statusColors[StatusEnum.UN_READ],
};

export const defineStatus = (promise: Promise, user: UserProfile): Status => {
  if (promise === null || promise === undefined) {
    return {
      status: StatusEnum.UN_READ,
      baseColor: statusColors[StatusEnum.UN_READ],
    };
  }
  if (promise.completedAt !== null) {
    return {
      status: StatusEnum.IS_COMPLETED,
      baseColor: statusColors[StatusEnum.IS_COMPLETED],
    };
  }
  if (promise.sender.displayName === user.displayName) {
    return {
      status: StatusEnum.MY_PROMISE,
      baseColor: statusColors[StatusEnum.MY_PROMISE],
    };
  }
  if (promise.isAccepted) {
    return {
      status: StatusEnum.IS_ACCEPTED,
      baseColor: statusColors[StatusEnum.IS_ACCEPTED],
    };
  } else {
    return {
      status: StatusEnum.UN_READ,
      baseColor: statusColors[StatusEnum.UN_READ],
    };
  }
};

export const headerMessage = (senderName: string, status: Status) => {
  if (status.status === StatusEnum.MY_PROMISE) {
    return ["約束は達成されるのを", "ひそかに待っている"];
  }
  if (status.status === StatusEnum.IS_ACCEPTED) {
    return ["約束はまだ心の中...", "深呼吸しましょう...スー..."];
  }
  if (status.status === StatusEnum.IS_COMPLETED) {
    return ["約束は達成されました！", "おめでとうございます！"];
  }
  return [`${senderName}さんから`, "約束が届いています！"];
};

export const imageSource = (status: Status) => {
  if (status.status === StatusEnum.MY_PROMISE) {
    return "/message.svg";
  }
  if (status.status === StatusEnum.IS_ACCEPTED) {
    return "/message.svg";
  }
  if (status.status === StatusEnum.IS_COMPLETED) {
    return "/mail.svg";
  }
  return "/mail.svg";
};
