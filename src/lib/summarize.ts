import { Promise, SummarizeResult, UserProfile } from "./type";

export const summarize = (
  promiseList: Promise[],
  userId: string
): SummarizeResult => {
  const total = promiseList.length;
  const completed = promiseList.filter((p) => p.completedAt !== null).length;
  const active = promiseList.filter(
    (p) => p.completedAt === null && p.canceledAt === null
  ).length;
  const sent = promiseList.filter((p) => p.sender.id === userId).length;

  const friendsId = new Set(
    promiseList
      .map((promise) => promise.receiver)
      .filter(
        (promise): promise is UserProfile =>
          promise !== null && promise.id !== userId
      )
      .map((promise) => promise.id)
  );

  const friends = promiseList
    .map((promise) => promise.receiver)
    .filter(
      (promise): promise is UserProfile =>
        promise !== null && promise.id !== userId && friendsId.has(promise.id)
    )
    .filter(
      (promise, index, self) =>
        self.findIndex((user) => user.id === promise.id) === index
    ); 

  const result: SummarizeResult = {
    total,
    completed,
    active,
    sent,
    friends,
  };
  return result;
};
