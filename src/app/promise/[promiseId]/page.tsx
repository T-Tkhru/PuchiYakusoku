"use client";

import { Level } from "@prisma/client";
import {
  Avatar,
  Button,
  Divider,
  HStack,
  Text,
  VStack,
} from "@yamada-ui/react";
import Image from "next/image";
import { useParams } from "next/navigation";

import { PromiseContents } from "@/app/_components/PromiseContents";
import { GetPromiseQuery, useGetPromiseQuery } from "@/generated/graphql";
import { UserProfile } from "@/lib/type";
import { formatDate } from "@/lib/utils";

export default function PromiseDetail() {
  const params = useParams() as { promiseId: string };
  const { data, loading, error } = useGetPromiseQuery({
    variables: {
      id: params.promiseId,
    },
  });

  if (!data || !data.promise) return <p>No data found</p>;

  const promise: GetPromiseQuery["promise"] = data.promise;

  return (
    <VStack
      bgColor="secondary"
      px={8}
      py={12}
      minH="100vh"
      gap={8}
      alignItems="center"
    >
      <Image
        src="/mail.png"
        alt="mail icon"
        width={200}
        height={200}
        objectFit="contain"
      />
      <HStack color="white" gap={4}>
        <Avatar
          src={promise.sender?.pictureUrl as string}
          size="md"
          border="2px solid"
          borderColor="white"
        />
        <VStack alignItems="flex-start" gap={2}>
          <Text>{promise.sender?.displayName}さんから</Text>
          <Text>約束が届いています！</Text>
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
      />
      <VStack w="full">
        <VStack>
          <Button colorScheme="primary">約束する</Button>
          <Button
            variant="outline"
            color="white"
            borderColor="white"
            onClick={() => {}}
            colorScheme="blackAlpha"
            backgroundColor="blackAlpha.300"
          >
            キャンセルする
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
}
