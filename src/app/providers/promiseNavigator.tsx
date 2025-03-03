"use client";

import { useSetAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

import { useGetPromiseQuery } from "@/generated/graphql";
import { promiseState } from "@/lib/jotai_state";
import { PromiseSchema, UserProfileSchema } from "@/lib/type";

import { useLiff } from "./LiffProvider";

export const PromiseNavigator = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const { user } = useLiff();

  const router = useRouter();
  const setPromise = useSetAtom(promiseState);

  const { data } = useGetPromiseQuery(
    query !== null
      ? {
          variables: { id: query },
        }
      : { skip: true }
  );

  useEffect(() => {
    if (data && data?.promise !== null && data?.promise !== undefined) {
      console.log(data.promise);
      const promise = PromiseSchema.parse(data.promise);
      if (
        user?.displayName !== promise.sender.displayName &&
        user &&
        promise.receiver === null
      ) {
        const newReceiverData = {
          id: user.id,
          displayName: user.displayName,
          pictureUrl: user.pictureUrl,
        };

        const newReceiver = UserProfileSchema.parse(newReceiverData);
        setPromise({ ...promise, receiver: newReceiver });
      } else {
        setPromise(promise);
      }
      router.replace(`/promise/${promise.id}`);
    }
  }, [query, setPromise]);

  if (query === null) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return <React.Fragment>{children}</React.Fragment>;
};
