import React from "react";
import { Box, Container, Heading, HStack, Text } from "@yamada-ui/react";
import { UserSimpleProfile } from "@/lib/type";
import { UserCard } from "./Card";

interface PromiseContentsProps {
  sender: UserSimpleProfile;
  receiver: UserSimpleProfile;
  content: string;
  deadline: string;
}

export const PromiseContents: React.FC<PromiseContentsProps> = ({
  sender,
  receiver,
  content,
  deadline,
}) => {
  return (
    <Container>
      {sender ? (
        <Container>
          <HStack>
            <UserCard user={sender} />
            <Text fontSize="6xl">が</Text>
            <UserCard user={receiver} />
            <Text fontSize="6xl">に</Text>
          </HStack>
          <Text fontSize="3xl">{content}</Text>
          <Text fontSize="3xl">期限 : {deadline}まで</Text>
        </Container>
      ) : (
        <Heading size="md" p={4}>
          ようこそ、ゲストさん
        </Heading>
      )}
    </Container>
  );
};
