"use client";

import { useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

import { useLiff } from "@/app/providers/LiffProvider";
import { useGetPromiseQuery } from "@/generated/graphql";
import { promiseState } from "@/lib/jotai_state";
import { PromiseSchema, UserProfileSchema } from "@/lib/type";

export default function PromiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useLiff();

  const params = useParams() as { promiseId: string };
  const setPromise = useSetAtom(promiseState);
  const { data } = useGetPromiseQuery({
    variables: {
      id: params.promiseId,
    },
  });

  useEffect(() => {
    if ((data && data?.promise !== null) || data?.promise !== undefined) {
      console.log(data.promise);
      const promise = PromiseSchema.parse(data.promise);
      if (user?.id !== promise.sender.id && user) {
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
    }
  }, [data, setPromise]);

  return <React.Fragment>{children}</React.Fragment>;
}
