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

  const friendsMap = new Map<string, UserProfile>();

  promiseList.forEach((promise) => {
    [promise.sender, promise.receiver].forEach((user) => {
      if (user !== null && user.id !== userId) {
        friendsMap.set(user.id, user);
      }
    });
  });

  const friends = Array.from(friendsMap.values());
  
  const result: SummarizeResult = {
    total,
    completed,
    active,
    sent,
    friends,
  };
  return result;
};
