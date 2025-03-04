import { useAtom } from "jotai";
import { useEffect } from "react";

import { useGetPromisesQuery } from "@/generated/graphql";
import { promisesListState } from "@/lib/jotai_state";
import { Promise, PromiseSchema } from "@/lib/type";

export const usePromiseList = () => {
  const [promises, setPromises] = useAtom(promisesListState);
  const { data  } = useGetPromisesQuery({
      variables: {},
  });
  
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
    }
  }, [data]);

  const removePromiseById = (id: string) => {
    setPromises((prev) => prev.filter((promise:Promise) => promise.id !== id));
  };

  return {
    promises,
    removePromiseById,
  };
};
