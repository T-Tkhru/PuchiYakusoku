"use client";

import { useAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { useGetPromiseQuery } from "@/generated/graphql";
import { promiseState } from "@/lib/jotai_state";
import { PromiseSchema } from "@/lib/type";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const [promise, setPromise] = useAtom(promiseState);
  const promiseId = params.promiseId as string | undefined;

  const { data } = useGetPromiseQuery(
    promiseId !== undefined
      ? {
          variables: { id: promiseId },
        }
      : { skip: true }
  );

  useEffect(() => {
    if (
      !promise &&
      promiseId &&
      data?.promise !== null &&
      data?.promise !== undefined
    ) {
      const promise = PromiseSchema.parse(data.promise);
      setPromise(promise);
    } else if (!promiseId && promise) {
      router.push("/");
    }
  }, [promiseId, data, setPromise, promise, router]);

  return <React.Fragment>{children}</React.Fragment>;
}
