"use client";

import { Heading, Loading, VStack } from "@yamada-ui/react";
import { useAtomValue } from "jotai";

import { GetPromisesQuery, useGetPromisesQuery } from "@/generated/graphql";
import { superBaseIdState } from "@/lib/jotai_state";

import { useLiff } from "../providers/LiffProvider";

export default function Home() {
  const { user } = useLiff();
  const superBaseId = useAtomValue(superBaseIdState);
  const { data, loading, error } = useGetPromisesQuery({
    variables: {},
  });

  if (!data || !data.promises)
    return (
      <VStack
        bgColor="primary"
        px={8}
        py={12}
        minH="100vh"
        gap={8}
        alignItems="center"
      >
        <Loading color="white" fontSize="1XL" speed="0.65s" />
      </VStack>
    );

  const promises: GetPromisesQuery["promises"] = data.promises;
  console.log(promises);
  return (
    <VStack px={8} py={12} minH="100vh" gap={8} alignItems="center">
      <Heading py={4}>ホーム</Heading>
    </VStack>
  );
}
