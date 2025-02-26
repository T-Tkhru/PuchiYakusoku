import { Level } from "@prisma/client";
import {
  Box,
  Container,
  Heading,
  HStack,
  Tag,
  Text,
  VStack,
  Wrap,
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
  content,
  deadline,
  level,
  color,
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
        bgColor={color}
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
          <UserCard user={sender} color="white" />
          <Text fontSize="5xl" fontWeight={800}>
            が
          </Text>
          <UserCard user={receiver} color="white" />
          <Text fontSize="5xl" fontWeight={800}>
            に
          </Text>
        </HStack>
        <VStack>
          <HStack>
            <Tag bgColor={color} color="white" fontSize="lg" fontWeight={800}>
              内容
            </Tag>
            <Text fontSize="lg" fontWeight={600}>
              {content}
            </Text>
          </HStack>
          <HStack>
            <Tag bgColor={color} color="white" fontSize="lg" fontWeight={800}>
              期限
            </Tag>
            <Text fontSize="lg" fontWeight={600}>
              {formatDate(deadline)}まで
            </Text>
          </HStack>
          <HStack>
            <Tag bgColor={color} color="white" fontSize="lg" fontWeight={800}>
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
