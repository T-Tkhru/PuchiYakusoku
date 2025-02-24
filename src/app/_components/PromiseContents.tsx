import { Level } from "@prisma/client";
import {
  Box,
  Container,
  Heading,
  HStack,
  Text,
  VStack,
} from "@yamada-ui/react";
import React from "react";

import { UserProfile } from "@/lib/type";
import { formatDate } from "@/lib/utils";

import { UserCard } from "./Card";

interface PromiseContentsProps {
  sender: UserProfile;
  receiver: UserProfile;
  content: string;
  deadline: string;
  level: Level;
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
  content,
  deadline,
  level,
}) => {
  return (
    <VStack
      backgroundColor="blackAlpha.300"
      rounded="md"
      p={4}
      justifyContent="center"
    >
      <Container
        p={2}
        bgColor="primary"
        color="white"
        rounded="lg"
        alignItems="center"
        fontWeight={600}
      >
        約束内容
      </Container>
      <Container color="white" gap={16}>
        <HStack>
          <UserCard user={sender} color="white" />
          <Text fontSize="4xl">が</Text>
          <UserCard user={receiver} color="white" />
          <Text fontSize="4xl">に</Text>
        </HStack>
        <VStack>
          <Text fontSize="md">内容 : {content}</Text>
          <Text fontSize="md">期限 : {formatDate(deadline)}まで</Text>
          <Text fontSize="md">重要度 : {strImportance(level)}</Text>
        </VStack>
      </Container>
    </VStack>
  );
};
