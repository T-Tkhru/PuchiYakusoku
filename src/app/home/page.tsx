"use client";

import { AlarmClockIcon, CirclePlusIcon } from "@yamada-ui/lucide";
import {
  Avatar,
  Button,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@yamada-ui/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import React from "react";

import { promisesListState, promiseState } from "@/lib/jotai_state";
import { Promise } from "@/lib/type";
import { formatDate } from "@/lib/utils";

import { useLiff } from "../providers/LiffProvider";

export default function Home() {
  const PromiseList = useAtomValue(promisesListState);
  const router = useRouter();

  return (
    <VStack gap={8}>
      <Button
        colorScheme="secondary"
        size="md"
        fontWeight={800}
        rounded="lg"
        h="32"
        onClick={() => {
          router.push("/");
        }}
        justifyContent="center"
        boxShadow="0px 6px #EB777B"
        _active={{
          transform: "translateY(2px)",
          backgroundColor: "pink.800",
          boxShadow: "none",
        }}
      >
        <VStack gap={1} alignItems="center">
          <Image src="/logo_puchi_only.svg" size="16" alt="プチ約束ロゴ" />
          <HStack gap={2}>
            <CirclePlusIcon fontSize="xl" />
            <Text>新しいプチ約束</Text>
          </HStack>
        </VStack>
      </Button>
      <VStack w="full" gap={4}>
        <HStack justifyContent="space-between" w="full">
          <Heading fontSize="xl">手持ちのプチ約束</Heading>
        </HStack>
        <VStack w="full" gap={4}>
          {PromiseList.length === 0 ? (
            <VStack w="full" gap={4} alignItems="center" p="8">
              <Text fontSize="sm" fontWeight={600}>
                プチ約束はありません
              </Text>
            </VStack>
          ) : null}
          {PromiseList.map((promise) => {
            return (
              <React.Fragment key={promise.id}>
                <EachPromiseCard promise={promise} />
              </React.Fragment>
            );
          })}
        </VStack>
      </VStack>
    </VStack>
  );
}

const EachPromiseCard = ({ promise }: { promise: Promise }) => {
  const { user } = useLiff();
  const router = useRouter();
  const setPromise = useSetAtom(promiseState);
  return (
    <Button
      key={promise.id}
      bgColor="gray.50"
      size="md"
      rounded="lg"
      h="20"
      onClick={() => {
        setPromise(promise);
        router.push(`/promise/${promise.id}`);
      }}
      boxShadow={"0px 4px #9C9C9CFF"}
      _active={{
        transform: "translateY(2px)",
        backgroundColor: "gray.50",
        boxShadow: "none",
      }}
    >
      <HStack w="full">
        {promise.sender?.displayName === user?.displayName ? (
          <Avatar
            src={promise.receiver?.pictureUrl as string}
            size="lg"
            border="2px solid"
            borderColor="primary"
          />
        ) : (
          <Avatar
            src={promise.sender?.pictureUrl as string}
            size="lg"
            border="2px solid"
            borderColor="secondary"
          />
        )}
        <VStack gap={2}>
          <Text size="sm" h="4" fontWeight={500} fontSize="sm">
            {promise.receiver ? promise.receiver.displayName : "ともだち"}
            {promise.isShare ? "と" : promise.direction ? "に" : "から"}
          </Text>
          <Text size="md" h="4" fontWeight={500}>
            {promise.content}
          </Text>
          {promise.dueDate ? (
            <HStack gap={2}>
              <AlarmClockIcon fontSize="sm" />
              <Text fontSize="sm" fontWeight={500}>
                {formatDate(promise.dueDate)}まで
              </Text>
            </HStack>
          ) : (
            <Text fontSize="sm" fontWeight={600}>
              期限なし
            </Text>
          )}
        </VStack>
      </HStack>
    </Button>
  );
};
