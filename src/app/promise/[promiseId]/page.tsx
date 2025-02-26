"use client";

import { Level } from "@prisma/client";
import {
  Avatar,
  Button,
  Divider,
  HStack,
  Loading,
  Text,
  VStack,
} from "@yamada-ui/react";
import { useAtomValue } from "jotai";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

import { PromiseContents } from "@/app/_components/PromiseContents";
import { useLiff } from "@/app/providers/LiffProvider";
import { GetPromiseQuery, useGetPromiseQuery } from "@/generated/graphql";
import { superBaseIdState } from "@/lib/jotai_state";
import { defineStatus, headerMessage, imageSource } from "@/lib/status";
import { UserProfile } from "@/lib/type";

export default function PromiseDetail() {
  const params = useParams() as { promiseId: string };
  const { user } = useLiff();
  const superBaseId = useAtomValue(superBaseIdState);
  const { data, loading, error } = useGetPromiseQuery({
    variables: {
      id: params.promiseId,
    },
  });

  if (!data || !data.promise)
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

  const promise: GetPromiseQuery["promise"] = data.promise;
  const status = defineStatus(promise, superBaseId ?? "");

  return (
    <VStack
      bgColor={`${status.baseColor}.500`}
      px={8}
      py={12}
      minH="100vh"
      gap={8}
      alignItems="center"
    >
      <Image
        src={imageSource(status)}
        alt="mail icon"
        width={200}
        height={200}
        objectFit="contain"
      />
      <HStack color="white" gap={4}>
        <Avatar
          src={promise.sender?.pictureUrl as string}
          size="lg"
          border="4px solid"
          borderColor="white"
        />
        <VStack alignItems="flex-start" gap={2}>
          <Text fontWeight={600} fontSize="2xl">
            {headerMessage(promise.sender.displayName, status).map(
              (line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              )
            )}
          </Text>
        </VStack>
      </HStack>
      <VStack alignItems="center">
        <Divider orientation="horizontal" />
      </VStack>
      <PromiseContents
        sender={promise.sender as unknown as UserProfile}
        receiver={promise.receiver as unknown as UserProfile}
        content={promise.content as string}
        deadline={promise.dueDate as string}
        level={promise.level as Level}
        color={`${status.baseColor}.500`}
      />
      <VStack w="full">
        <VStack>
          <Button colorScheme="primary" size="lg" fontWeight={800}>
            約束する
          </Button>
          <Button
            variant="outline"
            color="white"
            borderColor="white"
            onClick={() => {}}
            colorScheme="blackAlpha"
            backgroundColor="blackAlpha.300"
            size="lg"
            fontWeight={800}
          >
            キャンセルする
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
}
