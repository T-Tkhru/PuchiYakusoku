"use client";

import { Text } from "@yamada-ui/react";
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
  const { data, error } = useGetPromiseQuery({
    variables: {
      id: params.promiseId,
    },
  });
  console.log(params);
  console.log(data);
  console.log(error);

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
    }
  }, [data, setPromise]);

  if (error) {
    console.error(error);
    alert(error);
    return <Text>エラーが発生したみたい。詳細:{error.message}</Text>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
