"use client";

import { useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

import { useGetPromiseQuery } from "@/generated/graphql";
import { promiseState } from "@/lib/jotai_state";
import { PromiseSchema } from "@/lib/type";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      setPromise(promise);
    }
  }, [data, setPromise]);

  return <React.Fragment>{children}</React.Fragment>;
}
