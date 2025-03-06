import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";

import { useLiff } from "@/app/providers/LiffProvider";
import { useGetPromisesQuery } from "@/generated/graphql";
import { promisesListState, summarizeResultState } from "@/lib/jotai_state";
import { summarize } from "@/lib/summarize";
import { Promise, PromiseSchema, SummarizeResultSchema } from "@/lib/type";

export const usePromiseList = () => {
  const [promises, setPromises] = useAtom(promisesListState);
  const { data } = useGetPromisesQuery({
    variables: {},
  });
  const setSummarizeResult = useSetAtom(summarizeResultState);
  const { user } = useLiff();

  useEffect(() => {
    if (data?.sentPromises && data?.receivedPromises) {
      const promisesList = [...data.sentPromises, ...data.receivedPromises].map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (promise: any) => {
          const promiseData = PromiseSchema.parse(promise);
          return promiseData;
        }
      );
      if (promisesList.length === 0) {
        setPromises([]);
        return;
      }
      setPromises(promisesList);
      if (!user) {
        return;
      }
      const summary = summarize(promisesList, user.id);
      setSummarizeResult(SummarizeResultSchema.parse(summary));
    }
  }, [data, user]);

  const removePromiseById = (id: string) => {
    setPromises((prev) => prev.filter((promise: Promise) => promise.id !== id));
  };

  const addPromise = (newPromise: Promise) => {
    setPromises((prev) => [...prev, newPromise]);
  };

  const filterByCompleted = (completed: boolean) => {
    return promises.filter((promise) => {
      if (completed) {
        return promise.completedAt !== null;
      }
      return promise.completedAt === null;
    });
  };

  return {
    promises,
    removePromiseById,
    addPromise,
    filterByCompleted,
  };
};
