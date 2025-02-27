"use client";

import { Avatar, Heading, HStack, VStack } from "@yamada-ui/react";
import { useSetAtom } from "jotai";
import React, { useEffect } from "react";

import { useLiff } from "@/app/providers/LiffProvider";
import { useGetPromisesQuery } from "@/generated/graphql";
import { promisesListState } from "@/lib/jotai_state";
import { PromiseSchema } from "@/lib/type";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useLiff();
  const setPromisesList = useSetAtom(promisesListState);
  const { data } = useGetPromisesQuery({
    variables: {},
  });

  useEffect(() => {
    if (data && data?.promises !== null && data?.promises !== undefined) {
      console.log(data.promises);
      const promisesList = data.promises.map((promise) => {
        const promiseData = PromiseSchema.parse(promise);
        return promiseData;
      });
      if (promisesList.length === 0) {
        setPromisesList([]);
        return;
      }
      setPromisesList(promisesList);
    }
  }, [data]);

  return (
    <React.Fragment>
      <VStack p={12} minH="100vh" gap={8} alignItems="center">
        <HStack justifyContent="space-between" w="full">
          <Heading py={4}>ホーム</Heading>
          <Avatar src={user?.pictureUrl} />
        </HStack>
        {children}
      </VStack>
    </React.Fragment>
  );
}
