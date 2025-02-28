"use client";

import {
  AlarmClockIcon,
  ArrowRightIcon,
  CirclePlusIcon,
} from "@yamada-ui/lucide";
import {
  Avatar,
  Button,
  Heading,
  HStack,
  Image,
  Loading,
  Text,
  VStack,
} from "@yamada-ui/react";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import React from "react";

import { promisesListState } from "@/lib/jotai_state";
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
          boxshadow: "none",
        }}
      >
        <VStack gap={1} alignItems="center">
          <Image src="/logo_puchi_only.svg" size="16" />
          <HStack gap={2}>
            <CirclePlusIcon fontSize="xl" />
            <Text>新しいプチ約束</Text>
          </HStack>
        </VStack>
      </Button>
      <VStack w="full" gap={4}>
        <Heading fontSize="xl">最近のウゴキ</Heading>
        <Button
          colorScheme="primary"
          boxShadow="0px 6px teal"
          size="md"
          fontWeight={800}
          rounded="lg"
          h="24"
          onClick={() => {}}
          _active={{
            transform: "translateY(2px)",
            backgroundColor: "teal.800",
            boxshadow: "none",
          }}
        >
          約束する
        </Button>
      </VStack>
      <VStack w="full" gap={4}>
        <HStack justifyContent="space-between" w="full">
          <Heading fontSize="xl">手持ちのプチ約束</Heading>
          <Button
            colorScheme="gray.300"
            variant="ghost"
            size="md"
            rounded="lg"
            fontSize="md"
            h="12"
            rightIcon={<ArrowRightIcon />}
            onClick={() => {}}
            fontWeight={600}
          >
            すべて見る
          </Button>
        </HStack>
        <VStack w="full" gap={4}>
          {PromiseList.length === 0 ? (
            <VStack w="full" gap={4} alignItems="center" p="8">
              <Loading variant="circles" fontSize="4xl" speed="0.65s" />
              <Text fontSize="sm" fontWeight={600}>
                プチ約束を読み込み中...
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
  return (
    <Button
      key={promise.id}
      bgColor="gray.50"
      size="md"
      rounded="lg"
      h="20"
      onClick={() => {
        router.push(`/promise/${promise.id}`);
      }}
      boxShadow={"0px 4px #9C9C9CFF"}
      _active={{
        transform: "translateY(2px)",
        backgroundColor: "gray.50",
        boxshadow: "none",
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
            {promise.direction ? "から" : "に"}
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
        {promise.completedAt === null && promise.direction ? null : (
          <Button
            backgroundColor="blackAlpha.700"
            color="white"
            px={6}
            size="md"
            fontWeight={800}
            rounded="lg"
            onClick={() => {}}
            _hover={{ backgroundColor: "blackAlpha.800" }}
            boxShadow="0px 2px #2B2B2BFF"
            _active={{
              transform: "translateY(2px)",
              backgroundColor: "blackAlpha.900",
              boxshadow: "none",
            }}
          >
            達成
          </Button>
        )}
      </HStack>
    </Button>
  );
};
