import { Level } from "@prisma/client";
import { Container, HStack, Tag, Text, VStack } from "@yamada-ui/react";
import React from "react";

import { UserProfile } from "@/lib/type";
import { formatDate } from "@/lib/utils";

import { UserCard } from "./Card";

interface PromiseContentsProps {
  sender: UserProfile | null;
  receiver: UserProfile | null;
  direction: boolean;
  content: string;
  deadline: string | null;
  level: Level;
  color: string;
}

const strImportance = (level: Level) => {
  switch (level) {
    case Level.LOW:
      return "軽い約束";
    case Level.MEDIUM:
      return "少し重要";
    case Level.HIGH:
      return "お金が絡む";
  }
};

export const PromiseContents: React.FC<PromiseContentsProps> = ({
  sender,
  receiver,
  direction,
  content,
  deadline,
  level,
  color,
}) => {
  const haveBaseColor = color != null;

  return (
    <VStack
      backgroundColor={haveBaseColor ? "blackAlpha.300" : "white"}
      rounded="lg"
      p={4}
      justifyContent="center"
    >
      <Container
        py={1}
        px={4}
        bgColor={haveBaseColor ? color : "primary"}
        color="white"
        rounded="lg"
        alignItems="center"
        fontWeight={600}
      >
        <Text fontWeight={800} fontSize={24}>
          約束内容
        </Text>
      </Container>
      <Container color="white" gap={16} alignItems="center">
        <HStack>
          <UserCard user={direction ? receiver : sender} />
          <Text
            fontSize="5xl"
            fontWeight={800}
            color={haveBaseColor ? "white" : "black"}
          >
            が
          </Text>
          <UserCard user={direction ? sender : receiver} color="white" />
          <Text
            fontSize="5xl"
            fontWeight={800}
            color={haveBaseColor ? "white" : "black"}
          >
            に
          </Text>
        </HStack>
        <VStack>
          <HStack gap="10">
            <Tag
              bgColor={haveBaseColor ? color : "primary"}
              color="white"
              fontSize="lg"
              fontWeight={800}
            >
              内容
            </Tag>
            <Text fontSize="lg" fontWeight={600}>
              {content}
            </Text>
          </HStack>
          <HStack gap="10">
            <Tag
              bgColor={haveBaseColor ? color : "primary"}
              color="white"
              fontSize="lg"
              fontWeight={800}
            >
              期限
            </Tag>
            {deadline === null ? (
              <Text fontSize="lg" fontWeight={600}>
                期限なし
              </Text>
            ) : (
              <Text fontSize="lg" fontWeight={600}>
                {formatDate(deadline)}まで
              </Text>
            )}
          </HStack>
          <HStack gap="5">
            <Tag
              bgColor={haveBaseColor ? color : "primary"}
              color="white"
              fontSize="lg"
              fontWeight={800}
            >
              重要度
            </Tag>
            <Text fontSize="lg" fontWeight={600}>
              {strImportance(level)}
            </Text>
          </HStack>
        </VStack>
      </Container>
    </VStack>
  );
};
