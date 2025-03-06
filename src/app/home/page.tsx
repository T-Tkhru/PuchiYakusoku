"use client";

import { AlarmClockIcon, CirclePlusIcon } from "@yamada-ui/lucide";
import {
  Avatar,
  Button,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  SegmentedControl,
  SegmentedControlButton,
  Text,
  VStack,
} from "@yamada-ui/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { usePromiseList } from "@/hooks/usePromiseList";
import { promiseState, summarizeResultState } from "@/lib/jotai_state";
import { Promise } from "@/lib/type";
import { formatDate } from "@/lib/utils";

import { Badge } from "../_components/Badge";
import {
  ActiveIcon,
  PuchiIcon,
  SendIcon,
  TotalIcon,
} from "../_components/Icon";
import { useLiff } from "../providers/LiffProvider";

const ITEMS_PER_PAGE = 5;

export default function Home() {
  const { filterByCompleted } = usePromiseList();
  const router = useRouter();
  const summaryResult = useAtomValue(summarizeResultState);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [filetedByCompleted, setFilteredByCompleted] = useState(false);

  return (
    <VStack gap={8}>
      <Button
        colorScheme="secondary"
        size="md"
        fontWeight={800}
        rounded="lg"
        h="32"
        onClick={() => {
          router.push("/promise/create");
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
          <Heading fontSize="xl">実績</Heading>
        </HStack>
        <Grid templateColumns="repeat(2, 1fr)" gap="sm">
          <GridItem colSpan={1}>
            <Badge
              icon={TotalIcon}
              text={summaryResult.completed.toString()}
              label="達成した"
            />
          </GridItem>
          <GridItem colSpan={1}>
            <Badge
              icon={SendIcon}
              text={summaryResult.sent.toString()}
              label="送った"
            />
          </GridItem>

          <GridItem colSpan={1}>
            <Badge
              icon={ActiveIcon}
              text={summaryResult.active.toString()}
              label="アクティブ"
            />
          </GridItem>
          <GridItem colSpan={1}>
            <Badge
              icon={PuchiIcon}
              text={summaryResult.total.toString()}
              label="全て"
            />
          </GridItem>
          <GridItem
            colSpan={2}
            justifyContent="space-between"
            w="full"
            px={4}
            py={2}
            border="2px solid"
            borderColor="border"
            rounded="md"
            fontSize="sm"
            fontWeight="bold"
            gap={0}
          >
            <HStack>
              {summaryResult.friends.map((friend, index) => (
                <Avatar
                  key={`friend-${index}`}
                  src={friend.pictureUrl as string}
                  size="md"
                />
              ))}
            </HStack>
            <Text color="gray">
              {summaryResult.friends.length}人の友達と約束を結んだよ
            </Text>
          </GridItem>
        </Grid>
      </VStack>

      <VStack w="full" gap={4}>
        <HStack justifyContent="space-between" w="full">
          <Heading fontSize="xl">手持ちのプチ約束</Heading>
        </HStack>
        <SegmentedControl
          colorScheme={filetedByCompleted ? "amber" : "primary"}
          border="2px solid"
          borderColor="border"
          defaultValue="active"
          rounded="md"
          size="sm"
          h="9"
          w="full"
          onChange={(value) => setFilteredByCompleted(value === "completed")}
        >
          <SegmentedControlButton value="active">
            アクティブ
          </SegmentedControlButton>
          <SegmentedControlButton value="completed">
            達成済み
          </SegmentedControlButton>
        </SegmentedControl>
        <VStack w="full" gap={3}>
          {filterByCompleted(filetedByCompleted).length === 0 ? (
            <VStack w="full" gap={4} alignItems="center" p="8">
              <Text fontSize="sm" fontWeight={600}>
                プチ約束はありません
              </Text>
            </VStack>
          ) : null}
          {filterByCompleted(filetedByCompleted)
            .slice(0, visibleCount)
            .map((promise, index) => (
              <React.Fragment key={`promise-${index}`}>
                <EachPromiseCard promise={promise} />
              </React.Fragment>
            ))}
        </VStack>
        {visibleCount < filterByCompleted(filetedByCompleted).length && (
          <Button
            colorScheme="primary"
            variant="ghost"
            size="md"
            fontWeight={800}
            rounded="lg"
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
            justifyContent="center"
            boxShadow="0px 6px #6ac1b7"
            backgroundColor="blackAlpha.200"
            _active={{
              transform: "translateY(2px)",
              backgroundColor: "pink.800",
              boxShadow: "none",
            }}
          >
            <Text>もっと見る</Text>
          </Button>
        )}
      </VStack>
    </VStack>
  );
}

const EachPromiseCard = ({ promise }: { promise: Promise }) => {
  const { user } = useLiff();
  const router = useRouter();
  const setPromise = useSetAtom(promiseState);
  const sender = promise.sender.displayName;
  const receiver = promise.receiver ? promise.receiver.displayName : "ともだち";
  return (
    <HStack
      w="full"
      p={4}
      key={promise.id}
      bgColor="white"
      rounded="lg"
      h="24"
      onClick={() => {
        setPromise(promise);
        router.push(`/promise/${promise.id}`);
      }}
      border="2px solid"
      borderColor="border"
      boxShadow={"0px 4px #dcdcde"}
      _hover={{
        backgroundColor: "blackAlpha.100",
      }}
      _active={{
        transform: "translateY(2px)",
        backgroundColor: "border",
        boxShadow: "none",
      }}
      cursor={"pointer"}
    >
      <Avatar
        src={
          promise.sender?.displayName === user?.displayName
            ? (promise.receiver?.pictureUrl ??
              "https://i.gyazo.com/e0b8d96b303094a01ebd5fc4aa530ed4.jpg")
            : promise.sender.pictureUrl
        }
        size="lg"
        border="2px solid"
        borderColor={"primary"}
      />
      <VStack gap={0} w="auto" overflow="hidden">
        <Text size="sm" fontWeight={500} fontSize="sm">
          {promise.direction ? sender : receiver}
          {promise.isShare ? " と " : " が "}
          {promise.direction ? receiver : sender}
          {promise.isShare ? " は " : " に "}
        </Text>
        <Text
          fontWeight={500}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {promise.content}
        </Text>
        {promise.dueDate ? (
          <HStack gap={1}>
            <AlarmClockIcon fontSize="sm" />
            <Text
              fontSize="sm"
              fontWeight={500}
              textOverflow="ellipsis"
              w="full"
              whiteSpace="nowrap"
            >
              {formatDate(promise.dueDate)}まで
            </Text>
          </HStack>
        ) : (
          <Text fontSize="sm" fontWeight={500}>
            期限なし
          </Text>
        )}
      </VStack>
    </HStack>
  );
};
